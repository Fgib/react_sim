import { ConfigService } from '@nestjs/config';
import { plainToInstance } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumberString, IsString, validateSync } from 'class-validator';

enum Environment {
  development = 'dev',
  production = 'production',
  test = 'test'
}

export class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment = Environment.development;

  @IsString()
  HOST = '127.0.0.1';

  @IsNumberString()
  PORT = '3001';

  @IsString()
  ENVIRONMENT = 'dev';

  @IsString()
  @IsNotEmpty()
  PSQL_USER: string

  @IsString()
  @IsNotEmpty()
  PSQL_PWD: string

  @IsString()
  @IsNotEmpty()
  PSQL_HOST: string

  @IsNumberString()
  @IsNotEmpty()
  PSQL_PORT: string

  PSQL_DATABASE: "kawaien"
}

export function validateEnvironment(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}

export type ConfigurationService = ConfigService<EnvironmentVariables, true>;
