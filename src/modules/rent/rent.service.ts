import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Rent } from './entities/rent.entity';
import { CreateRentDto } from './dto/create-rent.dto';
import { UpdateRentDto } from './dto/update-rent.dto';

@Injectable()
export class RentService {
  constructor(
    @InjectModel(Rent.name)
    private rentModel: Model<Rent>,
  ) {}

  async create(createRentDto: CreateRentDto): Promise<Rent> {
    const rent = new this.rentModel({
      ...createRentDto,
      status: 'pending',
    });
    return rent.save();
  }

  async findAll(propertyId?: string): Promise<Rent[]> {
    const query = propertyId ? { propertyId } : {};
    return this.rentModel
      .find(query)
      .populate('tenantId')
      .populate('roomId')
      .populate('propertyId')
      .sort({ dueDate: -1 })
      .exec();
  }

  async findOne(id: string): Promise<Rent> {
    const rent = await this.rentModel
      .findById(id)
      .populate('tenantId')
      .populate('roomId')
      .populate('propertyId')
      .exec();
    if (!rent) {
      throw new NotFoundException(`Rent with ID ${id} not found`);
    }
    return rent;
  }

  async update(id: string, updateRentDto: UpdateRentDto): Promise<Rent> {
    const rent = await this.rentModel
      .findByIdAndUpdate(id, updateRentDto, { new: true })
      .populate('tenantId')
      .populate('roomId')
      .populate('propertyId')
      .exec();
    if (!rent) {
      throw new NotFoundException(`Rent with ID ${id} not found`);
    }
    return rent;
  }

  async remove(id: string): Promise<void> {
    const result = await this.rentModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Rent with ID ${id} not found`);
    }
  }

  async recordPayment(
    id: string,
    amountPaid: number,
    paymentMethod: string,
    transactionId?: string,
  ): Promise<Rent> {
    const rent = await this.rentModel.findById(id).exec();
    if (!rent) {
      throw new NotFoundException(`Rent with ID ${id} not found`);
    }

    const newAmountPaid = rent.amountPaid + amountPaid;
    const status =
      newAmountPaid >= rent.amount ? 'paid' : newAmountPaid > 0 ? 'partial' : 'pending';

    return this.rentModel
      .findByIdAndUpdate(
        id,
        {
          amountPaid: newAmountPaid,
          status,
          paymentMethod,
          transactionId: transactionId || rent.transactionId,
          paidDate: status === 'paid' ? new Date() : rent.paidDate,
        },
        { new: true },
      )
      .populate('tenantId')
      .populate('roomId')
      .populate('propertyId')
      .exec();
  }

  async getPendingRent(propertyId: string): Promise<Rent[]> {
    return this.rentModel
      .find({ propertyId, status: { $in: ['pending', 'overdue', 'partial'] } })
      .populate('tenantId')
      .populate('roomId')
      .sort({ dueDate: 1 })
      .exec();
  }

  async getRentStats(propertyId: string) {
    const rents = await this.rentModel.find({ propertyId }).exec();
    const totalRent = rents.reduce((sum, r) => sum + r.amount, 0);
    const totalPaid = rents.reduce((sum, r) => sum + r.amountPaid, 0);
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
