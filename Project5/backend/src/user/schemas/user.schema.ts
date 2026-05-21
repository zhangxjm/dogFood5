import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  phone: string;

  @Prop({ required: true, enum: ['customer', 'runner'], default: 'customer' })
  role: string;

  @Prop({ default: 0 })
  rating: number;

  @Prop({ default: 0 })
  orderCount: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
