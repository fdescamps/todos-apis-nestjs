import { NestedLoggerService } from '../logger/nested.logger.service';
import { Inject, Injectable } from '@nestjs/common';
import { EnvironmentService } from '../utils/environment.service';
import { ConfigService } from '../config/config.service';
import { IBuildRetryOptions } from './keyvault.interface';

const KeyVault = require('azure-keyvault');
const msRestAzure = require('ms-rest-azure');
const promiseRetry = require('promise-retry');

@Injectable()
export class KeyvaultService {
  secretCache: string[];
  buildRetryOptions: IBuildRetryOptions;

  constructor(
    private readonly config: ConfigService,
    @Inject('LoggerService') private readonly logger: NestedLoggerService,
    private readonly environmentUtils: EnvironmentService,
  ) {
    this.secretCache = [];

    this.buildRetryOptions = {
      maxTimeout:
        (this.environmentUtils.getTypedParameter(
          'RETRYPOLICY_DURATIONBETWEENRETRYINSECOND',
          'number',
        ) as number) * 1000,
      minTimeout:
        (this.environmentUtils.getTypedParameter(
          'RETRYPOLICY_DURATIONBETWEENRETRYINSECOND',
          'number',
        ) as number) * 1000,
      retries: this.environmentUtils.getTypedParameter(
        'RETRYPOLICY_RETRYCOUNT',
        'number',
      ) as number,
    };
  }

  getKeyVaultCredentials() {
    return promiseRetry(
      () =>
        msRestAzure.loginWithAppServiceMSI({
          resource: this.config.get('KEYVAULT_URL'),
        }),
      this.buildRetryOptions,
    );
  }

  getSecretFromKeyVault(credentials, secretKey) {
    const keyVaultClient = new KeyVault.KeyVaultClient(credentials);
    return promiseRetry(
      () =>
        keyVaultClient.getSecret(
          this.config.get('KEYVAULT_BASEURL'),
          secretKey,
          '',
        ),
      this.buildRetryOptions,
    );
  }

  setSecretToCache(key, value) {
    this.secretCache[key] = value;
  }

  async getKeyVaultSecret(secretKey): Promise<string> {
    if (!this.environmentUtils.isAzureDeployed()) {
      return Promise.resolve(this.config.get(secretKey));
    }

    const secretFromCache = this.secretCache[secretKey];
    if (secretFromCache !== undefined && secretFromCache !== null) {
      return Promise.resolve(secretFromCache);
    }
    try {
      const credentials = await this.getKeyVaultCredentials();
      const { value: secretFromKeyvault } = await this.getSecretFromKeyVault(
        credentials,
        secretKey,
      );
      this.setSecretToCache(secretKey, secretFromKeyvault);
      return Promise.resolve(secretFromKeyvault);
    } catch (err) {
      this.logger.error(err);
      return Promise.reject(err);
    }
  }
}
