import { Configuration, Value } from '@itgorillaz/configify';

@Configuration()
export class DbConfig {
  @Value('DB_TYPE')
  dbType: string;

  @Value('DB_HOST')
  dbHost: string;

  @Value('DB_URL')
  dbUrl: string;

  @Value('DB_PORT', {
    parse: (value: any) => parseInt(value),
  })
  dbPort: number;

  @Value('DB_USER')
  dbUser: string;

  @Value('DB_PASSWORD')
  dbPassword: string;

  @Value('DB_DBNAME')
  dbName: string;
}
