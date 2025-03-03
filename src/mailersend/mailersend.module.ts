import { Module } from '@nestjs/common';
import { MailersendService } from './mailersend.service';

@Module({
  providers: [MailersendService],
})
export class MailersendModule {}
