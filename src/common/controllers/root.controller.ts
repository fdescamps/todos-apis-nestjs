import { ApiUseTags, ApiResponse } from '@nestjs/swagger';
import { version, dependencies } from '../../../package.json';
import { Get, Controller, Inject } from '@nestjs/common';
import { NestedLoggerService } from '../logger/nested.logger.service';
import { Public } from '../decorators/public.decorator';

@ApiUseTags('root')
@ApiResponse({
  status: 200,
  description: 'Just answer OK the Azure Healthcheck',
})
@ApiResponse({ status: 403, description: 'Forbidden.' })
@Controller('/')
export class RootController {
  constructor(
    @Inject('LoggerService') private readonly logger: NestedLoggerService,
    @Inject('Os') private readonly os,
  ) {}

  @Public()
  @Get()
  findAll(): any {
    this.logger.log(`RootController()`);
    return {
      version,
    };
  }

  @Public()
  @Get('/quisuisje')
  quisuisje(): any {
    this.logger.log(`RootController()`);
    return {
      hostname: `${this.os.hostname()}`,
      platform: `${this.os.platform()}`,
      uptime: `${this.os.uptime()}`,
      arch: `${this.os.arch()}`,
      cpus: `${JSON.stringify(this.os.cpus())}`,
    };
  }

  @Public()
  @Get('dependencies')
  getDependencies(): any {
    this.logger.log(`RootController()`);
    return {
      dependencies,
    };
  }
}
