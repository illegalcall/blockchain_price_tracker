import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable, Logger } from '@nestjs/common';
import { TriggerData } from '../entities/TriggerData';
import { CreateTriggerPriceDto } from './dto/createPriceDto';
import { v4 } from 'uuid';
import { SUPPORTED_CHAIN_IDS, SUPPORTED_TOKENS } from '../common';

@Injectable()
export class AlertService {
  private readonly logger = new Logger(AlertService.name);

  constructor(
    @InjectRepository(TriggerData)
    private readonly triggerDataRepo: EntityRepository<TriggerData>,
    private readonly em: EntityManager,
  ) {}

  async setPriceTrigger({
    chain,
    price,
    email,
    token,
  }: CreateTriggerPriceDto): Promise<string> {
    this.logger.log('Creating Trigger Data');
    const trigger = this.triggerDataRepo.create({
      uuid: v4(),
      chain,
      email,
      token,
      triggerPrice: BigInt(price),
    });
    this.logger.log('Saving Trigger Data in the DB');
    return this.em.insert(TriggerData, trigger);
  }

  async getAllPriceTriggerForEmail(email: string): Promise<TriggerData[]> {
    this.logger.log('fetching trigger data by email');
    return this.triggerDataRepo.find({
      email,
    });
  }

  async getPriceTriggerById(id: string): Promise<TriggerData> {
    this.logger.log('fetching trigger data by id');
    return this.triggerDataRepo.findOne({
      uuid: id,
    });
  }

  async getPriceTriggerForToken(
    token: SUPPORTED_TOKENS,
    chain: SUPPORTED_CHAIN_IDS,
    currentPrice: bigint,
  ): Promise<TriggerData[]> {
    return this.triggerDataRepo.find({
      token,
      chain,
      triggerPrice: { $lte: currentPrice },
    });
  }
}
