import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Room } from './entities/room.entity';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';

@Injectable()
export class RoomsService {
  constructor(
    @InjectModel(Room.name)
    private roomModel: Model<Room>,
  ) {}

  async create(createRoomDto: CreateRoomDto): Promise<Room> {
    const room = new this.roomModel(createRoomDto);
    return room.save();
  }

  async findAll(propertyId?: string): Promise<Room[]> {
    const query = propertyId ? { propertyId } : {};
    return this.roomModel.find(query).populate('propertyId').populate('currentTenantId').exec();
  }

  async findOne(id: string): Promise<Room> {
    const room = await this.roomModel
      .findById(id)
      .populate('propertyId')
      .populate('currentTenantId')
      .exec();
    if (!room) {
      throw new NotFoundException(`Room with ID ${id} not found`);
    }
    return room;
  }

  async update(id: string, updateRoomDto: UpdateRoomDto): Promise<Room> {
    const room = await this.roomModel
      .findByIdAndUpdate(id, updateRoomDto, { new: true })
      .populate('propertyId')
      .populate('currentTenantId')
      .exec();
    if (!room) {
      throw new NotFoundException(`Room with ID ${id} not found`);
    }
    return room;
  }

  async remove(id: string): Promise<void> {
    const result = await this.roomModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Room with ID ${id} not found`);
    }
  }

  async findByProperty(propertyId: string): Promise<Room[]> {
    return this.roomModel
      .find({ propertyId })
      .populate('propertyId')
      .populate('currentTenantId')
      .exec();
  }

  async getOccupancyStats(propertyId: string) {
    const rooms = await this.roomModel.find({ propertyId }).exec();
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
