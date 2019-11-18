import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { TodosModule } from '../src/todos/todos.module';
import { LoggerModule } from '../src/common/logger/logger.module';
import { ConfigModule } from '../src/common/config/config.module';

// If you want to mock the TodosService : https://docs.nestjs.com/fundamentals/unit-testing
describe('TodosController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        TodosModule,
        ConfigModule,
        LoggerModule.forRoot(process.env.APPSETTING_WEBSITE_SITE_NAME),
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  it('find all todos - /todos (GET)', () => {
    const checkResult = res => {
      if (!Array.isArray(res.body)) {
        throw new Error('Expected an array, got: ' + res.body);
      }
    };

    return request(app.getHttpServer())
      .get('/todos')
      .expect('Content-Type', /json/)
      .expect(200)
      .expect(checkResult);
  });
});
