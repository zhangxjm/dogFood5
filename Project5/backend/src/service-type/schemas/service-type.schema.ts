import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ServiceTypeDocument = ServiceType & Document;

@Schema({ timestamps: true })
export class ServiceType {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  basePrice: number;

  @Prop({ default: true })
  isActive: boolean;
}

export const ServiceTypeSchema = SchemaFactory.createForClass(ServiceType);
