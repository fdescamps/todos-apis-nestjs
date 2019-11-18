import { HttpModule } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TodosController } from './todos.controller';
import { TodosService } from './service/todos.service';
import { LoggerModule } from '../common/logger/logger.module';
import { Todo } from './interfaces/todo.interface';
import { ConfigModule } from '../common/config/config.module';

describe('TodosController', () => {
  let module: TestingModule;
  let todosService: TodosService;
  let todosController: TodosController;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [TodosController],
      providers: [TodosService],
      imports: [
        HttpModule.register({
          timeout: 5000,
          maxRedirects: 5,
        }),
        LoggerModule.forRoot(undefined),
        ConfigModule,
      ],
    }).compile();

    todosService = module.get<TodosService>(TodosService);
    todosController = module.get<TodosController>(TodosController);
  });

  describe('findAll', () => {
    it('should return an array of todos', async () => {
      const expected: Todo[] = [
        {
          userId: 1,
          id: 1,
          title: 'delectus aut autem',
          completed: false,
        },
      ];

      jest
        .spyOn(todosService, 'findAll')
        .mockImplementation(() => Promise.resolve(expected));

      expect(await todosController.findAll()).toBe(expected);
    });
  });
});
