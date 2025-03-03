import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AlertService } from './alert.service';
import { CreateTriggerPriceDto } from './dto/createPriceDto';
import { TriggerData } from '../entities/TriggerData';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Price Alerts')
@Controller('alert')
export class AlertController {
  constructor(private readonly alertService: AlertService) {}

  @ApiOperation({
    summary: 'Create a new price alert',
    description:
      'Creates a new price alert for a specific token. You will receive an email notification when the price reaches the target.',
  })
  @ApiResponse({
    status: 201,
    description: 'Price alert has been successfully created.',
    type: String,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data.',
  })
  @ApiBody({ type: CreateTriggerPriceDto })
  @Post()
  async setPriceTrigger(
    @Body() createTriggerPriceDto: CreateTriggerPriceDto,
  ): Promise<string> {
    return this.alertService.setPriceTrigger(createTriggerPriceDto);
  }

  @ApiOperation({
    summary: 'Get all price alerts for an email',
    description:
      'Retrieves all active price alerts associated with the specified email address.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of price alerts found.',
    type: [TriggerData],
  })
  @ApiParam({
    name: 'email',
    description: 'Email address to fetch alerts for',
    example: 'you@example.com',
  })
  @Get('/email/:email')
  async getAllPriceTriggerForEmail(
    @Param('email') email: string,
  ): Promise<TriggerData[]> {
    return this.alertService.getAllPriceTriggerForEmail(email);
  }

  @ApiOperation({
    summary: 'Get price alert by ID',
    description: 'Retrieves a specific price alert by its unique identifier.',
  })
  @ApiResponse({
    status: 200,
    description: 'Price alert found.',
    type: TriggerData,
  })
  @ApiResponse({
    status: 404,
    description: 'Price alert not found.',
  })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the price alert',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Get('/id/:id')
  async getPriceTriggerById(@Param('id') id: string): Promise<TriggerData> {
    return this.alertService.getPriceTriggerById(id);
  }
}
