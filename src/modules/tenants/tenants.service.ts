import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Tenant } from '@/database/sql/entities/tenant.entity';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';

@Injectable()
export class TenantsService {
  constructor(
    @InjectModel(Tenant)
    private tenantModel: typeof Tenant,
  ) {}

  async create(createTenantDto: CreateTenantDto): Promise<Tenant> {
    return this.tenantModel.create(createTenantDto as any);
  }

  async findAll(propertyId?: string): Promise<Tenant[]> {
    const where = propertyId ? { propertyId } : {};
    return this.tenantModel.findAll({
      where,
      include: ['room', 'property'],
    });
  }

  async findOne(id: string): Promise<Tenant> {
    const tenant = await this.tenantModel.findByPk(id, {
      include: ['room', 'property'],
    });
    if (!tenant) {
      throw new NotFoundException(`Tenant with ID ${id} not found`);
    }
    return tenant;
  }

  async update(id: string, updateTenantDto: UpdateTenantDto): Promise<Tenant> {
    const tenant = await this.tenantModel.findByPk(id);
    if (!tenant) {
      throw new NotFoundException(`Tenant with ID ${id} not found`);
    }
    return tenant.update(updateTenantDto);
  }

  async remove(id: string): Promise<void> {
    const tenant = await this.tenantModel.findByPk(id);
    if (!tenant) {
      throw new NotFoundException(`Tenant with ID ${id} not found`);
    }
    await tenant.destroy();
  }

  async findByProperty(propertyId: string): Promise<Tenant[]> {
    return this.tenantModel.findAll({
      where: { propertyId, status: 'active' },
      include: ['room', 'property'],
    });
  }

  async findByRoom(roomId: string): Promise<Tenant[]> {
    return this.tenantModel.findAll({
      where: { roomId, status: 'active' },
      include: ['room', 'property'],
    });
  }

  async checkIn(id: string, checkInDate: Date): Promise<Tenant> {
    const tenant = await this.tenantModel.findByPk(id);
    if (!tenant) {
      throw new NotFoundException(`Tenant with ID ${id} not found`);
    }
    return tenant.update({ checkInDate, status: 'active' });
  }

  async checkOut(id: string, checkOutDate: Date): Promise<Tenant> {
    const tenant = await this.tenantModel.findByPk(id);
    if (!tenant) {
      throw new NotFoundException(`Tenant with ID ${id} not found`);
    }
    return tenant.update({ checkOutDate, status: 'inactive' });
  }
}
