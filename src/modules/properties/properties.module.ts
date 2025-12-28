import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { PropertiesService } from './properties.service';
import { PropertiesController } from './properties.controller';
import { Property } from '@/database/sql/entities/property.entity';

@Module({
  imports: [SequelizeModule.forFeature([Property])],
  controllers: [PropertiesController],
  providers: [PropertiesService],
  exports: [PropertiesService],
})
export class PropertiesModule {}
