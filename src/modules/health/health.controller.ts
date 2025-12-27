import { Controller, Get } from '@nestjs/common';
import { HealthCheckService } from './health.service';

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthCheckService) {}

  @Get()
  async check() {
    return this.healthService.check();
  }

  @Get('live')
  async live() {
    return { status: 'ok', message: 'Application is live' };
  }

  @Get('ready')
  async ready() {
    return this.healthService.checkReadiness();
  }
}
