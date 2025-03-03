import { Injectable } from '@nestjs/common';
import { DbConfig } from '../src/config/db.config';

@Injectable()
export class TestDbConfig extends DbConfig {
  dbHost = process.env.DB_HOST || 'localhost';
  dbPort = parseInt(process.env.DB_PORT || '5432', 10);
  dbUser = process.env.DB_USER || 'myuser';
  dbPassword = process.env.DB_PASSWORD || 'mypassword';
  dbName = process.env.DB_NAME || 'mydatabase';
}
