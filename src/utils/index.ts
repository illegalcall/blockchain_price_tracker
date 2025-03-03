import { ethers } from 'ethers';
import {
  DIFFERENCE_PERCENTAGE,
  FEE_BASIS_POINT,
  SUPPORTED_TOKENS,
} from '../common';

export function isDifferenceGreaterThanThresholdBigInt(
  num1: bigint,
  num2: bigint,
  thresholdPercent: number = DIFFERENCE_PERCENTAGE,
): boolean {
  const difference = num1 > num2 ? num1 - num2 : num2 - num1;
  const threshold =
    (BigInt(thresholdPercent) * BigInt(100) * (num1 < num2 ? num1 : num2)) /
    BigInt(10000);
  return difference > threshold;
}

export function returnTokenName(token: SUPPORTED_TOKENS): 'ETH' | 'POL' {
  switch (token) {
    case SUPPORTED_TOKENS.ETH:
      return 'ETH';
    case SUPPORTED_TOKENS.POL:
      return 'POL';
  }
}

export const returnLast24HrTimestamp = (): Date => {
  return new Date(new Date().getTime() - 24 * 60 * 60 * 1000);
};

export function formatMoralisPairUrl(
  baseUrl: string,
  chain: string,
  tokenIn: string,
): string {
  return `${baseUrl}/erc20/${tokenIn}/pairs?chain=${chain}`;
}

export function calculateAmountOut(
  amountIn: bigint,
  priceA: bigint,
  priceB: bigint,
): bigint {
  return ethers.parseEther(
    ((Number(priceA) / Number(priceB)) * Number(amountIn)).toString(),
  );
}

export function calculateFee(amountIn: bigint): bigint {
  const feePercentage = BigInt(FEE_BASIS_POINT);
  const scale = 10000n;
  return (amountIn * feePercentage) / scale;
}
