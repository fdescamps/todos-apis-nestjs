import { APP_FILTER } from '@nestjs/core';
import {
  Module,
  NestModule,
  RequestMethod,
  MiddlewareConsumer,
  Inject,
} from '@nestjs/common';

import { TodosModule } from './todos/todos.module';
import { HealthModule } from './common/health/health.module';
import { LoggerModule } from './common/logger/logger.module';
import { RootModule } from './common/controllers/root.module';
import { MorganMiddleware } from './common/middlewares/morgan.middleware';
import { NestedLoggerService } from './common/logger/nested.logger.service';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { CorrelationIdMiddleware } from './common/middlewares/correlationId.middleware';
import { ConfigModule } from './common/config/config.module';
import { ConfigService } from './common/config/config.service';

@Module({
  imports: [
    LoggerModule.forRoot(process.env.APPSETTING_WEBSITE_SITE_NAME),
    TodosModule,
    RootModule,
    ConfigModule,
    HealthModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule implements NestModule {
  isAuthEnabled: boolean;
  constructor(
    @Inject('LoggerService') private readonly logger: NestedLoggerService,
    private readonly config: ConfigService,
  ) {
    this.logger.log(`app.module.ts - AppModule.constructor - logger injected`);
    this.isAuthEnabled = this.config.get('AUTH_ENABLED') === 'true';
  }

  configure(consumer: MiddlewareConsumer) {
    this.logger.log(
      `app.module.ts - configure middlewares: [CorrelationIdMiddleware, MorganMiddleware]`,
    );

    const defaultMiddlewares = [CorrelationIdMiddleware, MorganMiddleware];

    consumer
      .apply(...defaultMiddlewares)
      .exclude({ path: '/', method: RequestMethod.GET })
      .forRoutes({ path: '/todos', method: RequestMethod.ALL });
  }
}
