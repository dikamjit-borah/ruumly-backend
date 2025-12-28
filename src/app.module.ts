import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { OwnersModule } from './modules/owners/owners.module';
import { HealthModule } from './modules/health/health.module';
import { PropertiesModule } from './modules/properties/properties.module';
import { RoomsModule } from './modules/rooms/rooms.module';
import { TenantsModule } from './modules/tenants/tenants.module';
import { RentModule } from './modules/rent/rent.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    OwnersModule,
    HealthModule,
    PropertiesModule,
    RoomsModule,
    TenantsModule,
    RentModule,
    DashboardModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
