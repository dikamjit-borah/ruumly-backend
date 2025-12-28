import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { envConfig } from './config/env.config';
//import os from 'os';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });

  // Enable CORS
  app.enableCors(envConfig.cors);

  // Global exception filter
  app.useGlobalFilters(new AllExceptionsFilter());

  // Global logging interceptor
  app.useGlobalInterceptors(new LoggingInterceptor());

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Set global prefix
  app.setGlobalPrefix('api');

  const port = envConfig.app.port;
  await app.listen(port, '0.0.0.0');
  const host = await app.getUrl();

  console.log(`Application is running on http://${host}/api`);
  console.log(`Health check: http://${host}/api/health`);
  logStartupConfig();
}

/**
 * Log startup configuration and environment
 */
function logStartupConfig() {
  console.log('APPLICATION STARTUP CONFIGURATION');
  console.log(JSON.stringify(envConfig, null, 2));
}

bootstrap().catch((error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
});
