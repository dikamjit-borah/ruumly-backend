import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Room } from '@/database/sql/entities/room.entity';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';

@Injectable()
export class RoomsService {
  constructor(
    @InjectModel(Room)
    private roomModel: typeof Room,
  ) {}

  async create(createRoomDto: CreateRoomDto): Promise<Room> {
    return this.roomModel.create(createRoomDto as any);
  }

  async findAll(propertyId?: string): Promise<Room[]> {
    const where = propertyId ? { propertyId } : {};
    return this.roomModel.findAll({
      where,
      include: ['property', 'currentTenant'],
    });
  }

  async findOne(id: string): Promise<Room> {
    const room = await this.roomModel.findByPk(id, {
      include: ['property', 'currentTenant'],
    });
    if (!room) {
      throw new NotFoundException(`Room with ID ${id} not found`);
    }
    return room;
  }

  async update(id: string, updateRoomDto: UpdateRoomDto): Promise<Room> {
    const room = await this.roomModel.findByPk(id);
    if (!room) {
      throw new NotFoundException(`Room with ID ${id} not found`);
    }
    return room.update(updateRoomDto);
  }

  async remove(id: string): Promise<void> {
    const room = await this.roomModel.findByPk(id);
    if (!room) {
      throw new NotFoundException(`Room with ID ${id} not found`);
    }
    await room.destroy();
  }

  async findByProperty(propertyId: string): Promise<Room[]> {
    return this.roomModel.findAll({
      where: { propertyId },
      include: ['property', 'currentTenant'],
    });
  }

  async getOccupancyStats(propertyId: string) {
    const rooms = await this.roomModel.findAll({
      where: { propertyId },
    });
    const occupied = rooms.filter((r) => r.status === 'occupied').length;
    const vacant = rooms.filter((r) => r.status === 'vacant').length;
    const maintenance = rooms.filter((r) => r.status === 'maintenance').length;

    return {
      total: rooms.length,
      occupied,
      vacant,
      maintenance,
      occupancyRate: rooms.length > 0 ? (occupied / rooms.length) * 100 : 0,
    };
  }
}
