import { Test, TestingModule } from '@nestjs/testing';
import { AlertController } from './alert.controller';
import { AlertService } from './alert.service';
import { CreateTriggerPriceDto } from './dto/createPriceDto';
import { SUPPORTED_CHAIN_IDS, SUPPORTED_TOKENS } from '../common';
import { v4 } from 'uuid';
import { UUID } from 'crypto';

describe('AlertController', () => {
  let controller: AlertController;

  const triggerPriceData = {
    uuid: v4().toString(),
    chain: SUPPORTED_CHAIN_IDS.ETH_MAINNET,
    email: 'iamyxsh@gmail.com',
    triggerPrice: BigInt(1000),
    token: SUPPORTED_TOKENS.ETH,
  };

  const mockAlertService = {
    setPriceTrigger: jest.fn(() => {
      return v4().toString();
    }),

    getAllPriceTriggerForEmail: jest.fn(() => [triggerPriceData]),

    getPriceTriggerById: jest.fn(() => triggerPriceData),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AlertController],
      providers: [AlertService],
    })
      .overrideProvider(AlertService)
      .useValue(mockAlertService)
      .compile();

    controller = module.get<AlertController>(AlertController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('can set price trigger', async () => {
    const dto: CreateTriggerPriceDto = {
      price: 1000,
      chain: SUPPORTED_CHAIN_IDS.ETH_MAINNET,
      email: 'iamyxsh@gmail.com',
      token: SUPPORTED_TOKENS.ETH,
    };

    expect(await controller.setPriceTrigger(dto)).toEqual(expect.any(String));
    expect(mockAlertService.setPriceTrigger).toHaveBeenCalledWith(dto);
  });

  it('can get all triggers with email', async () => {
    const email = 'iamyxsh@gmail.com';

    expect(await controller.getAllPriceTriggerForEmail(email)).toEqual([
      triggerPriceData,
    ]);
    expect(mockAlertService.getAllPriceTriggerForEmail).toHaveBeenCalledWith(
      email,
    );
  });

  it('can get all triggers with email', async () => {
    const id = v4() as UUID;

    expect(await controller.getPriceTriggerById(id)).toEqual(triggerPriceData);
    expect(mockAlertService.getPriceTriggerById).toHaveBeenCalledWith(id);
  });
});
