import { plainToClass } from "class-transformer";
import { IsEnum, validateSync, IsString, IsNumber, IsUrl } from "class-validator";

import { Environment } from "../constants/system";

class EnvironmentVariables {
  // @IsEnum(NodeEnvironment)
  // NODE_ENV: NodeEnvironment;

  @IsEnum(Environment)
  ENVIRONMENT: Environment;

  @IsNumber()
  DB_PORT: number;

  @IsString()
  DB_HOST: string;

  @IsString()
  DB_USER: string;

  @IsString()
  DB_PASSWORD: string;

  @IsString()
  DB_NAME: string;

  @IsNumber()
  APP_PORT: number;

  @IsString()
  API_HOST: string;

  @IsUrl()
  SLACK_DEPLOYMENT_HOOK: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToClass(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, { skipMissingProperties: false });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
