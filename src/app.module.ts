import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigifyModule } from '@itgorillaz/configify';
import { ScheduleModule } from '@nestjs/schedule';
import { CronjobsModule } from './cronjobs/cronjobs.module';
import { MoralisModule } from './moralis/moralis.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { DbConfig } from './config/db.config';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { MailersendModule } from './mailersend/mailersend.module';
import { PricesModule } from './prices/prices.module';
import { AlertModule } from './alert/alert.module';
import { SwapModule } from './swap/swap.module';
import { MikroORM } from '@mikro-orm/core';

@Module({
  imports: [
    ConfigifyModule.forRootAsync(),
    ScheduleModule.forRoot(),
    MikroOrmModule.forRootAsync({
      inject: [DbConfig],
      useFactory: async (dbConfig: DbConfig) => ({
        driver: PostgreSqlDriver,
        host: dbConfig.dbHost,
        port: dbConfig.dbPort,
        user: dbConfig.dbUser,
        password: dbConfig.dbPassword,
        dbName: dbConfig.dbName,
        entities: ['./dist/entities/*.js'],
        allowGlobalContext: true,
        debug: true,
      }),
    }),
    CronjobsModule,
    MoralisModule,
    MailersendModule,
    PricesModule,
    AlertModule,
    SwapModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly orm: MikroORM) {}

  async onModuleInit() {
    try {
      const generator = this.orm.getSchemaGenerator();
      await generator.updateSchema();
    } catch (error) {
      console.error('Failed to update database schema:', error);
      throw error;
    }
  }
}
