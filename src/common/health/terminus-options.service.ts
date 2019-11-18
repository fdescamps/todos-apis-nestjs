import {
  TerminusEndpoint,
  TerminusOptionsFactory,
  TerminusModuleOptions,
  MemoryHealthIndicator,
} from '@nestjs/terminus';
import { Injectable } from '@nestjs/common';
import { TodosHealthIndicator } from '../../todos/todos.health';

@Injectable()
export class TerminusOptionsService implements TerminusOptionsFactory {
  constructor(
    private readonly memory: MemoryHealthIndicator,
    private readonly todosHealthIndicator: TodosHealthIndicator,
  ) {}

  public createTerminusOptions(): TerminusModuleOptions {
    const healthEndpoint: TerminusEndpoint = {
      url: '/health',
      healthIndicators: [
        async () => this.todosHealthIndicator.isHealthy('todos'),
        async () => this.memory.checkHeap('memory_heap', 200 * 1024 * 1024),
        async () => this.memory.checkRSS('memory_rss', 3000 * 1024 * 1024),
      ],
    };
    return {
      endpoints: [healthEndpoint],
    };
  }
}
