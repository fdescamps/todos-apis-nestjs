import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '../config/config.module';
import { UtilsModule } from '../utils/utils.module';
import { LoggerModule } from './logger.module';
import { WinstonLoggerService } from './winston.logger.service';
import { ConfigService } from '../config/config.service';
import { configServiceMock, loggerUtilityMock } from '../utils/global.mocks';
import { LoggerUtilityService } from './logger.utility';

describe('Test the WinstonLoggerService', () => {
  let module: TestingModule;
  let logger;
  configServiceMock.get = jest.fn().mockReturnValue('');
  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [ConfigModule, UtilsModule, LoggerModule.forRoot(true)],
      providers: [
        { provide: ConfigService, useValue: configServiceMock },
        { provide: LoggerUtilityService, useValue: loggerUtilityMock },
      ],
    }).compile();
    logger = module.get<WinstonLoggerService>(WinstonLoggerService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should manage to instantiate the WinstonLoggerService', () => {
    // when && then
    expect(logger).toBeDefined;
  });

  it('should have several method to log', () => {
    // when && then
    expect(logger.log).toBeDefined;
    expect(logger.warn).toBeDefined;
    expect(logger.error).toBeDefined;
    expect(logger.debug).toBeDefined;
    expect(logger.info).toBeDefined;
  });

  it('should be able to debug', () => {
    // when && then
    logger.debug('test');
    expect(logger.debug).toBeCalled;
  });

  it('should be able to info', () => {
    // when && then
    logger.info('test');
    expect(logger.info).toBeCalled;
  });
});
