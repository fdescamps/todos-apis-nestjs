import opossum from 'opossum';
import * as https from 'https';
import { Injectable, HttpException, HttpService, Inject } from '@nestjs/common';
import { NestedLoggerService } from '../../common/logger/nested.logger.service';

import { Todo } from '../interfaces/todo.interface';
import { ConfigService } from '../../common/config/config.service';
import { AxiosRequestConfig } from 'axios';

const options = {
  // If our function takes longer than 3 seconds, trigger a failure
  timeout: 3000,
  // When 50% of requests fail, trip the circuit
  errorThresholdPercentage: 50,
  // Sets the duration of the statistical rolling window, in milliseconds.
  // This is how long Opossum keeps metrics for the circuit breaker to use and for publishing.
  rollingCountTimeout: 60000,
  // After 30 seconds, try again
  resetTimeout: 30000,
  name: 'TodosServiceCircuitBreaker',
  group: 'NestJSCircuitBreaker',
};

@Injectable()
export class TodosService {
  circuitBreaker;
  constructor(
    private readonly httpService: HttpService,
    private readonly config: ConfigService,
    @Inject('LoggerService') private readonly logger: NestedLoggerService,
  ) {
    this.circuitBreaker = opossum(() => this.getRemoteTodos(), options);
    this.circuitBreaker.on('open', () => this.logger.warn('Circuit is open'));
    this.circuitBreaker.on('halfOpen', () =>
      this.logger.warn('Circuit is halfOpen'),
    );
    this.circuitBreaker.on('close', () => this.logger.warn('Circuit is close'));
    this.circuitBreaker.fallback(error => this.getFallback(error));
  }

  private getFallback(error) {
    let cause;
    if (error && error.message) {
      cause = `Error: ${error.status}/${JSON.stringify(error.message)}`;
    } else {
      cause = `${error}`;
    }

    let state = 'CLOSED';
    if (this.circuitBreaker.opened) {
      state = 'OPENED';
    } else if (this.circuitBreaker.halfOpen) {
      state = 'SEMI_OPENED';
    }

    const msgError = {
      message: `Error during calling endpoint: ${this.config.get('TODOSURL')}`,
      cause: `${cause}`,
      details: `The circuit breaker's state for todos service is: ${state}`,
    };
    this.logger.error(`${JSON.stringify(msgError)})`);
    return msgError;
  }

  private getRemoteTodos(): Promise<Todo[]> {
    const url = this.config.get('TODOSURL');
    this.logger.log(`Call to : ${url} will be processing`);

    return this.httpService
      .get(url)
      .toPromise()
      .then(response => {
        if (response.status !== 200) {
          this.logger.error(
            `Call to : ${url} reponse - status: ${
              response.status
            }/${JSON.stringify(response.data)}`,
          );
          throw new HttpException(response.data, response.status);
        }
        return response.data;
      });
  }

  findAll(): Promise<Todo[]> {
    return this.circuitBreaker.fire();
  }
}
