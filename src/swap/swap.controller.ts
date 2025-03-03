import { Controller, Get, Logger, Param, Query } from '@nestjs/common';
import { SwapService } from './swap.service';
import { BigIntTransformPipe } from '../common/pipes';
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SUPPORTED_CHAIN_IDS, SUPPORTED_TOKENS } from '../common';

@ApiTags('Token Swaps')
@Controller('swap')
export class SwapController {
  private readonly logger = new Logger(SwapController.name);
  constructor(private readonly swapService: SwapService) {}

  @ApiOperation({
    summary: 'Get swap rate between tokens',
    description:
      'Calculate the exchange rate and fees for swapping between two tokens on a specific chain.',
  })
  @ApiResponse({
    status: 200,
    description: 'Swap rate calculated successfully.',
    schema: {
      properties: {
        amountIn: { type: 'string', description: 'Input amount in wei' },
        tokenIn: { type: 'string', description: 'Address of input token' },
        tokenOut: { type: 'string', description: 'Address of output token' },
        amountOutBeforeFee: {
          type: 'string',
          description: 'Output amount before fees in wei',
        },
        amountOutAfterFee: {
          type: 'string',
          description: 'Final output amount after fees in wei',
        },
        totalFee: { type: 'string', description: 'Total fee amount in wei' },
        chainId: {
          type: 'string',
          description: 'Chain ID where the swap will occur',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input parameters.',
  })
  @ApiParam({
    name: 'tokenAddress',
    description: 'Address of the input token',
    example: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    enum: SUPPORTED_TOKENS,
  })
  @ApiQuery({
    name: 'amount',
    description: 'Amount of input token to swap (in wei)',
    example: '1000000000000000000',
    required: true,
  })
  @ApiQuery({
    name: 'tokenOut',
    description: 'Address of the output token',
    example: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
    enum: SUPPORTED_TOKENS,
    required: true,
  })
  @ApiQuery({
    name: 'chain',
    description: 'Chain ID for the swap',
    example: '0x1',
    enum: SUPPORTED_CHAIN_IDS,
    required: true,
  })
  @Get(':tokenAddress')
  async getSwapRate(
    @Param('tokenAddress') tokenIn: string,
    @Query('amount', BigIntTransformPipe) amount: bigint,
    @Query('tokenOut') tokenOut: string,
    @Query('chain') chainId: string,
  ) {
    this.logger.log(
      'Calculating amount out for -> ',
      tokenIn,
      amount,
      tokenOut,
      chainId,
    );
    return this.swapService.getSwapRate(chainId, tokenIn, tokenOut, amount);
  }
}
