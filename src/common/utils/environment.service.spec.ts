import { EnvironmentService } from './environment.service';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '../config/config.module';
import { ConfigService } from '../config/config.service';

describe('EnvironmentService',() => {
  let module: TestingModule;
  let environmentService: EnvironmentService;
  let configService: ConfigService;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [EnvironmentService],
    }).compile();
    environmentService = module.get<EnvironmentService>('EnvironmentService');
    configService = module.get<ConfigService>('ConfigService');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getTypedParameter', () => {
    it('should throw an error when key is not in config', () => {
      configService.get = jest.fn().mockReturnValue(undefined);

      expect(() =>
        environmentService.getTypedParameter('notExist', 'string'),
      ).toThrow('is not in config');
    });

    it('should return value in number type when key exist and is parsable in number', () => {
      configService.get = jest.fn().mockReturnValue('100');

      const result = environmentService.getTypedParameter('test', 'number');
      expect(result).toEqual(100);
      expect(typeof result).toEqual('number');
    });

    it('should throw an error when the value is not compatible with type number', () => {
      configService.get = jest.fn().mockReturnValue('notParsable');

      expect(() =>
        environmentService.getTypedParameter('test', 'number'),
      ).toThrow("You can't parse");
    });

    it('should return value in boolean type when key exist and is convertible to boolean', () => {
      configService.get = jest.fn().mockReturnValue('false');

      const result = environmentService.getTypedParameter('test', 'boolean');
      expect(result).toEqual(false);
      expect(typeof result).toEqual('boolean');
    });

    it('should throw an error when the value is not compatible with type boolean', () => {
      configService.get = jest.fn().mockReturnValue('notConvertible');

      expect(() =>
        environmentService.getTypedParameter('test', 'boolean'),
      ).toThrow("You can't parse");
    });

    it('should return value received when type is not "number" or "boolean"', () => {
      const configGetMock = 'test';
      configService.get = jest.fn().mockReturnValue(configGetMock);

      const result = environmentService.getTypedParameter(
        'test',
        'notInManageType',
      );
      expect(result).toEqual(configGetMock);
    });
  });
});
