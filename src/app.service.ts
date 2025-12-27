import { Injectable } from '@nestjs/common';
import { envConfig } from './config/env.config';

@Injectable()
export class AppService {
  getHello(): string {
    return `Welcome to ${envConfig.app.name}!`;
  }

  getInfo() {
    return {
      name: envConfig.app.name,
      version: '1.0.0',
      environment: envConfig.environment,
      port: envConfig.app.port,
      timestamp: new Date().toISOString(),
    };
  }
}
