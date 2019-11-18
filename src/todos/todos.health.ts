import { Injectable } from '@nestjs/common';
import { HealthCheckError } from '@godaddy/terminus';
import { HealthIndicatorResult, HealthIndicator } from '@nestjs/terminus';

import { TodosService } from './service/todos.service';

@Injectable()
export class TodosHealthIndicator extends HealthIndicator {
  constructor(private readonly todosService: TodosService) {
    super();
  }

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    const todos = await this.todosService.findAll();
    const isHealthy = todos.length > 0;

    const result = this.getStatus(key, isHealthy, { todos: todos.length });

    if (isHealthy) {
      return result;
    }
    throw new HealthCheckError('Todoscheck failed', result);
  }
}
