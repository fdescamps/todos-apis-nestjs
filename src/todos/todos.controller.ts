import { ApiUseTags, ApiResponse } from '@nestjs/swagger';
import { TodosService } from './service/todos.service';
import { Get, Controller, Inject } from '@nestjs/common';
import { NestedLoggerService } from '../common/logger/nested.logger.service';

@ApiUseTags('todos')
@ApiResponse({ status: 200, description: 'Just return the todos list' })
@ApiResponse({ status: 403, description: 'Forbidden.' })
@Controller('/todos')
export class TodosController {
  constructor(
    private readonly todosService: TodosService,
    @Inject('LoggerService') private readonly logger: NestedLoggerService,
  ) {}

  @Get()
  findAll() {
    this.logger.log(`TodosController.findAll`);
    return this.todosService.findAll();
  }
}
