import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Review, ReviewDocument } from './schemas/review.schema';
import { CreateReviewDto } from './dto/create-review.dto';
import { UserService } from '../user/user.service';
import { validateAndCreateObjectId } from '../utils/validate-objectid';

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>,
    private userService: UserService,
  ) {}

  async create(createReviewDto: CreateReviewDto): Promise<Review> {
    const existingReview = await this.reviewModel.findOne({
      orderId: validateAndCreateObjectId(createReviewDto.orderId, 'orderId'),
    }).exec();

    if (existingReview) {
      throw new BadRequestException('Review already exists for this order');
    }

    const createdReview = new this.reviewModel({
      ...createReviewDto,
      orderId: validateAndCreateObjectId(createReviewDto.orderId, 'orderId'),
      customerId: validateAndCreateObjectId(createReviewDto.customerId, 'customerId'),
      runnerId: validateAndCreateObjectId(createReviewDto.runnerId, 'runnerId'),
    });

    await this.userService.updateRating(createReviewDto.runnerId, createReviewDto.rating);

    return createdReview.save();
  }

  async findAll(): Promise<Review[]> {
    return this.reviewModel.find()
      .populate('orderId', 'title price')
      .populate('customerId', 'name')
      .populate('runnerId', 'name')
      .exec();
  }

  async findByRunner(runnerId: string): Promise<Review[]> {
    return this.reviewModel.find({ runnerId: validateAndCreateObjectId(runnerId, 'runnerId') })
      .populate('orderId', 'title price')
      .populate('customerId', 'name')
      .exec();
  }
}
