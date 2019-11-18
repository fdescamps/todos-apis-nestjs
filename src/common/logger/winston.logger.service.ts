import { Injectable } from '@nestjs/common';
import * as DailyRotateFile from 'winston-daily-rotate-file';
import { createLogger, format, Logger, transports } from 'winston';
import { ILoggerService } from './ilogger.interface';
import { LoggerUtilityService } from './logger.utility';
import { ConfigService } from '../config/config.service';

@Injectable()
export class WinstonLoggerService implements ILoggerService {
  private readonly logger: Logger;

  constructor(
    private readonly loggerUtilityService: LoggerUtilityService,
    private readonly config: ConfigService,
  ) {
    /**
     * Build a log that respects the DSI format
     * {timestamp} {machine name} [{thread name}] {severity} – {Applicative code} –
     * {Correlation id} – {message} – {[Error type] [Status code] Exception message – Stacktrace}
     */
    const formatter = format.printf(({ level, message }) =>
      loggerUtilityService.formatter({ level, log: message }),
    );

    this.logger = createLogger({
      exitOnError: false,
      format: format.combine(format.timestamp(), format.splat(), formatter),
      level: config.get('LOGS_LEVEL'),
      transports: [
        new transports.Console({
          handleExceptions: true,
        }),
      ],
    });

    this.logger.add(
      new DailyRotateFile({
        datePattern: config.get('LOGS_DATEPATTERN'),
        filename: config.get('LOGS_FILENAME'),
        maxFiles: config.get('LOGS_MAXFILES'),
      }),
    );
  }

  error(message: string, ...meta: any[]) {
    this.logger.error(message, ...meta);
  }

  warn(message: string, ...meta: any[]) {
    this.logger.warn(message, ...meta);
  }

  info(message: string, ...meta: any[]) {
    this.logger.info(message, ...meta);
  }

  debug(message: string, ...meta: any[]) {
    this.logger.debug(message, ...meta);
  }

  log(message: string, ...meta: any[]) {
    this.logger.info(message, ...meta);
  }
}
