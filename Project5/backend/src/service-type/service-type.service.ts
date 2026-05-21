import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import {
  ServiceType,
  ServiceTypeDocument,
} from "./schemas/service-type.schema";
import { CreateServiceTypeDto } from "./dto/create-service-type.dto";
import { UpdateServiceTypeDto } from "./dto/update-service-type.dto";
import { isValidObjectId } from "../utils/validate-objectid";

@Injectable()
export class ServiceTypeService {
  constructor(
    @InjectModel(ServiceType.name)
    private serviceTypeModel: Model<ServiceTypeDocument>,
  ) {}

  async create(
    createServiceTypeDto: CreateServiceTypeDto,
  ): Promise<ServiceType> {
    const createdServiceType = new this.serviceTypeModel(createServiceTypeDto);
    return createdServiceType.save();
  }

  async findAll(): Promise<ServiceType[]> {
    return this.serviceTypeModel.find({ isActive: true }).exec();
  }

  async findOne(id: string): Promise<ServiceType> {
    if (!isValidObjectId(id)) {
      throw new NotFoundException("Invalid service type ID format");
    }
    return this.serviceTypeModel.findById(id).exec();
  }

  async update(
    id: string,
    updateServiceTypeDto: UpdateServiceTypeDto,
  ): Promise<ServiceType> {
    if (!isValidObjectId(id)) {
      throw new NotFoundException("Invalid service type ID format");
    }
    return this.serviceTypeModel
      .findByIdAndUpdate(id, updateServiceTypeDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<ServiceType> {
    if (!isValidObjectId(id)) {
      throw new NotFoundException("Invalid service type ID format");
    }
    return this.serviceTypeModel
      .findByIdAndUpdate(id, { isActive: false }, { new: true })
      .exec();
  }
}
