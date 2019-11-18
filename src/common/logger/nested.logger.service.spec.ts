import { NestedLoggerService } from './nested.logger.service';
import { WinstonLoggerService } from './winston.logger.service';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '../config/config.module';
import { LoggerModule } from './logger.module';
import { LoggerUtilityService } from './logger.utility';
import { ConfigService } from '../config/config.service';

describe('NestLoggerService', () => {
  let module: TestingModule;
  let loggerUtilityService;
  let loggerService;
  let configService;
  let nestLoggerService;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [ConfigModule, LoggerModule.forRoot(undefined)],
      providers: [],
    }).compile();
    loggerUtilityService = module.get<LoggerUtilityService>(
      LoggerUtilityService,
    );
    configService = module.get<ConfigService>(ConfigService);
    loggerService = module.get<WinstonLoggerService>(WinstonLoggerService);

    jest
      .spyOn(configService, 'get')
      .mockReturnValue('APPINSIGHTS_INSTRUMENTATIONKEY');
    jest.spyOn(loggerService, 'warn').mockReturnValue('ok');
    jest.spyOn(loggerService, 'error').mockReturnValue('ok');
    jest.spyOn(loggerService, 'log').mockReturnValue('ok');
    nestLoggerService = new NestedLoggerService(loggerService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should manage to instantiate the NestLoggerService', () => {
    // when && then
    expect(nestLoggerService).toBeDefined();
  });

  it('should have several method to log', () => {
    // when && then
    expect(nestLoggerService.warn).toBeDefined();
    expect(nestLoggerService.log).toBeDefined();
    expect(nestLoggerService.error).toBeDefined();
  });

  it('should be able to log', () => {
    // given
    const expected = 'log';

    // when && then
    nestLoggerService.log(expected);

    expect(loggerService.log).toBeCalledWith(expected);
  });

  it('should be able to warn', () => {
    // given
    const expected = 'log_warn';

    // when && then
    nestLoggerService.warn(expected);

    expect(loggerService.warn).toBeCalledWith(expected);
  });

  it('should be able to error', () => {
    // given
    const expectedMessage = 'error_message';
    const expectedTrace = 'error_trace';

    // when && then
    nestLoggerService.error(expectedMessage, expectedTrace);

    expect(loggerService.error).toBeCalledWith(expectedMessage, expectedTrace);
  });
});
