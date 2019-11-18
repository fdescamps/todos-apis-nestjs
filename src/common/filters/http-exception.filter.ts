import {
  Catch,
  Inject,
  HttpException,
  ArgumentsHost,
  ExceptionFilter,
} from '@nestjs/common';
import { isObject } from 'lodash';

import { NestedLoggerService } from '../logger/nested.logger.service';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(
    @Inject('LoggerService') private readonly logger: NestedLoggerService,
  ) {}
  catch(exception: HttpException | any, host: ArgumentsHost) {
    this.logger.log(
      `HttpExceptionFilter - ${
        isObject(exception) ? JSON.stringify(exception) : exception
      }/${
        isObject(exception.stack)
          ? JSON.stringify(exception.stack)
          : exception.stack
      }`,
    );
    this.logger.log(
      `HttpExceptionFilter - exception instanceof HttpException: ${exception instanceof
        HttpException}`,
    );

    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let name;
    let details;
    let message;
    let statusCode;
    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
    } else {
      statusCode = exception.status ? exception.status : 500;
      message = exception.message;
      details = exception.inner;
      name = exception.name;
    }

    response.status(statusCode).json({
      name,
      statusCode,
      message,
      details,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
