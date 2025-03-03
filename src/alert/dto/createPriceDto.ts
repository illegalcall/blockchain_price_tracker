import { IsEmail, IsNumber, IsPositive, IsEnum } from 'class-validator';
import { SUPPORTED_CHAIN_IDS, SUPPORTED_TOKENS } from '../../common';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTriggerPriceDto {
  @ApiProperty({
    description: 'Hex of the chain id.',
    example: '0x1',
    enum: SUPPORTED_CHAIN_IDS,
  })
  @IsEnum(SUPPORTED_CHAIN_IDS)
  chain: SUPPORTED_CHAIN_IDS;

  @ApiProperty({
    description: 'Trigger Price',
    example: '2000',
  })
  @IsNumber()
  @IsPositive()
  price: number;

  @ApiProperty({
    description:
      'Email you want to be notified when the trigger price is reached.',
    example: 'you@company.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Address of the token you want to monitor.',
    example: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    enum: SUPPORTED_TOKENS,
  })
  @IsEnum(SUPPORTED_TOKENS)
  token: SUPPORTED_TOKENS;
}
