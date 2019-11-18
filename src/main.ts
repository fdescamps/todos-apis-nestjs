import * as csurf from 'csurf';
import * as helmet from 'helmet';
import * as express from 'express';
import { NestFactory } from '@nestjs/core';
import rateLimit from 'express-rate-limit';
import { ExpressAdapter } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { NestedLoggerService } from './common/logger/nested.logger.service';

async function bootstrap() {
  // READ : https://docs.nestjs.com/techniques/security
  // more CORS options on https://github.com/expressjs/cors#configuration-options
  const server = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server), {
    logger: process.env.IS_DEV_ENV ? console : false,
    cors: {
      origin: '*',
      optionsSuccessStatus: 200,
    },
  });
  // set a prefix for each route registered in the HTTP application at once https://docs.nestjs.com/faq/global-prefix
  app.setGlobalPrefix('v1');

  // Documentation with nest/swagger
  const options = new DocumentBuilder()
    .setTitle('todos-apis-nestjs example')
    .setDescription('The todos-apis-nestjs example API description')
    .setVersion('2.0')
    .addTag('todos-apis-nestjs')
    .setBasePath('v1')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);

  // If you have issues with logger injection, in order to see WHERE, comment the code above, uncomment the code below
  // const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT || 3000);
  // READ : https://github.com/helmetjs/helmet
  app.use(helmet());
  // READ : https://github.com/expressjs/csurf
  app.use(csurf());
  // READ : https://github.com/nfriedly/express-rate-limit
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
    }),
  );

  const logger: NestedLoggerService = app.get('LoggerService');
  app.useLogger(logger);

  logger.log(`main.ts - Nest application is listening on port ${3000}`);
  logger.log(`main.ts - Logger injected and associated to AppModule`);

  process.on('unhandledRejection', reason => {
    logger.error(`main.ts - uncaughtException: ${reason}`);
    throw reason;
  });
  process.on('uncaughtException', error => {
    logger.error(`main.ts - uncaughtException: ${error}/${error.stack}`);
    throw error;
  });
}

bootstrap();
