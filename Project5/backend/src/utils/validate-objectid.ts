import { BadRequestException } from '@nestjs/common';
import { Types } from 'mongoose';

export function validateAndCreateObjectId(id: string, fieldName: string = 'ID'): Types.ObjectId {
  if (!id) {
    throw new BadRequestException(`${fieldName} is required`);
  }
  
  if (!Types.ObjectId.isValid(id)) {
    throw new BadRequestException(`Invalid ${fieldName} format: must be a 24-character hex string`);
  }
  
  return new Types.ObjectId(id);
}

export function isValidObjectId(id: string): boolean {
  if (!id) return false;
  return Types.ObjectId.isValid(id);
}
