import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServiceTypeModule } from './service-type/service-type.module';
import { OrderModule } from './order/order.module';
import { UserModule } from './user/user.module';
import { ReviewModule } from './review/review.module';
import { EventsModule } from './events/events.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/errand_db'),
    ServiceTypeModule,
    OrderModule,
    UserModule,
    ReviewModule,
    EventsModule,
  ],
})
export class AppModule {}
