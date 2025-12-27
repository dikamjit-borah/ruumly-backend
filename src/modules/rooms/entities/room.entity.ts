import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Room extends Document {
  @Prop({ required: true })
  roomNumber: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Property' })
  propertyId: Types.ObjectId;

  @Prop()
  floor: number;

  @Prop()
  description: string;

  @Prop({ required: true })
  rentAmount: number;

  @Prop({ default: 'vacant', enum: ['vacant', 'occupied', 'maintenance', 'reserved'] })
  status: string;

  @Prop()
  squareFeet: number;

  @Prop()
  bedrooms: number;

  @Prop()
  bathrooms: number;

  @Prop([String])
  amenities: string[];

  @Prop({ type: Types.ObjectId, ref: 'Tenant' })
  currentTenantId: Types.ObjectId;

  @Prop()
  depositAmount: number;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const RoomSchema = SchemaFactory.createForClass(Room);
