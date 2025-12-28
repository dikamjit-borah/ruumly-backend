import {
  Column,
  DataType,
  Model,
  Table,
  ForeignKey,
  BelongsTo,
  HasMany,
  Unique,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';
import { Room } from './room.entity';
import { Property } from './property.entity';
import { Rent } from './rent.entity';

@Table({
  tableName: 'tenants',
  timestamps: true,
  underscored: true,
})
export class Tenant extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  firstName: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  lastName: string;

  @Unique
  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  email: string;

  @Column({
    type: DataType.STRING(20),
    allowNull: false,
  })
  phoneNumber: string;

  @ForeignKey(() => Room)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  roomId: string;

  @BelongsTo(() => Room, 'roomId')
  room: Room;

  @ForeignKey(() => Property)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  propertyId: string;

  @BelongsTo(() => Property, 'propertyId')
  property: Property;

  @Column({
    type: DataType.STRING(50),
    allowNull: true,
  })
  idNumber: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
  })
  emergencyContact: string;

  @Column({
    type: DataType.STRING(20),
    allowNull: true,
  })
  emergencyPhone: string;

  @Column({
    type: DataType.ENUM('active', 'inactive', 'evicted'),
    defaultValue: 'active',
  })
  status: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  checkInDate: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  checkOutDate: Date;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: true,
  })
  depositPaid: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: true,
  })
  rentAmount: number;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  document: string;

  @HasMany(() => Rent, 'tenantId')
  rents: Rent[];

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
