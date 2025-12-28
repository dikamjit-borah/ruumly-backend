import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { OwnersService } from './owners.service';
import { OwnersController } from './owners.controller';
import { Owner } from '@/database/sql/entities/owner.entity';

@Module({
  imports: [SequelizeModule.forFeature([Owner])],
  controllers: [OwnersController],
  providers: [OwnersService],
  exports: [OwnersService],
})
export class OwnersModule {}
