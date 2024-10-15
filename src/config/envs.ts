import { Env } from '@/constants';
import { MailerOptions } from '@nestjs-modules/mailer';
import 'dotenv/config';
import * as joi from 'joi';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

interface EnvVars {
  PORT: number;

  JWT_ACCESS_SECRET: string;
  JWT_REFRESH_SECRET: string;
  JWT_EXPIRED_ACCESS: string;
  JWT_EXPIRED_REFRESH: string;

  NODE_ENV: string;

  DB_URL: string;
  DB_HOST: string;
  DB_TYPE: string;
  DB_PORT: number;
  DB_USERNAME: string;
  DB_PASSWORD: string;
  DB_DATABASE: string;

  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  GOOGLE_CALLBACK_URL: string;

  FE_HOME_URL: string;

  MAIL_USER: string;
  MAIL_PASSWORD: string;
  MAIL_HOST: string;
}

const envSchema = joi
  .object({
    PORT: joi.number().required(),

    JWT_ACCESS_SECRET: joi.string().required(),
    JWT_REFRESH_SECRET: joi.string().required(),
    JWT_EXPIRED_ACCESS: joi.string().required(),
    JWT_EXPIRED_REFRESH: joi.string().required(),

    NODE_ENV: joi
      .string()
      .valid(...Object.values(Env))
      .required(),

    DB_TYPE: joi.string().required(),
    DB_HOST: joi.string().required(),
    DB_PORT: joi.number().required(),
    DB_USERNAME: joi.string().required(),
    DB_PASSWORD: joi.string().required(),
    DB_DATABASE: joi.string().required(),

    GOOGLE_CLIENT_ID: joi.string().required(),
    GOOGLE_CLIENT_SECRET: joi.string().required(),
    GOOGLE_CALLBACK_URL: joi.string().required(),

    FE_HOME_URL: joi.string().required(),

    MAIL_USER: joi.string().required(),
    MAIL_PASSWORD: joi.string().required(),
    MAIL_HOST: joi.string().required(),
  })
  .unknown(true);

const { error, value } = envSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const envVars: EnvVars = value;

export const envs = {
  port: envVars.PORT,
  db: <PostgresConnectionOptions>{
    type: envVars.DB_TYPE || 'postgres',
    host: envVars.DB_HOST || 'localhost',
    port: envVars.DB_PORT || 5432,
    username: envVars.DB_USERNAME,
    password: envVars.DB_PASSWORD,
    database: envVars.DB_DATABASE,
    entities: [],
    synchronize: true,
    autoLoadEntities: true,
    ssl: envVars.NODE_ENV === Env.DEVELOPMENT ? false : true,
    // entities: [`${__dirname}/../api/**/*.entity.{js,ts}`],
  },
  jwt: {
    accessSecret: envVars.JWT_ACCESS_SECRET,
    refreshSecret: envVars.JWT_REFRESH_SECRET,
    expiredAccess: envVars.JWT_EXPIRED_ACCESS,
    expiredRefresh: envVars.JWT_EXPIRED_REFRESH,
  },

  google: {
    clientId: envVars.GOOGLE_CLIENT_ID,
    clientSecret: envVars.GOOGLE_CLIENT_SECRET,
    callbackUrl: envVars.GOOGLE_CALLBACK_URL,
    scope: ['email', 'profile'],
  },

  fe: {
    homeUrl: envVars.FE_HOME_URL,
  },

  email: <MailerOptions>{
    transport: {
      secure: false,
      service: 'gmail',
      host: envVars.MAIL_HOST,
      port: 587,
      auth: {
        user: envVars.MAIL_USER,
        pass: envVars.MAIL_PASSWORD,
      },
    },
    defaults: {
      from: `"CrowdFunding" <${envVars.MAIL_USER}>`,
    },
  },
};
