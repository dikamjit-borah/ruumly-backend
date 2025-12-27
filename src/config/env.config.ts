import { config } from 'dotenv';

config();

export const envConfig = {
  environment: process.env.NODE_ENV || 'development',
  app: {
    name: process.env.APP_NAME || 'Ruumly Backend',
    port: parseInt(process.env.PORT || '3000', 10),
  },
  database: {
    type: (process.env.DB_TYPE || 'mongodb') as 'mongodb' | 'mysql',
    // MongoDB Configuration
    mongodb: {
      uri: process.env.MONGODB_URI,
    },
    // MySQL Configuration
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_DATABASE || 'ruumly_db',
    dialect: (process.env.DB_DIALECT as any) || 'mysql',
    pool: {
      max: parseInt(process.env.DB_POOL_MAX || '5', 10),
      min: parseInt(process.env.DB_POOL_MIN || '0', 10),
      acquire: parseInt(process.env.DB_POOL_ACQUIRE || '30000', 10),
      idle: parseInt(process.env.DB_POOL_IDLE || '10000', 10),
    },
    synchronize: process.env.NODE_ENV !== 'production',
    logging: process.env.NODE_ENV !== 'production',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your_jwt_secret_key',
    expiresIn: process.env.JWT_EXPIRATION || '7d',
  },
  logging: {
    level: process.env.LOG_LEVEL || 'debug',
    dir: process.env.LOG_DIR || 'logs',
  },
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3001',
    credentials: process.env.CORS_CREDENTIALS === 'true',
    optionsSuccessStatus: 200,
  },
};

export const isDevelopment = envConfig.environment === 'development';
export const isProduction = envConfig.environment === 'production';
