import {
  PipeTransform,
  Injectable,
  BadRequestException,
  Logger,
} from '@nestjs/common';

@Injectable()
export class BigIntTransformPipe implements PipeTransform {
  private readonly logger = new Logger(BigIntTransformPipe.name);
  transform(value: string): bigint {
    try {
      return BigInt(value);
    } catch (error) {
      this.logger.error('BigIntTransformPipe.transform error -> ', error);
      throw new BadRequestException(`Invalid bigint value: ${value}`);
    }
  }
}
