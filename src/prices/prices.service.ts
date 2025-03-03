import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { SUPPORTED_TOKENS } from '../common';
import { PriceData } from '../entities';
import { returnLast24HrTimestamp } from '../utils';

@Injectable()
export class PricesService {
  constructor(
    @InjectRepository(PriceData)
    private readonly pricedataRepo: EntityRepository<PriceData>,
  ) {}

  async getPrices(tokenAddress: SUPPORTED_TOKENS): Promise<PriceData[]> {
    return await this.pricedataRepo.find({
      token: tokenAddress,
      timestamp: { $gte: returnLast24HrTimestamp() },
    });
  }
}
