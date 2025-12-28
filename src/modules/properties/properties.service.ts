import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Property } from '@/database/sql/entities/property.entity';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';

@Injectable()
export class PropertiesService {
  constructor(
    @InjectModel(Property)
    private propertyModel: typeof Property,
  ) {}

  async create(createPropertyDto: CreatePropertyDto, ownerId: string): Promise<Property> {
    return this.propertyModel.create({
      ...createPropertyDto,
      ownerId,
    } as any);
  }

  async findAll(ownerId: string): Promise<Property[]> {
    return this.propertyModel.findAll({ where: { ownerId } });
  }

  async findOne(id: string): Promise<Property> {
    const property = await this.propertyModel.findByPk(id);
    if (!property) {
      throw new NotFoundException(`Property with ID ${id} not found`);
    }
    return property;
  }

  async update(id: string, updatePropertyDto: UpdatePropertyDto): Promise<Property> {
    const property = await this.propertyModel.findByPk(id);
    if (!property) {
      throw new NotFoundException(`Property with ID ${id} not found`);
    }
    return property.update(updatePropertyDto);
  }

  async remove(id: string): Promise<void> {
    const property = await this.propertyModel.findByPk(id);
    if (!property) {
      throw new NotFoundException(`Property with ID ${id} not found`);
    }
    await property.destroy();
  }
}
