import { Module } from '@nestjs/common';
//import { SequelizeModule } from '@nestjs/sequelize';
import { MongooseModule } from '@nestjs/mongoose';
import { envConfig } from '@/config/env.config';
import { User, UserSchema } from '@/modules/users/entities/user.entity';

@Module({
  imports: [
    // MongoDB - Primary database for storage
    MongooseModule.forRoot(envConfig.database.mongodb.uri),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    // Sequelize - Available for future use (not active)
    // Uncomment below when ready to use SQL database alongside MongoDB
    // SequelizeModule.forRoot({
    //   dialect: 'mysql',
    //   host: envConfig.database.host,
    //   port: envConfig.database.port,
    //   username: envConfig.database.username,
    //   password: envConfig.database.password,
    //   database: envConfig.database.database,
    //   autoLoadModels: true,
    //   synchronize: envConfig.database.synchronize,
    //   logging: envConfig.database.logging ? console.log : false,
    //   pool: envConfig.database.pool,
    // }),
  ],
})
export class DatabaseModule {}
