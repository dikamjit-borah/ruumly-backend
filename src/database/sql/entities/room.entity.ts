import {
  Column,
  DataType,
  Model,
  Table,
  ForeignKey,
  BelongsTo,
  HasMany,
  HasOne,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';
import { Property } from './property.entity';
import { Tenant } from './tenant.entity';
import { Rent } from './rent.entity';

@Table({
  tableName: 'rooms',
  timestamps: true,
  underscored: true,
})
export class Room extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  roomNumber: string;

  @ForeignKey(() => Property)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  propertyId: string;

  @BelongsTo(() => Property, 'propertyId')
  property: Property;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  floor: number;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description: string;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  rentAmount: number;

  @Column({
    type: DataType.ENUM('vacant', 'occupied', 'maintenance', 'reserved'),
    defaultValue: 'vacant',
  })
  status: string;

  @Column({
    type: DataType.FLOAT,
    allowNull: true,
  })
  squareFeet: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  bedrooms: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  bathrooms: number;

  @Column({
    type: DataType.JSON,
    defaultValue: [],
  })
  amenities: string[];

  @ForeignKey(() => Tenant)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  currentTenantId: string;

  @HasOne(() => Tenant, 'roomId')
  tenant: Tenant;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: true,
  })
  depositAmount: number;

  @HasMany(() => Rent, 'roomId')
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
