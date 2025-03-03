import { Test, TestingModule } from '@nestjs/testing';
import { SwapController } from './swap.controller';
import { SwapService } from './swap.service';
import { SUPPORTED_CHAIN_IDS, SUPPORTED_TOKENS } from '../common';

describe('SwapController', () => {
  let controller: SwapController;

  const mockSwapService = {
    getSwapRate: jest.fn((tokenAddress, amount, tokenOut, chain) => ({
      amountIn: amount,
      tokenIn: tokenAddress,
      tokenOut,
      amountOutBeforeFee: BigInt('1000000000000000000000'), // 1000 ETH
      amountOutAfterFee: BigInt('997000000000000000000'),   // 997 ETH
      totalFee: BigInt('3000000000000000000'),              // 3 ETH
      chainId: chain,
    })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SwapController],
      providers: [SwapService],
    })
      .overrideProvider(SwapService)
      .useValue(mockSwapService)
      .compile();

    controller = module.get<SwapController>(SwapController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should get the swap rate', async () => {
    const tokenIn = SUPPORTED_TOKENS.ETH;
    const amount = BigInt('1000000000000000000'); // 1 ETH
    const tokenOut = SUPPORTED_TOKENS.POL;
    const chainId = SUPPORTED_CHAIN_IDS.ETH_MAINNET;

    // Call the service directly
    await controller.getSwapRate(tokenIn, amount, tokenOut, chainId);

    // Verify the service was called with the right parameters
    expect(mockSwapService.getSwapRate).toHaveBeenCalledWith(
      chainId,
      tokenIn,
      tokenOut,
      amount,
    );
  });
});
