import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { SUPPORTED_CHAIN_IDS, SUPPORTED_TOKENS } from '../common';
import { PriceData } from '../entities';
import { TriggerData } from '../entities/TriggerData';
import { MailersendService } from '../mailersend/mailersend.service';
import { MoralisService } from '../moralis/moralis.service';
import { isDifferenceGreaterThanThresholdBigInt } from '../utils';
import { v4 } from 'uuid';

@Injectable()
export class CronjobsService {
  constructor(
    private readonly moralisService: MoralisService,
    @InjectRepository(PriceData)
    private readonly priceDataRepo: EntityRepository<PriceData>,

    @InjectRepository(TriggerData)
    private readonly triggerDataRepo: EntityRepository<TriggerData>,
    private readonly em: EntityManager,

    private readonly mailerSendService: MailersendService,
  ) {}

  private readonly logger = new Logger(CronjobsService.name);

  // @Cron(CronExpression.EVERY_5_MINUTES)
  @Cron(CronExpression.EVERY_30_SECONDS)
  async savePrice() {
    try {
      this.logger.log('Starting to fetch price');

      const [ethPrice, polPrice] = await Promise.all([
        this.moralisService.fetchPrice(
          SUPPORTED_TOKENS.ETH,
          SUPPORTED_CHAIN_IDS.ETH_MAINNET,
        ),
        this.moralisService.fetchPrice(
          SUPPORTED_TOKENS.POL,
          SUPPORTED_CHAIN_IDS.POLYGON_MAINNET,
        ),
      ]);

      const [ethLatestPrice, polLatestPrice] = await Promise.all([
        this.priceDataRepo.findOne(
          { token: SUPPORTED_TOKENS.ETH },
          { orderBy: { timestamp: 'DESC' } },
        ),
        this.priceDataRepo.findOne(
          { token: SUPPORTED_TOKENS.POL },
          { orderBy: { timestamp: 'DESC' } },
        ),
      ]);

      this.logger.log('[Cronjob] Calculating Differences');

      // Only check for significant differences if we have previous prices
      if (ethLatestPrice) {
        const isDifferenceSignificantEth =
          isDifferenceGreaterThanThresholdBigInt(
            ethPrice,
            BigInt(ethLatestPrice.price),
          );

        if (isDifferenceSignificantEth) {
          this.logger.log('[Cronjob] Price Difference for ETH');
          this.logger.log(
            `[Cronjob] Sending email for ETH Latest Price: ${ethLatestPrice.price}, ETH Current Price: ${ethPrice}`,
          );
          await this.mailerSendService.sendEmail(
            SUPPORTED_TOKENS.ETH,
            BigInt(ethLatestPrice.price),
            ethPrice,
          );
        }
      }

      if (polLatestPrice) {
        const isDifferenceSignificantPol =
          isDifferenceGreaterThanThresholdBigInt(
            polPrice,
            BigInt(polLatestPrice.price),
          );

        if (isDifferenceSignificantPol) {
          this.logger.log('[Cronjob] Price Difference for POL');
          await this.mailerSendService.sendEmail(
            SUPPORTED_TOKENS.POL,
            BigInt(polLatestPrice.price),
            polPrice,
          );
        }
      }

      this.logger.log('[Cronjob] Saving price data in the db');

      await Promise.all([
        this.em.insert(PriceData, {
          price: ethPrice.toString(),
          token: SUPPORTED_TOKENS.ETH,
          uuid: v4(),
          timestamp: new Date(),
        }),
        this.em.insert(PriceData, {
          price: polPrice.toString(),
          token: SUPPORTED_TOKENS.POL,
          uuid: v4(),
          timestamp: new Date(),
        }),
      ]);

      this.logger.log('[Cronjob] Price data saved successfully');
    } catch (error) {
      this.logger.error('[Cronjob] Error in savePrice cron job:', error);
    }
  }
}
