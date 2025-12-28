import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { RentService } from './rent.service';
import { RentController } from './rent.controller';
import { Rent } from '@/database/sql/entities/rent.entity';

@Module({
  imports: [SequelizeModule.forFeature([Rent])],
  controllers: [RentController],
  providers: [RentService],
  exports: [RentService],
})
export class RentModule {}
