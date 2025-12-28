import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Rent } from '@/database/sql/entities/rent.entity';
import { CreateRentDto } from './dto/create-rent.dto';
import { UpdateRentDto } from './dto/update-rent.dto';

@Injectable()
export class RentService {
  constructor(
    @InjectModel(Rent)
    private rentModel: typeof Rent,
  ) {}

  async create(createRentDto: CreateRentDto): Promise<Rent> {
    return this.rentModel.create({
      ...createRentDto,
      status: 'pending',
    } as any);
  }

  async findAll(propertyId?: string): Promise<Rent[]> {
    const where = propertyId ? { propertyId } : {};
    return this.rentModel.findAll({
      where,
      include: ['tenant', 'room', 'property'],
      order: [['dueDate', 'DESC']],
    });
  }

  async findOne(id: string): Promise<Rent> {
    const rent = await this.rentModel.findByPk(id, {
      include: ['tenant', 'room', 'property'],
    });
    if (!rent) {
      throw new NotFoundException(`Rent with ID ${id} not found`);
    }
    return rent;
  }

  async update(id: string, updateRentDto: UpdateRentDto): Promise<Rent> {
    const rent = await this.rentModel.findByPk(id);
    if (!rent) {
      throw new NotFoundException(`Rent with ID ${id} not found`);
    }
    return rent.update(updateRentDto);
  }

  async remove(id: string): Promise<void> {
    const rent = await this.rentModel.findByPk(id);
    if (!rent) {
      throw new NotFoundException(`Rent with ID ${id} not found`);
    }
    await rent.destroy();
  }

  async recordPayment(
    id: string,
    amountPaid: number,
    paymentMethod: string,
    transactionId?: string,
  ): Promise<Rent> {
    const rent = await this.rentModel.findByPk(id);
    if (!rent) {
      throw new NotFoundException(`Rent with ID ${id} not found`);
    }

    const newAmountPaid = Number(rent.amountPaid) + amountPaid;
    const amount = Number(rent.amount);
    const status = newAmountPaid >= amount ? 'paid' : newAmountPaid > 0 ? 'partial' : 'pending';

    return rent.update({
      amountPaid: newAmountPaid,
      status,
      paymentMethod,
      transactionId: transactionId || rent.transactionId,
      paidDate: status === 'paid' ? new Date() : rent.paidDate,
    } as any);
  }

  async getPendingRent(propertyId: string): Promise<Rent[]> {
    return this.rentModel.findAll({
      where: {
        propertyId,
        status: { [Op.in]: ['pending', 'overdue', 'partial'] },
      },
      include: ['tenant', 'room'],
      order: [['dueDate', 'ASC']],
    });
  }

  async getRentStats(propertyId: string) {
    const rents = await this.rentModel.findAll({
      where: { propertyId },
    });

    const totalRent = rents.reduce((sum, r) => sum + Number(r.amount), 0);
    const totalPaid = rents.reduce((sum, r) => sum + Number(r.amountPaid), 0);
    const pending = rents.filter((r) => r.status === 'pending').length;
    const overdue = rents.filter((r) => r.status === 'overdue').length;
    const paid = rents.filter((r) => r.status === 'paid').length;

    return {
      totalRent,
      totalPaid,
      totalPending: totalRent - totalPaid,
      pending,
      overdue,
      paid,
      collectionRate: totalRent > 0 ? (totalPaid / totalRent) * 100 : 0,
    };
  }
}
