import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { MongooseModule } from '@nestjs/mongoose';
import { envConfig } from '@/config/env.config';
//import { LogSchema } from '@/database/logging/log.entity';

// Sequelize SQL Entities
import { Owner } from '@/database/sql/entities/owner.entity';
import { Property } from '@/database/sql/entities/property.entity';
import { Room } from '@/database/sql/entities/room.entity';
import { Tenant } from '@/database/sql/entities/tenant.entity';
import { Rent } from '@/database/sql/entities/rent.entity';

@Module({
  imports: [
    // MongoDB - For Logging
    MongooseModule.forRoot(envConfig.database.mongodb.uri),
    //MongooseModule.forFeature([{ name: 'Log', schema: LogSchema }]),

    // Sequelize MySQL - For Primary Data Storage
    SequelizeModule.forRoot({
      dialect: 'mysql',
      host: envConfig.database.host,
      port: envConfig.database.port,
      username: envConfig.database.username,
      password: envConfig.database.password,
      database: envConfig.database.database,
      models: [Owner, Property, Room, Tenant, Rent],
      autoLoadModels: true,
      synchronize: envConfig.database.synchronize == 'true',
      logging: envConfig.database.logging == 'true' ? console.log : false,
      pool: envConfig.database.pool,
    }),

    // Register SQL models for injection
    SequelizeModule.forFeature([Owner, Property, Room, Tenant, Rent]),
  ],
})
export class DatabaseModule {}
