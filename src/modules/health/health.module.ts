import { Module } from '@nestjs/common';
import { HealthCheckService } from './health.service';
import { HealthController } from './health.controller';

@Module({
  controllers: [HealthController],
  providers: [HealthCheckService],
})
export class HealthModule {}
