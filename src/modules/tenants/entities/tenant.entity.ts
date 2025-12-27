import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Tenant extends Document {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  phoneNumber: string;

  @Prop({ type: Types.ObjectId, ref: 'Room' })
  roomId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Property' })
  propertyId: Types.ObjectId;

  @Prop()
  idNumber: string;

  @Prop()
  emergencyContact: string;

  @Prop()
  emergencyPhone: string;

  @Prop({ default: 'active', enum: ['active', 'inactive', 'evicted'] })
  status: string;

  @Prop()
  checkInDate: Date;

  @Prop()
  checkOutDate: Date;

  @Prop()
  depositPaid: number;

  @Prop()
  rentAmount: number;

  @Prop()
  document: string;

  @Prop()
  notes: string;

  @Prop({ default: new Date() })
  createdAt: Date;

  @Prop({ default: new Date() })
  updatedAt: Date;
}

export const TenantSchema = SchemaFactory.createForClass(Tenant);
