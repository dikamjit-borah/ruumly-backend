import {
  Column,
  DataType,
  Model,
  Table,
  ForeignKey,
  BelongsTo,
  HasMany,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';
import { User } from './user.entity';
import { Room } from './room.entity';

@Table({
  tableName: 'properties',
  timestamps: true,
  underscored: true,
})
export class Property extends Model {
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
  name: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  address: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  city: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  state: string;

  @Column({
    type: DataType.STRING(20),
    allowNull: true,
  })
  zipCode: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  country: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  totalRooms: number;

  @Column({
    type: DataType.ENUM('active', 'inactive', 'maintenance'),
    defaultValue: 'active',
  })
  status: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  ownerId: string;

  @BelongsTo(() => User, 'ownerId')
  owner: User;

  @HasMany(() => Room, 'propertyId')
  rooms: Room[];

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
