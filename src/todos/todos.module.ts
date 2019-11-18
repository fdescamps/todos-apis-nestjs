import { Module, HttpModule } from '@nestjs/common';
import { TodosHealthIndicator } from './todos.health';
import { TodosController } from './todos.controller';
import { TodosService } from './service/todos.service';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  controllers: [TodosController],
  providers: [TodosService, TodosHealthIndicator],
  exports: [TodosHealthIndicator],
})
export class TodosModule {}
