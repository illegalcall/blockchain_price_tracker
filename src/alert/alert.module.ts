import { Module } from '@nestjs/common';
import { AlertController } from './alert.controller';
import { AlertService } from './alert.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { TriggerData } from '../entities/TriggerData';

@Module({
  imports: [MikroOrmModule.forFeature([TriggerData])],
  controllers: [AlertController],
  providers: [AlertService],
})
export class AlertModule {}
