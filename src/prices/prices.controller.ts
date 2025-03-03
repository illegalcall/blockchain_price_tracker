import { Controller, Get, Logger, Param } from '@nestjs/common';
import { PricesService } from './prices.service';
import { SUPPORTED_TOKENS } from '../common';
import { PriceData } from '../entities';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Token Prices')
@Controller('prices')
export class PricesController {
  private readonly logger = new Logger(PricesController.name);
  constructor(private readonly pricesService: PricesService) {}

  @ApiOperation({
    summary: 'Get token price history',
    description: 'Retrieves the last 24 hours of price data for a specific token.',
  })
  @ApiResponse({
    status: 200,
    description: 'Historical price data retrieved successfully.',
    type: [PriceData],
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid token address provided.',
  })
  @ApiParam({
    name: 'tokenAddress',
    description: 'The address of the token to get price history for',
    example: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    enum: SUPPORTED_TOKENS
  })
  @Get('/:tokenAddress')
  async getPrices(
    @Param('tokenAddress') tokenAddress: SUPPORTED_TOKENS,
  ): Promise<PriceData[]> {
    this.logger.log('Fetching price for => ', tokenAddress);
    return this.pricesService.getPrices(tokenAddress);
  }
}
