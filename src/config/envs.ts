import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  PORT: number;

  JWT_ACCESS_SECRET: string;
  JWT_REFRESH_SECRET: string;
  JWT_EXPIRED_ACCESS: string;
  JWT_EXPIRED_REFRESH: string;

  TYPEORM_HOST: string;
  TYPEORM_PORT: number;
  TYPEORM_USERNAME: string;
  TYPEORM_PASSWORD: string;
  TYPEORM_DATABASE: string;
}

const envSchema = joi
  .object({
    PORT: joi.number().required(),

    JWT_ACCESS_SECRET: joi.string().required(),
    JWT_REFRESH_SECRET: joi.string().required(),
    JWT_EXPIRED_ACCESS: joi.string().required(),
    JWT_EXPIRED_REFRESH: joi.string().required(),

    TYPEORM_HOST: joi.string().required(),
    TYPEORM_PORT: joi.number().required(),
    TYPEORM_USERNAME: joi.string().required(),
    TYPEORM_PASSWORD: joi.string().required(),
    TYPEORM_DATABASE: joi.string().required(),
  })
  .unknown(true);

const { error, value } = envSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const envVars: EnvVars = value;

export const envs = {
  port: envVars.PORT,

  jwtAccessSecret: envVars.JWT_ACCESS_SECRET,
  jwtRefreshSecret: envVars.JWT_REFRESH_SECRET,
  jwtExpiredAccess: envVars.JWT_EXPIRED_ACCESS,
  jwtExpiredRefresh: envVars.JWT_EXPIRED_REFRESH,

  typeormHost: envVars.TYPEORM_HOST,
  typeormPort: envVars.TYPEORM_PORT,
  typeormUsername: envVars.TYPEORM_USERNAME,
  typeormPassword: envVars.TYPEORM_PASSWORD,
  typeormDatabase: envVars.TYPEORM_DATABASE,
};
