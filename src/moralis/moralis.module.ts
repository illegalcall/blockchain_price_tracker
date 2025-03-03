import { Global, Module } from '@nestjs/common';
import { MoralisService } from './moralis.service';

@Global()
@Module({
  providers: [MoralisService],
  exports: [MoralisService],
})
export class MoralisModule {}
