import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServiceTypeService } from './service-type.service';
import { ServiceTypeController } from './service-type.controller';
import { ServiceType, ServiceTypeSchema } from './schemas/service-type.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: ServiceType.name, schema: ServiceTypeSchema }])],
  controllers: [ServiceTypeController],
  providers: [ServiceTypeService],
  exports: [ServiceTypeService],
})
export class ServiceTypeModule {}
