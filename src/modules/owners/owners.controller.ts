import { Controller, Get, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { OwnersService } from './owners.service';
import { UpdateOwnerDto } from './dto/update-owner.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';

@Controller('owners')
export class OwnersController {
  constructor(private readonly ownersService: OwnersService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.ownersService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.ownersService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateOwnerDto: UpdateOwnerDto) {
    return this.ownersService.update(id, updateOwnerDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.ownersService.remove(id);
  }
}
