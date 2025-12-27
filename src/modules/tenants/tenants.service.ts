import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tenant } from './entities/tenant.entity';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';

@Injectable()
export class TenantsService {
  constructor(
    @InjectModel(Tenant.name)
    private tenantModel: Model<Tenant>,
  ) {}

  async create(createTenantDto: CreateTenantDto): Promise<Tenant> {
    const tenant = new this.tenantModel(createTenantDto);
    return tenant.save();
  }

  async findAll(propertyId?: string): Promise<Tenant[]> {
    const query = propertyId ? { propertyId } : {};
    return this.tenantModel.find(query).populate('roomId').populate('propertyId').exec();
  }

  async findOne(id: string): Promise<Tenant> {
    const tenant = await this.tenantModel
      .findById(id)
      .populate('roomId')
      .populate('propertyId')
      .exec();
    if (!tenant) {
      throw new NotFoundException(`Tenant with ID ${id} not found`);
    }
    return tenant;
  }

  async update(id: string, updateTenantDto: UpdateTenantDto): Promise<Tenant> {
    const tenant = await this.tenantModel
      .findByIdAndUpdate(id, updateTenantDto, { new: true })
      .populate('roomId')
      .populate('propertyId')
      .exec();
    if (!tenant) {
      throw new NotFoundException(`Tenant with ID ${id} not found`);
    }
    return tenant;
  }

  async remove(id: string): Promise<void> {
    const result = await this.tenantModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Tenant with ID ${id} not found`);
    }
  }

  async findByProperty(propertyId: string): Promise<Tenant[]> {
    return this.tenantModel
      .find({ propertyId, status: 'active' })
      .populate('roomId')
      .populate('propertyId')
      .exec();
  }

  async findByRoom(roomId: string): Promise<Tenant[]> {
    return this.tenantModel
      .find({ roomId, status: 'active' })
      .populate('roomId')
      .populate('propertyId')
      .exec();
  }

  async checkIn(id: string, checkInDate: Date): Promise<Tenant> {
    return this.tenantModel
      .findByIdAndUpdate(id, { checkInDate, status: 'active' }, { new: true })
      .exec();
  }

  async checkOut(id: string, checkOutDate: Date): Promise<Tenant> {
    return this.tenantModel
      .findByIdAndUpdate(id, { checkOutDate, status: 'inactive' }, { new: true })
      .exec();
  }
}
