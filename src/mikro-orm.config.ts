import { Options } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';

const config: Options = {
  driver: PostgreSqlDriver,
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  user: process.env.DB_USER || 'myuser',
  password: process.env.DB_PASSWORD || 'mypassword',
  dbName: process.env.DB_DBNAME || 'mydatabase',
  entities: ['./dist/entities/*.js'],
  entitiesTs: ['./src/entities/*.ts'],
  debug: true,
  migrations: {
    path: './dist/migrations',
    pathTs: './src/migrations',
    disableForeignKeys: false,
  },
};

export default config; 