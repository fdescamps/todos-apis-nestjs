import { of } from 'rxjs';
import { HttpService } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { TodosModule } from '../todos.module';
import { TodosService } from './todos.service';
import { Todo } from '../interfaces/todo.interface';
import { AxiosResponse } from 'axios';
import { ConfigService } from '../../common/config/config.service';
import { LoggerModule } from '../../common/logger/logger.module';
import { ConfigModule } from '../../common/config/config.module';

describe('TodosService', () => {
  const axiosResponseHeaders = {
    statusText: 'OK',
    headers: {},
    config: {},
  };
  let httpService: HttpService;
  let module: TestingModule;
  let todosService: TodosService;
  let config: ConfigService;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [TodosModule, LoggerModule.forRoot(undefined), ConfigModule],
    }).compile();
    httpService = module.get<HttpService>(HttpService);
    config = module.get<ConfigService>('ConfigService');
    todosService = module.get<TodosService>('TodosService');
    jest.spyOn(config, 'get').mockImplementation(() => 'myurl');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should successfully retrieve a promisified list of todos', async () => {
    // given
    const expected = {
      status: 200,
      data: [
        {
          userId: 1,
          id: 1,
          title: 'delectus aut autem',
          completed: false,
        },
        {
          userId: 1,
          id: 2,
          title: 'quis ut nam facilis et officia qui',
          completed: false,
        },
      ],
      ...axiosResponseHeaders,
    };

    jest.spyOn(httpService, 'get').mockImplementation(() => of(expected));

    // when && then
    expect(await todosService.findAll()).toBe(expected.data);
  });

  it('should fail to retrieve a promisified list of todos since a 404 error occured in httpService.get ', async () => {
    // given
    const mockResponse = {
      status: 404,
      data: [],
      ...axiosResponseHeaders,
    };
    const expected = {
      message: 'Error during calling endpoint: myurl',
      cause: 'Error: 404/[]',
      details: "The circuit breaker's state for todos service is: OPENED",
    };
    jest.spyOn(httpService, 'get').mockImplementation(() => of(mockResponse));

    // when && then
    expect(await todosService.findAll()).toEqual(expected);
  });

  it('should fail to retrieve a promisified list of todos since a 401 error occured in httpService.get ', async () => {
    // given
    const mockResponse = {
      status: 401,
      data: {
        message: 'Unauthorized',
      },
      ...axiosResponseHeaders,
    };
    const expected = {
      message: 'Error during calling endpoint: myurl',
      cause: 'Error: 401/{"message":"Unauthorized"}',
      details: "The circuit breaker's state for todos service is: OPENED",
    };
    jest.spyOn(httpService, 'get').mockImplementation(() => of(mockResponse));

    // when && then
    expect(await todosService.findAll()).toEqual(expected);
  });

  it('should fail to retrieve a promisified list of todos since a 500 TIMEOUT error occured in httpService.get ', async () => {
    // given
    const mockResponse = {
      status: 500,
      data: {
        error: {
          statusCode: 500,
          name: 'Error',
          message: 'read ETIMEDOUT',
          code: 'ETIMEDOUT',
          errno: 'ETIMEDOUT',
          syscall: 'read',
          stack:
            'Error: read ETIMEDOUT\n    at exports._errnoException (util.js:1050:11)\n    at TCP.onread (net.js:582:26)',
        },
      },
      ...axiosResponseHeaders,
    };
    const expected = {
      message: 'Error during calling endpoint: myurl',
      cause: `Error: 500/{"error":{"statusCode":500,"name":"Error","message":"read ETIMEDOUT","code":"ETIMEDOUT","errno":"ETIMEDOUT","syscall":"read","stack":"Error: read ETIMEDOUT\\n    at exports._errnoException (util.js:1050:11)\\n    at TCP.onread (net.js:582:26)"}}`,
      details: "The circuit breaker's state for todos service is: OPENED",
    };
    jest.spyOn(httpService, 'get').mockImplementation(() => of(mockResponse));

    // when && then
    expect(await todosService.findAll()).toEqual(expected);
  });
});
