import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigService {
  private readonly envConfig: { [prop: string]: string };
  constructor() {
    const parsedConfig = dotenv.parse(
      fs.readFileSync(__dirname + '/../../../.env'),
    );

    this.envConfig = Object.keys(parsedConfig).reduce((acc, key) => {
      if (process.env.hasOwnProperty(key) && parsedConfig[key]) {
        parsedConfig[key] = process.env[key] as string;
      }
      return parsedConfig;
    }, parsedConfig);

    if (process.env.APPSETTING_WEBSITE_SITE_NAME !== undefined) {
      this.envConfig = {
        ...this.envConfig,
        APPINSIGHTS_INSTRUMENTATIONKEY:
          process.env.APPINSIGHTS_INSTRUMENTATIONKEY,
        APPSETTING_WEBSITE_SITE_NAME: process.env.APPSETTING_WEBSITE_SITE_NAME,
        KEYVAULT_BASEURL: process.env['Keyvault:BaseUrl'],
        KEYVAULT_URL: process.env.KEYVAULT_URL,
      };
    }
  }

  get(key: string): string {
    return this.envConfig[key];
  }
}
