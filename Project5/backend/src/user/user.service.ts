import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDocument } from "./schemas/user.schema";
import { CreateUserDto } from "./dto/create-user.dto";
import { isValidObjectId } from "../utils/validate-objectid";

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findOne(id: string): Promise<User> {
    return this.userModel.findById(id).exec();
  }

  async findByPhone(phone: string): Promise<User> {
    return this.userModel.findOne({ phone }).exec();
  }

  async updateRating(id: string, rating: number): Promise<User> {
    if (!isValidObjectId(id)) {
      throw new NotFoundException("Invalid user ID format");
    }
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException("User not found");
    }
    const newRating =
      (user.rating * user.orderCount + rating) / (user.orderCount + 1);
    return this.userModel
      .findByIdAndUpdate(
        id,
        { rating: newRating, orderCount: user.orderCount + 1 },
        { new: true },
      )
      .exec();
  }
}
