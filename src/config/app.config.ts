import { Configuration, Value } from '@itgorillaz/configify';

@Configuration()
export class AppConfig {
  @Value('PORT', {
    parse: (value: any) => parseInt(value),
  })
  port: number;
}
