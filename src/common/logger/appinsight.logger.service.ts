import { Inject, Injectable } from '@nestjs/common';

import { LoggerUtilityService } from './logger.utility';
import { ILoggerService } from './ilogger.interface';
import { ConfigService } from '../config/config.service';

@Injectable()
export class AILoggerService implements ILoggerService {
  constructor(
    private readonly loggerUtilityService: LoggerUtilityService,
    private readonly config: ConfigService,
    @Inject('Applicationinsights') private readonly applicationinsights,
  ) {
    const appInsightInstrumentationKey = config.get(
      'APPINSIGHTS_INSTRUMENTATIONKEY',
    );
    if (appInsightInstrumentationKey) {
      applicationinsights
        .setup(appInsightInstrumentationKey)
        .setAutoDependencyCorrelation(true)
        .setAutoCollectRequests(true)
        .setAutoCollectPerformance(true)
        .setAutoCollectExceptions(true)
        .setAutoCollectDependencies(true)
        .setAutoCollectConsole(false)
        .setUseDiskRetryCaching(true)
        .start();
    }
  }

  logDetails(level, log) {
    const { defaultClient } = this.applicationinsights;
    if (level === 'error') {
      defaultClient.trackException({
        exception: new Error(
          `${this.loggerUtilityService.formatter({ level, log })}`,
        ),
      });
    } else {
      defaultClient.trackTrace({
        message: `${this.loggerUtilityService.formatter({ level, log })}`,
      });
    }
    defaultClient.flush();
  }

  error(message: string, ...meta: any[]) {
    this.logDetails('error', message);
  }

  warn(message: string, ...meta: any[]) {
    this.logDetails('warn', message);
  }

  info(message: string, ...meta: any[]) {
    this.logDetails('info', message);
  }

  debug(message: string, ...meta: any[]) {
    this.logDetails('debug', message);
  }

  log(message: string, ...meta: any[]) {
    this.logDetails('info', message);
  }
}
