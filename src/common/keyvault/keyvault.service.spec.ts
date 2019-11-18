import { KeyvaultService } from './keyvault.service';
import { EnvironmentService } from '../utils/environment.service';
import { ConfigService } from '../config/config.service';
import { Test, TestingModule } from '@nestjs/testing';
import { configServiceMock, loggerServiceMock } from '../utils/global.mocks';
import { NestedLoggerService } from '../logger/nested.logger.service';
import { ConfigModule } from '../config/config.module';
import { LoggerModule } from '../logger/logger.module';
import { UtilsModule } from '../utils/utils.module';

const environmentServiceMock = new (jest.fn(() => ({
  getTypedParameter: jest.fn(),
  isAzureDeployed: jest.fn(),
})))();

describe('KeyvaultService', () => {
  let module: TestingModule;
  let keyvaultService: KeyvaultService;
  const error = 'error';

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule,
        LoggerModule.forRoot(process.env.APPSETTING_WEBSITE_SITE_NAME),
        UtilsModule,
      ],
      providers: [
        KeyvaultService,
        { provide: ConfigService, useValue: configServiceMock },
        { provide: NestedLoggerService, useValue: loggerServiceMock },
        { provide: EnvironmentService, useValue: environmentServiceMock },
      ],
    }).compile();
    keyvaultService = module.get<KeyvaultService>(KeyvaultService);
    keyvaultService.getKeyVaultCredentials = jest.fn().mockResolvedValue('');
    environmentServiceMock.isAzureDeployed.mockReturnValue(true);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getKeyVaultSecret', () => {
    it('should retrieve secret from config when isAzureDeployed is false', async () => {
      const expected = 'data_from_config';
      environmentServiceMock.isAzureDeployed.mockReturnValue(false);
      configServiceMock.get.mockReturnValue(expected);
      await expect(
        keyvaultService.getKeyVaultSecret('secret'),
      ).resolves.toEqual(expected);
    });

    it('should retrieve secret from scope when isAzureDeployed is true and data exist in scope', async () => {
      const expected = 'data_from_config';
      keyvaultService.setSecretToCache('secret', expected);
      await expect(
        keyvaultService.getKeyVaultSecret('secret'),
      ).resolves.toEqual(expected);
    });

    it('should retrieve secret from getSecretFromKeyVault when isAzureDeployed is true et data don t exist in scope', async () => {
      const expected = { value: 'data_from_keyvault' };
      keyvaultService.getSecretFromKeyVault = jest
        .fn()
        .mockResolvedValue(expected);
      await expect(
        keyvaultService.getKeyVaultSecret('secret'),
      ).resolves.toEqual(expected.value);
    });

    it('should reject when getKeyVaultCredentials reject an error', async () => {
      keyvaultService.getKeyVaultCredentials = jest
        .fn()
        .mockRejectedValue(error);
      await expect(keyvaultService.getKeyVaultSecret('secret')).rejects.toEqual(
        error,
      );
    });

    it('should reject when getSecretFromKeyVault reject an error', async () => {
      keyvaultService.getSecretFromKeyVault = jest
        .fn()
        .mockRejectedValue(error);
      await expect(keyvaultService.getKeyVaultSecret('secret')).rejects.toEqual(
        error,
      );
    });
  });
});
