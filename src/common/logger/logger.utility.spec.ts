import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '../config/config.module';
import { LoggerModule } from './logger.module';
import { LoggerUtilityService } from './logger.utility';
import { ConfigService } from '../config/config.service';

describe('Test the logger.utility.ts formatter method', () => {
  let module: TestingModule;
  let loggerUtilityService;
  let configService;
  let mockGetNamespace;

  const expectedDate = '2019-02-04 09:56:49.496';
  jest.mock('moment', () => () => ({ format: () => expectedDate }));
  jest.mock(
    'cls-hooked',
    jest.fn().mockImplementation(() => {
      return {
        getNamespace: jest.fn().mockImplementation(() => mockGetNamespace),
      };
    }),
  );

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [ConfigModule, LoggerModule.forRoot(true)],
      providers: [],
    }).compile();
    loggerUtilityService = module.get<LoggerUtilityService>(
      LoggerUtilityService,
    );
    configService = module.get<ConfigService>(ConfigService);
    jest
      .spyOn(configService, 'get')
      .mockReturnValueOnce('LOGS_NAMESPACE')
      .mockReturnValueOnce('LOGS_CORRELATIONID')
      .mockReturnValueOnce('LOGS_FEATUREID')
      .mockReturnValueOnce('LOGS_FEATURENAME');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should return a well structured log', () => {
    // given
    const expectLog: RegExp = new RegExp(
      `${expectedDate};([\\s\\S]*?);([\\s\\S]*?);(\\d+);debug;correlationId;featureId;featureName;test`,
    );
    mockGetNamespace = {
      get: jest.fn(field => {
        const logs = {
          LOGS_CORRELATIONID: 'correlationId',
          LOGS_FEATUREID: 'featureId',
          LOGS_FEATURENAME: 'featureName',
          LOGS_NAMESPACE: 'LOGS_NAMESPACE',
        };
        return logs[field];
      }),
    };

    // when
    const actualLog: string = loggerUtilityService.formatter({
      level: 'debug',
      log: 'test',
    });

    // then
    expect(actualLog).toMatch(expectLog);
    expect(configService.get).toBeCalled;
    expect(configService.get).toHaveBeenCalledTimes(4);
  });

  it('should return a well structured log but whithout correlationId;featureId;featureName', () => {
    // given
    const expectLog: RegExp = new RegExp(
      `${expectedDate};([\\s\\S]*?);([\\s\\S]*?);(\\d+);debug;;;;test`,
    );

    mockGetNamespace = {
      get: jest.fn(field => {
        const logs = {
          LOGS_CORRELATIONID: null,
          LOGS_FEATUREID: null,
          LOGS_FEATURENAME: null,
          LOGS_NAMESPACE: 'LOGS_NAMESPACE',
        };
        return logs[field];
      }),
    };

    // when
    const actualLog: string = loggerUtilityService.formatter({
      level: 'debug',
      log: 'test',
    });

    // then
    expect(actualLog).toMatch(expectLog);
    expect(mockGetNamespace.get).toBeCalled;
    expect(mockGetNamespace.get).toHaveBeenCalledTimes(3);
  });
});
