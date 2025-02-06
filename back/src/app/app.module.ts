import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { LoggerModule } from 'nestjs-pino';
import { ConfigurationService, validateEnvironment } from '../configuration/env';
import { CoreModule } from '../core/core.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmRepositoriesModule } from 'src/database/typeorm.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    CoreModule,
    TypeOrmRepositoriesModule,
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      cache: true,
      validate: validateEnvironment,
      envFilePath: ['.env'],
      isGlobal: true
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigurationService) => ({
        type: 'postgres',
        host: config.get('PSQL_HOST'),
        port: config.get('PSQL_PORT'),
        username: config.get('PSQL_USER'),
        password: config.get('PSQL_PWD'),
        database: config.get('PSQL_DATABASE'),
        synchronize: true,
        autoLoadEntities: true,
        // logging: true,
        // logger: 'file',
        logging: ['error', 'warn', 'info'],
        installExtensions: true,
        retryAttempts: 3
        // ssl: {
        // rejectUnauthorized: false
        // }
      }),
      inject: [ConfigService]
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        redact: ['req.headers'],
        level: process.env.FAST_DEBUG === 'true' ? 'debug' : 'info',
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'HH:MM:ss Z',
            ignore: 'pid,hostname',
            singleLine: true,
            messageFormat: '[{id}] {msg} {context}'
          }
        }
      }
    })
  ],
  controllers: [AppController],
  providers: [
    ConfigService,
    AppService
  ]
})
export class AppModule { }
