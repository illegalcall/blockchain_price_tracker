import { Module } from '@nestjs/common';
import { CronjobsService } from './cronjobs.service';
import { ApiConfig } from '../config/api.config';
import { PriceData } from '../entities';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { MailersendModule } from '../mailersend/mailersend.module';
import { MailersendService } from '../mailersend/mailersend.service';
import { TriggerData } from '../entities/TriggerData';

@Module({
  imports: [
    MikroOrmModule.forFeature([PriceData, TriggerData]),
    MailersendModule,
  ],
  providers: [CronjobsService, ApiConfig, MailersendService],
})
export class CronjobsModule {}
