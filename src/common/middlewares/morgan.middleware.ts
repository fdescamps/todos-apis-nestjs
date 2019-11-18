import * as morgan from 'morgan';
import { NestedLoggerService } from '../logger/nested.logger.service';
import { Injectable, NestMiddleware, Inject } from '@nestjs/common';
import express = require('express');

@Injectable()
export class MorganMiddleware implements NestMiddleware {
  constructor(
    @Inject('LoggerService') private readonly logger: NestedLoggerService,
  ) {
    this.logger.log('MorganMiddleware instanciated');
  }
  use(
    request: express.Request,
    response: express.Response,
    next: express.NextFunction,
  ) {
    morgan('combined', {
      stream: { write: str => this.logger.log(str) },
    });
    return next();
  }
}
