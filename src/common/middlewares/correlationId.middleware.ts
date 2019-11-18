import { v4 } from 'uuid';
import { getNamespace, Namespace, createNamespace } from 'cls-hooked';
import { Injectable, NestMiddleware, Inject } from '@nestjs/common';
import express = require('express');
import { NestedLoggerService } from '../logger/nested.logger.service';
import { ConfigService } from '../config/config.service';

@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {
  ns: Namespace;
  constructor(
    private readonly config: ConfigService,
    @Inject('LoggerService') private readonly logger: NestedLoggerService,
  ) {
    this.logger.log('CorrelationIdMiddleware instanciated');
    this.ns = createNamespace('todos-apis-nestjs');
  }

  use(
    request: express.Request,
    response: express.Response,
    next: express.NextFunction,
  ) {
    const {
      correlationid: correlationId,
      featureid: featureId,
      featurename: featureName,
    } = request.headers;
    this.ns.run(() => {
      const namespace = this.config.get('LOGS_NAMESPACE');
      getNamespace(namespace).set(
        this.config.get('LOGS_CORRELATIONID'),
        correlationId || v4(),
      );
      getNamespace(namespace).set(this.config.get('LOGS_FEATUREID'), featureId);
      getNamespace(namespace).set(
        this.config.get('LOGS_FEATURENAME'),
        featureName,
      );
      return next();
    });
  }
}
