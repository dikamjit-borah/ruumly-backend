import {
  Column,
  DataType,
  Model,
  Table,
  ForeignKey,
  BelongsTo,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';
import { Tenant } from './tenant.entity';
import { Room } from './room.entity';
import { Property } from './property.entity';

@Table({
  tableName: 'rents',
  timestamps: true,
  underscored: true,
})
export class Rent extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @ForeignKey(() => Tenant)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  tenantId: string;

  @BelongsTo(() => Tenant, 'tenantId')
  tenant: Tenant;

  @ForeignKey(() => Room)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  roomId: string;

  @BelongsTo(() => Room, 'roomId')
  room: Room;

  @ForeignKey(() => Property)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  propertyId: string;

  @BelongsTo(() => Property, 'propertyId')
  property: Property;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  amount: number;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  dueDate: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  paidDate: Date;

  @Column({
    type: DataType.ENUM('pending', 'partial', 'paid', 'overdue'),
    defaultValue: 'pending',
  })
  status: string;

  @Column({
    type: DataType.DECIMAL(10, 2),
    defaultValue: 0,
  })
  amountPaid: number;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  paymentMethod: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
  })
  transactionId: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  notes: string;

  @CreatedAt
  @Column({
    type: DataType.DATE,
  })
  createdAt: Date;

  @UpdatedAt
  @Column({
    type: DataType.DATE,
  })
  updatedAt: Date;
}
