import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { Property, PropertySchema } from '@/modules/properties/entities/property.entity';
import { Room, RoomSchema } from '@/modules/rooms/entities/room.entity';
import { Tenant, TenantSchema } from '@/modules/tenants/entities/tenant.entity';
import { Rent, RentSchema } from '@/modules/rent/entities/rent.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Property.name, schema: PropertySchema },
      { name: Room.name, schema: RoomSchema },
      { name: Tenant.name, schema: TenantSchema },
      { name: Rent.name, schema: RentSchema },
    ]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
