import { CreateReservationDto } from './createReservation.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateReservationDto extends PartialType(CreateReservationDto) {}
