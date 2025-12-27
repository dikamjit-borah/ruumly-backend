import { Injectable, Logger } from '@nestjs/common';
import { envConfig } from '@/config/env.config';
import * as fs from 'fs';

@Injectable()
export class LoggerService {
  private readonly logger = new Logger('LoggerService');

  constructor() {
    this.ensureLogDirectory();
  }

  private ensureLogDirectory() {
    const logDir = envConfig.logging.dir;
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
  }

  log(message: string, context?: string) {
    this.logger.log(message, context);
  }

  error(message: string, trace?: string, context?: string) {
    this.logger.error(message, trace, context);
  }

  warn(message: string, context?: string) {
    this.logger.warn(message, context);
  }

  debug(message: string, context?: string) {
    this.logger.debug(message, context);
  }

  verbose(message: string, context?: string) {
    this.logger.verbose(message, context);
  }
}
