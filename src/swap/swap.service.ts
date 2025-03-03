import { Injectable } from '@nestjs/common';
import { MoralisService } from '../moralis/moralis.service';
import { calculateAmountOut, calculateFee } from '../utils';

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

@Injectable()
export class SwapService {
  constructor(private readonly moralisService: MoralisService) {}

  async getSwapRate(
    chainId: string,
    tokenIn: string,
    tokenOut: string,
    amount: bigint,
  ) {
    const [priceIn, priceOut] = await Promise.all([
      this.moralisService.fetchPrice(tokenIn, chainId),
      this.moralisService.fetchPrice(tokenOut, chainId),
    ]);

    const amountOut = calculateAmountOut(amount, priceIn, priceOut);
    const fee = calculateFee(amountOut);

    return {
      amountIn: amount,
      tokenIn,
      tokenOut,
      amountOutBeforeFee: amountOut,
      amountOutAfterFee: amountOut - fee,
      totalFee: fee,
      chainId,
    };
  }
}
