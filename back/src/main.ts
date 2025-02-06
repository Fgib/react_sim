import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app/app.module';
import { EnvironmentVariables } from './configuration/env';
import { ValidationPipe } from './core/pipes/ValidationPipe';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter(), { bufferLogs: true });

  app.useLogger(app.get(Logger));
  app.useGlobalPipes(new ValidationPipe());

  const config = setupConfiguration(app);

  await app.listen({
    host: config.get('HOST'),
    port: config.get('PORT'),
  })
  const logger = app.get(Logger);

  logger.warn(
    `Application is running on: ${await app.getUrl()} in ${config.get('NODE_ENV')}/${config.get('ENVIRONMENT')} mode`
  );
  process.on('SIGINT', () => shutdown(app, logger));
  process.on('SIGTERM', () => shutdown(app, logger));
}

function setupConfiguration(app: INestApplication): ConfigService<EnvironmentVariables, true> {
  const config = app.get<ConfigService<EnvironmentVariables, true>>(ConfigService);

  if (config.get('NODE_ENV') === 'dev') {
    app.enableCors();
    app.get(Logger).warn('CORS allowed for development environment (all origins)');
    setupSwagger(app);
    app.get(Logger).warn('Swagger enabled for development environment');
  } else {
    app.enableCors();
  }

  return config;
}

function setupSwagger(app: INestApplication): void {
  const swaggerOptions = new DocumentBuilder()
    .setTitle('Deliveroo Wish Gateway API')
    .setDescription(`Gateway API for Deliveroo Wish`)
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerOptions);
  SwaggerModule.setup('documentation', app, document);
}

async function shutdown(app: INestApplication, logger: Logger) {
  try {
    logger.warn('Application shutting down...');
    await app.close();
    process.exit(0);
  } catch (error) {
    logger.fatal(`Application shutdown failed: ${error}`);
    process.exit(1);
  }
}

bootstrap().catch(err => {
  console.error('Error during application bootstrap:', err);
  process.exit(1);
});
