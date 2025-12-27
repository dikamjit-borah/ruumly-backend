import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
export class HealthCheckService {
  constructor(@InjectConnection() private mongoConnection: Connection) {}

  async check() {
    const dbHealthy = await this.checkDatabase();
    return {
      status: dbHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: dbHealthy ? 'connected' : 'disconnected',
    };
  }

  async checkReadiness() {
    const dbHealthy = await this.checkDatabase();
    return {
      ready: dbHealthy,
      timestamp: new Date().toISOString(),
      checks: {
        database: dbHealthy,
      },
    };
  }

  private async checkDatabase(): Promise<boolean> {
    try {
      return this.mongoConnection?.readyState === 1;
    } catch (error) {
      return false;
    }
  }
}
