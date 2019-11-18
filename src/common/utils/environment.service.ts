import { ConfigService } from '../config/config.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EnvironmentService {
  appSettingWebsiteSiteName: string;
  constructor(private readonly config: ConfigService) {
    this.appSettingWebsiteSiteName = config.get('APPSETTING_WEBSITE_SITE_NAME');
  }

  isAzureDeployed() {
    return this.appSettingWebsiteSiteName !== undefined;
  }

  getTypedParameter(key: string, type: string): number | string | boolean {
    const valueFromConfig: string = this.config.get(key);
    if (valueFromConfig === undefined) {
      throw new Error(`key : ${key} is not in config`);
    }
    switch (type.toLowerCase()) {
      case 'number':
        const parseResult = Number(valueFromConfig);

        if (isNaN(parseResult)) {
          throw new Error(`You can't parse '${valueFromConfig}' to ${type}.`);
        } else {
          return parseResult;
        }
      case 'boolean':
        if (valueFromConfig !== 'true' && valueFromConfig !== 'false') {
          throw new Error(`You can't parse '${valueFromConfig}' to ${type}.`);
        }
        return valueFromConfig === 'true';
      default:
        return valueFromConfig;
    }
  }
}
