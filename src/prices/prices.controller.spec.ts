import { Test, TestingModule } from '@nestjs/testing';
import { PricesController } from './prices.controller';
import { PricesService } from './prices.service';
import { PriceData } from 'src/entities';
import { SUPPORTED_TOKENS } from '../common';
import { v4 } from 'uuid';

describe('PricesController', () => {
  let controller: PricesController;

  const token = SUPPORTED_TOKENS.ETH;

  const price: Partial<PriceData> = {
    price: BigInt(1000).toString(),
    timestamp: new Date(),
    uuid: v4(),
  };

  const mockPricesService = {
    getPrices: jest.fn((tokenAddress) => [{ ...price, token: tokenAddress }]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PricesController],
      providers: [PricesService],
    })
      .overrideProvider(PricesService)
      .useValue(mockPricesService)
      .compile();

    controller = module.get<PricesController>(PricesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('can get the prices for tokens', async () => {
    expect(await controller.getPrices(SUPPORTED_TOKENS.ETH)).toEqual([
      { ...price, token },
    ]);

    expect(mockPricesService.getPrices).toHaveBeenCalledWith(token);
  });
});
