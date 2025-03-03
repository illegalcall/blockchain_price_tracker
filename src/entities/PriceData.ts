import { Entity, Property, PrimaryKey, Enum } from '@mikro-orm/core';
import { SUPPORTED_TOKENS } from '../common';

@Entity()
export class PriceData {
  @PrimaryKey()
  uuid: string;

  @Property()
  timestamp: Date;

  @Enum({ items: () => SUPPORTED_TOKENS, nativeEnumName: 'token' })
  token: SUPPORTED_TOKENS;

  @Property()
  price: string;
}
