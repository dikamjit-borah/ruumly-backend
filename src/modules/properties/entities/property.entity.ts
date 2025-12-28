import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Property extends Document {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  address: string;

  @Prop()
  city: string;

  @Prop()
  state: string;

  @Prop()
  pinCode: string;

  @Prop()
  country: string;

  @Prop()
  totalRooms: number;

  @Prop({ default: 'active', enum: ['active', 'inactive', 'maintenance'] })
  status: string;

  @Prop()
  ownerId: string;

  @Prop({ default: new Date() })
  createdAt: Date;

  @Prop({ default: new Date() })
  updatedAt: Date;
}

export const PropertySchema = SchemaFactory.createForClass(Property);
