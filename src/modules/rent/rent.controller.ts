import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { RentService } from './rent.service';
import { CreateRentDto } from './dto/create-rent.dto';
import { UpdateRentDto } from './dto/update-rent.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';

@Controller('rent')
@UseGuards(JwtAuthGuard)
export class RentController {
  constructor(private readonly rentService: RentService) {}

  @Post()
  create(@Body() createRentDto: CreateRentDto) {
    return this.rentService.create(createRentDto);
  }

  @Get()
  findAll(@Query('propertyId') propertyId?: string) {
    return this.rentService.findAll(propertyId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rentService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRentDto: UpdateRentDto) {
    return this.rentService.update(id, updateRentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rentService.remove(id);
  }

  @Post(':id/payment')
  recordPayment(
    @Param('id') id: string,
    @Body() body: { amountPaid: number; paymentMethod: string; transactionId?: string },
  ) {
    return this.rentService.recordPayment(
      id,
      body.amountPaid,
      body.paymentMethod,
      body.transactionId,
    );
  }

  @Get('property/:propertyId/pending')
  getPendingRent(@Param('propertyId') propertyId: string) {
    return this.rentService.getPendingRent(propertyId);
  }

  @Get('property/:propertyId/stats')
  getRentStats(@Param('propertyId') propertyId: string) {
    return this.rentService.getRentStats(propertyId);
  }
}
