import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Property } from '@/modules/properties/entities/property.entity';
import { Room } from '@/modules/rooms/entities/room.entity';
import { Tenant } from '@/modules/tenants/entities/tenant.entity';
import { Rent } from '@/modules/rent/entities/rent.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(Property.name)
    private propertyModel: Model<Property>,
    @InjectModel(Room.name)
    private roomModel: Model<Room>,
    @InjectModel(Tenant.name)
    private tenantModel: Model<Tenant>,
    @InjectModel(Rent.name)
    private rentModel: Model<Rent>,
  ) {}

  async getDashboardSummary(propertyId: string) {
    const [property, tenants, rents, totalRooms, occupiedRooms, pendingRents] = await Promise.all([
      this.propertyModel.findById(propertyId).exec(),
      this.tenantModel.find({ propertyId, status: 'active' }).exec(),
      this.rentModel.find({ propertyId }).exec(),
      this.roomModel.countDocuments({ propertyId }),
      this.roomModel.countDocuments({ propertyId, status: 'occupied' }),
      this.rentModel.countDocuments({
        propertyId,
        status: { $in: ['pending', 'overdue'] },
      }),
    ]);

    const totalRent = rents.reduce((sum, r) => sum + r.amount, 0);
    const totalPaid = rents.reduce((sum, r) => sum + r.amountPaid, 0);
    const occupancyRate = totalRooms > 0 ? (occupiedRooms / totalRooms) * 100 : 0;
    const collectionRate = totalRent > 0 ? (totalPaid / totalRent) * 100 : 0;

    return {
      property,
      summary: {
        totalRooms,
        occupiedRooms,
        vacantRooms: totalRooms - occupiedRooms,
        occupancyRate: occupancyRate.toFixed(2),
        activeTenants: tenants.length,
        totalRent,
        totalPaid,
        totalPending: totalRent - totalPaid,
        collectionRate: collectionRate.toFixed(2),
        pendingRents,
      },
    };
  }

  async getRecentActivity(propertyId: string, limit = 10) {
    const [recentTenants, recentRents, recentRooms] = await Promise.all([
      this.tenantModel
        .find({ propertyId })
        .sort({ createdAt: -1 })
        .limit(limit)
        .populate('roomId')
        .exec(),
      this.rentModel
        .find({ propertyId })
        .sort({ paidDate: -1 })
        .limit(limit)
        .populate('tenantId')
        .exec(),
      this.roomModel.find({ propertyId }).sort({ updatedAt: -1 }).limit(limit).exec(),
    ]);

    const activities = [
      ...recentTenants.map((t) => ({
        type: 'tenant',
        action: 'created',
        description: `${t.firstName} ${t.lastName} added`,
        timestamp: t.createdAt,
        data: t,
      })),
      ...recentRents.map((r) => ({
        type: 'rent',
        action: r.status === 'paid' ? 'paid' : 'updated',
        description: `Rent payment of ${r.amountPaid}/${r.amount}`,
        timestamp: r.paidDate || r.updatedAt,
        data: r,
      })),
      ...recentRooms.map((r) => ({
        type: 'room',
        action: 'updated',
        description: `Room ${r.roomNumber} status changed to ${r.status}`,
        timestamp: r.updatedAt,
        data: r,
      })),
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return activities.slice(0, limit);
  }

  async getFinancialOverview(propertyId: string) {
    const rents = await this.rentModel.find({ propertyId }).exec();
    const months = {};

    rents.forEach((rent) => {
      const month = new Date(rent.dueDate).toISOString().slice(0, 7);
      if (!months[month]) {
        months[month] = {
          month,
          expected: 0,
          received: 0,
        };
      }
      months[month].expected += rent.amount;
      months[month].received += rent.amountPaid;
    });

    return Object.values(months).sort((a: any, b: any) => a.month.localeCompare(b.month));
  }
}
