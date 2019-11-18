import { Module } from '@nestjs/common';
import { RootController } from './root.controller';

@Module({
  controllers: [RootController],
  providers: [
    {
      provide: 'Os',
      useValue: require('os'),
    },
  ],
})
export class RootModule {}
