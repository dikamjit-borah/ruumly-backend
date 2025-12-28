import {
  Column,
  DataType,
  Model,
  Table,
  Unique,
  CreatedAt,
  UpdatedAt,
  HasMany,
} from 'sequelize-typescript';
import { Property } from './property.entity';

@Table({
  tableName: 'owners',
  timestamps: true,
  underscored: true,
})
export class Owner extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @Unique
  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  email: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  password: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  profile_picture: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  is_active: boolean;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  last_login: Date;

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

  @HasMany(() => Property, 'ownerId')
  properties: Property[];
}
