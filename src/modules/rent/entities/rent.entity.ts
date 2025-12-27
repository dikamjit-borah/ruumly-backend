import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Rent extends Document {
  @Prop({ required: true, type: Types.ObjectId, ref: 'Tenant' })
  tenantId: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Room' })
  roomId: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Property' })
  propertyId: Types.ObjectId;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  dueDate: Date;

  @Prop()
  paidDate: Date;

  @Prop({ default: 'pending', enum: ['pending', 'partial', 'paid', 'overdue'] })
  status: string;

  @Prop({ default: 0 })
  amountPaid: number;

  @Prop()
  paymentMethod: string;

  @Prop()
  transactionId: string;

  @Prop()
  notes: string;

  @Prop({ default: new Date() })
  createdAt: Date;

  @Prop({ default: new Date() })
  updatedAt: Date;
}

export const RentSchema = SchemaFactory.createForClass(Rent);
