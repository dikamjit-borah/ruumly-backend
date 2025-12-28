import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Owner } from '@/database/sql/entities/owner.entity';
import { CreateOwnerDto } from './dto/create-owner.dto';
import { UpdateOwnerDto } from './dto/update-owner.dto';

@Injectable()
export class OwnersService {
  constructor(
    @InjectModel(Owner)
    private readonly ownerModel: typeof Owner,
  ) {}

  async create(createOwnerDto: CreateOwnerDto): Promise<Owner> {
    return this.ownerModel.create(createOwnerDto as any);
  }

  async findAll(): Promise<Owner[]> {
    return this.ownerModel.findAll({
      attributes: { exclude: ['password'] },
    });
  }

  async findOne(id: string): Promise<Owner> {
    return this.ownerModel.findByPk(id, {
      attributes: { exclude: ['password'] },
    });
  }

  async findByEmail(email: string): Promise<Owner> {
    return this.ownerModel.findOne({
      where: { email },
    });
  }

  async update(id: string, updateOwnerDto: UpdateOwnerDto): Promise<Owner> {
    const owner = await this.findOne(id);
    return owner.update(updateOwnerDto);
  }

  async remove(id: string): Promise<Owner> {
    const owner = await this.findOne(id);
    await owner.destroy();
    return owner;
  }
}
