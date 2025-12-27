import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RentService } from './rent.service';
import { RentController } from './rent.controller';
import { Rent, RentSchema } from './entities/rent.entity';

@Module({
  imports: [MongooseModule.forFeature([{ name: Rent.name, schema: RentSchema }])],
  controllers: [RentController],
  providers: [RentService],
  exports: [RentService],
})
export class RentModule {}
