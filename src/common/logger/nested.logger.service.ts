import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import { ILoggerService } from './ilogger.interface';

@Injectable()
export class NestedLoggerService implements NestLoggerService {
  constructor(private readonly logger: ILoggerService) {}
  error(message: string, trace = '') {
    this.logger.error(message, trace);
  }

  warn(message: string) {
    this.logger.warn(message);
  }

  log(message: string) {
    this.logger.log(message);
  }
}
