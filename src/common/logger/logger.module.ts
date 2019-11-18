import { DynamicModule, Global, Module } from '@nestjs/common';
import { AILoggerService } from './appinsight.logger.service';
import { WinstonLoggerService } from './winston.logger.service';
import { UtilsModule } from '../utils/utils.module';
import { LoggerUtilityService } from './logger.utility';

const isAzureDeployed = (azureSpecificEnvVar: string) =>
  azureSpecificEnvVar !== undefined;

@Global()
@Module({
  exports: [WinstonLoggerService, AILoggerService],
  imports: [UtilsModule],
  providers: [WinstonLoggerService, AILoggerService, LoggerUtilityService],
})
export class LoggerModule {
  static forRoot(azureSpecificEnvVar): DynamicModule {
    const providers = [
      {
        provide: 'LoggerService',
        useClass: isAzureDeployed(azureSpecificEnvVar)
          ? AILoggerService
          : WinstonLoggerService,
      },
      {
        provide: 'GetNamespace',
        useValue: require('cls-hooked').getNamespace,
      },
      {
        provide: 'Moment',
        useValue: require('moment'),
      },
      {
        provide: 'Os',
        useValue: require('os'),
      },
      {
        provide: 'Applicationinsights',
        useValue: require('applicationinsights'),
      },
    ];
    return { exports: providers, module: LoggerModule, providers };
  }
}
