import { Controller, Get, Param, UseGuards, Query } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';

@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('property/:propertyId/summary')
  getSummary(@Param('propertyId') propertyId: string) {
    return this.dashboardService.getDashboardSummary(propertyId);
  }

  @Get('property/:propertyId/activity')
  getRecentActivity(@Param('propertyId') propertyId: string, @Query('limit') limit?: string) {
    return this.dashboardService.getRecentActivity(propertyId, limit ? parseInt(limit) : 10);
  }

  @Get('property/:propertyId/financial')
  getFinancialOverview(@Param('propertyId') propertyId: string) {
    return this.dashboardService.getFinancialOverview(propertyId);
  }
}
