import { Module } from '@nestjs/common';
import { PricesController } from './prices.controller';
import { PricesService } from './prices.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { PriceData } from '../entities';

@Module({
  imports: [MikroOrmModule.forFeature([PriceData])],
  controllers: [PricesController],
  providers: [PricesService],
})
export class PricesModule {}
