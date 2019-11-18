import { ConfigService } from './config.service';

describe('config.service', () => {
  const configService = new ConfigService();

  describe('get', () => {
    it('should the correct value', () => {
      expect(configService.get('LOGS_NAMESPACE')).toEqual('todos-apis-nestjs');
    });
    it('should return undefined if env var doesn t exist', () => {
      expect(configService.get('undefinded_env_var')).toBeUndefined();
    });
    it('should return undefined if we try to get undefined value', () => {
      expect(configService.get(undefined)).toBeUndefined();
    });
    it('should return undefined if we try to get null value', () => {
      expect(configService.get(null)).toBeUndefined();
    });
  });
});
