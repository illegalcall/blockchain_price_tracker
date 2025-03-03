import { Injectable, Logger } from '@nestjs/common';
import { HYPERHIRE_EMAIL, SUPPORTED_TOKENS } from '../common';
import { ApiConfig } from '../config/api.config';
import { returnTokenName } from '../utils';
import { createTransport, Transporter } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

@Injectable()
export class MailersendService {
  private readonly logger = new Logger(MailersendService.name);

  transporter: Transporter<
    SMTPTransport.SentMessageInfo,
    SMTPTransport.Options
  >;

  constructor(private readonly configService: ApiConfig) {
    this.logger.log('Initializing email service');

    // Create nodemailer transport for Gmail
    this.transporter = createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PASSWORD,
      },
    });

    // Verify connection configuration
    this.transporter.verify((error, success) => {
      if (error) {
        this.logger.error('Email service initialization failed');
      } else {
        this.logger.log('SMTP server is ready to take messages');
      }
    });
  }

  async sendEmail(
    token: SUPPORTED_TOKENS,
    earlierPrice: bigint,
    latestPrice: bigint,
  ) {
    try {
      // Convert BigInt prices (assumed to be in smallest units) to decimals (e.g., USD)
      const divisor = 1e18; // Adjust this divisor if needed
      const latestPriceDecimal = Number(latestPrice) / divisor;
      const earlierPriceDecimal = Number(earlierPrice) / divisor;

      // Calculate the price difference and percentage change
      const priceDifference = latestPriceDecimal - earlierPriceDecimal;
      const percentageChange = (priceDifference / earlierPriceDecimal) * 100;

      // Use an emoji based on whether the price increased or decreased
      const changeEmoji = priceDifference >= 0 ? '📈' : '📉';

      // Craft an engaging subject line
      const subject = `${changeEmoji} Price Change Alert - ${returnTokenName(
        token,
      )}`;

      const info = await this.transporter.sendMail({
        from: `"Price Tracker" <${process.env.NODEMAILER_EMAIL}>`,
        to: HYPERHIRE_EMAIL,
        subject,
        text: `${changeEmoji} Price Change Alert for ${returnTokenName(
          token,
        )} ${changeEmoji}
  Latest Price: ${latestPriceDecimal.toFixed(4)}USD
  Earlier Price: ${earlierPriceDecimal.toFixed(4)}USD
  Change: ${percentageChange.toFixed(2)}% ${changeEmoji}
  
  Keep an eye on the market and happy trading! 🚀`,
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h2>${changeEmoji} Price Change Alert for ${returnTokenName(
          token,
        )} ${changeEmoji}</h2>
            <p><strong>Latest Price:</strong> ${latestPriceDecimal.toFixed(
              4,
            )} USD</p>
            <p><strong>Earlier Price:</strong> ${earlierPriceDecimal.toFixed(
              4,
            )} USD</p>
            <p><strong>Change:</strong> ${percentageChange.toFixed(
              2,
            )}% ${changeEmoji}</p>
            <p>Keep an eye on the market and happy trading! 🚀</p>
          </div>
        `,
      });
      return info;
    } catch (error) {
      this.logger.error('Email sending failed');
      throw error;
    }
  }
}
