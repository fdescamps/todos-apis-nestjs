import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';

import { TerminusOptionsService } from './terminus-options.service';
import { TodosModule } from '../../todos/todos.module';

@Module({
  imports: [
    TerminusModule.forRootAsync({
      imports: [TodosModule],
      useClass: TerminusOptionsService,
    }),
  ],
})
export class HealthModule {}
