import { of } from 'rxjs';
import { AxiosResponse } from 'axios';
import { TestingModule, Test } from '@nestjs/testing';
import { HttpService } from '@nestjs/common';
import { loadFeature, defineFeature } from 'jest-cucumber';

import { TodosService } from './todos.service';
import { Todo } from '../interfaces/todo.interface';
import { NestedLoggerService } from '../../common/logger/nested.logger.service';
import { TodosModule } from '../todos.module';
import { LoggerModule } from '../../common/logger/logger.module';
import { ConfigModule } from '../../common/config/config.module';

const feature = loadFeature('./src/todos/service/todos.service.feature');

defineFeature(feature, test => {
  test('Valid request to find all todos', ({ given, when, then }) => {
    let expectedTodos: Todo[];
    let httpService: HttpService;
    let loggerService: NestedLoggerService;
    let todosService: TodosService;
    let todosPromise: Promise<Todo[]>;

    beforeAll(async () => {
      const module: TestingModule = await Test.createTestingModule({
        imports: [TodosModule, LoggerModule.forRoot(undefined), ConfigModule],
      }).compile();
      httpService = module.get<HttpService>(HttpService);
      loggerService = module.get<NestedLoggerService>('LoggerService');
      todosService = module.get<TodosService>('TodosService');
    });

    given('a todos service', () => {
      expectedTodos = [
        {
          userId: 1,
          id: 1,
          title: 'delectus aut autem',
          completed: false,
        },
      ];
      const response = {
        data: expectedTodos,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      };
      jest.spyOn(httpService, 'get').mockImplementation(() => of(response));
    });

    when('the controler invokes this method', () => {
      todosPromise = todosService.findAll();
    });

    then('the service responds an array of x elements', async () =>
      todosPromise.then(data => expect(data).toBe(expectedTodos)),
    );
  });
});
