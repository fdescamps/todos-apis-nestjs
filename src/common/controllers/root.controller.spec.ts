import 'reflect-metadata';
import { version } from '../../../package.json';
import { RootController } from './root.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '../logger/logger.module';
import { ConfigModule } from '../config/config.module';

describe('RootController', () => {
  let products: TestingModule;

  beforeAll(async () => {
    products = await Test.createTestingModule({
      controllers: [RootController],
      providers: [],
      imports: [LoggerModule.forRoot(undefined), ConfigModule],
    }).compile();
  });

  describe('findAll', () => {
    it('should return { version }', () => {
      const rootController = products.get<RootController>(RootController);
      expect(rootController.findAll()).toMatchObject({ version });
    });
  });
});
