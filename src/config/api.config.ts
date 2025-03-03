import { Configuration, Value } from '@itgorillaz/configify';
import { IsNotEmpty } from 'class-validator';

@Configuration()
export class ApiConfig {
  @IsNotEmpty()
  @Value('MORALIS_API_KEY')
  moralisAPIKey: string;

  @IsNotEmpty()
  @Value('MAILERSEND_API_KEY')
  mailerSendAPIkey: string;

  @IsNotEmpty()
  @Value('NODEMAILER_EMAIL')
  nodemailerEmail: string;

  @IsNotEmpty()
  @Value('NODEMAILER_PASSWORD')
  nodemailerPassword: string;
}
