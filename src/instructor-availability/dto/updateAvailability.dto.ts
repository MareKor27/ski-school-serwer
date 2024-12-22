import { CreateAvailabilityDto } from './createAvailability.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateAvailabilityDto extends PartialType(CreateAvailabilityDto) {}
