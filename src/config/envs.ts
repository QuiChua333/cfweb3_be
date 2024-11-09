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
  JWT_LINK_SECRET: string;
  JWT_EXPIRED_LINK: string;

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
  FE_EMAIL_RESET_PASSWORD_URL: string;
  FE_EMAIL_VERIFY_SUCCESS_URL: string;
  FE_LOGIN_URL: string;

  BE_EMAIL_CONFIRM_URL: string;
  BE_URL: string;

  MAIL_USER: string;
  MAIL_PASSWORD: string;
  MAIL_HOST: string;

  CLOUDINARY_NAME: string;
  CLOUDINARY_API_KEY: string;
  CLOUDINARY_API_SECRET: string;
  CLOUDINARY_FOLDER_NAME: string;
  CLOUDINARY_CKE_UPLOAD_FOLDER_NAME: string;
}

const envSchema = joi
  .object({
    PORT: joi.number().required(),

    JWT_ACCESS_SECRET: joi.string().required(),
    JWT_REFRESH_SECRET: joi.string().required(),
    JWT_EXPIRED_ACCESS: joi.string().required(),
    JWT_EXPIRED_REFRESH: joi.string().required(),
    JWT_LINK_SECRET: joi.string().required(),
    JWT_EXPIRED_LINK: joi.string().required(),

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
    FE_EMAIL_RESET_PASSWORD_URL: joi.string().required(),
    FE_EMAIL_VERIFY_SUCCESS_URL: joi.string().required(),
    FE_LOGIN_URL: joi.string().required(),

    BE_EMAIL_CONFIRM_URL: joi.string().required(),
    BE_URL: joi.string().required(),

    MAIL_USER: joi.string().required(),
    MAIL_PASSWORD: joi.string().required(),
    MAIL_HOST: joi.string().required(),

    CLOUDINARY_NAME: joi.string().required(),
    CLOUDINARY_API_KEY: joi.string().required(),
    CLOUDINARY_API_SECRET: joi.string().required(),
    CLOUDINARY_FOLDER_NAME: joi.string().required(),
    CLOUDINARY_CKE_UPLOAD_FOLDER_NAME: joi.string().required(),
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
    autoLoadEntities: true,
    ssl: envVars.NODE_ENV === Env.DEVELOPMENT ? false : true,
    // logging: true,
    // dropSchema: true,
    synchronize: true,

    // entities: [`${__dirname}/../api/**/*.entity.{js,ts}`],
  },
  jwt: {
    accessSecret: envVars.JWT_ACCESS_SECRET,
    refreshSecret: envVars.JWT_REFRESH_SECRET,
    expiredAccess: envVars.JWT_EXPIRED_ACCESS,
    expiredRefresh: envVars.JWT_EXPIRED_REFRESH,
    linkSecret: envVars.JWT_LINK_SECRET,
    expiredLink: envVars.JWT_EXPIRED_LINK,
  },

  google: {
    clientId: envVars.GOOGLE_CLIENT_ID,
    clientSecret: envVars.GOOGLE_CLIENT_SECRET,
    callbackUrl: envVars.GOOGLE_CALLBACK_URL,
    scope: ['email', 'profile'],
  },

  fe: {
    homeUrl: envVars.FE_HOME_URL,
    emailResetPasswordUrl: envVars.FE_EMAIL_RESET_PASSWORD_URL,
    emailVerifySuccessUrl: envVars.FE_EMAIL_VERIFY_SUCCESS_URL,
    loginUrl: envVars.FE_LOGIN_URL,
  },

  be: {
    emailConfirmUrl: envVars.BE_EMAIL_CONFIRM_URL,
    beUrl: envVars.BE_URL,
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

  cloudinary: {
    cloud_name: envVars.CLOUDINARY_NAME,
    api_key: envVars.CLOUDINARY_API_KEY,
    api_secret: envVars.CLOUDINARY_API_SECRET,
    folder_name: envVars.CLOUDINARY_FOLDER_NAME,
    cke_folder_name: envVars.CLOUDINARY_CKE_UPLOAD_FOLDER_NAME,
  },
};
