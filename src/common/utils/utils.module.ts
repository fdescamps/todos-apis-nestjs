import { Module } from '@nestjs/common';
import { EnvironmentService } from './environment.service';

@Module({
  exports: [EnvironmentService],
  providers: [EnvironmentService],
})
export class UtilsModule {}
