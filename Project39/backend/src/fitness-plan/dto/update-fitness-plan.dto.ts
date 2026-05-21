import { PartialType } from '@nestjs/swagger';
import { CreateFitnessPlanDto } from './create-fitness-plan.dto';

export class UpdateFitnessPlanDto extends PartialType(CreateFitnessPlanDto) {}
