import { AILoggerService } from './appinsight.logger.service';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '../config/config.module';
import { LoggerModule } from './logger.module';
import { LoggerUtilityService } from './logger.utility';
import { ConfigService } from '../config/config.service';

describe('AILoggerService', () => {
  let module: TestingModule;
  let loggerUtilityService;
  let loggerService;
  let configService;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [ConfigModule, LoggerModule.forRoot(true)],
      providers: [],
    }).compile();
    loggerUtilityService = module.get<LoggerUtilityService>(
      LoggerUtilityService,
    );
    configService = module.get<ConfigService>(ConfigService);
    loggerService = module.get<AILoggerService>(AILoggerService);
    jest
      .spyOn(configService, 'get')
      .mockReturnValue('APPINSIGHTS_INSTRUMENTATIONKEY');
    jest.spyOn(loggerService, 'logDetails').mockReturnValue('ok');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  jest.mock(
    'applicationinsights',
    jest.fn().mockImplementation(() => {
      const mock = {
        defaultClient: {
          flush: () => true,
          trackException: () => console.log,
          trackTrace: () => console.log,
        },
        setAutoCollectConsole: jest.fn(() => mock),
        setAutoCollectDependencies: jest.fn(() => mock),
        setAutoCollectExceptions: jest.fn(() => mock),
        setAutoCollectPerformance: jest.fn(() => mock),
        setAutoCollectRequests: jest.fn(() => mock),
        setAutoDependencyCorrelation: jest.fn(() => mock),
        setUseDiskRetryCaching: jest.fn(() => mock),
        setup: jest.fn(() => mock),
        start: jest.fn(() => mock),
      };
      return mock;
    }),
  );

  it('should manage to instantiate the AILoggerService', () => {
    // when && then
    expect(loggerService).toBeDefined();
  });

  it('should have several method to log', () => {
    // when && then
    expect(loggerService.log).toBeDefined();
    expect(loggerService.warn).toBeDefined();
    expect(loggerService.error).toBeDefined();
    expect(loggerService.debug).toBeDefined();
    expect(loggerService.info).toBeDefined();
  });

  it('should be able to debug', () => {
    const expected = 'debug_log';
    // when && then
    loggerService.debug(expected);
    expect(loggerService.logDetails).toBeCalledWith('debug', expected);
  });

  it('should be able to error', () => {
    const expected = 'error_log';

    // when && then
    loggerService.error(expected);
    expect(loggerService.logDetails).toBeCalledWith('error', expected);
  });

  it('should be able to warn', () => {
    const expected = 'warn_log';

    // when && then
    loggerService.warn(expected);
    expect(loggerService.logDetails).toBeCalledWith('warn', expected);
  });

  it('should be able to info', () => {
    const expected = 'info_log';

    // when && then
    loggerService.info(expected);
    expect(loggerService.logDetails).toBeCalledWith('info', expected);
  });

  it('should be able to log', () => {
    const expected = 'log';

    // when && then
    loggerService.log(expected);
    expect(loggerService.logDetails).toBeCalledWith('info', expected);
  });
});
