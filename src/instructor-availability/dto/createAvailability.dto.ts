import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateAvailabilityDto {
  @IsNumber()
  @IsNotEmpty()
  idInstructor: number;

  availabilityDate: Date;

  @IsNumber()
  @IsNotEmpty()
  IdReservation: number;

  createAt?: Date;

  updateAt?: Date;
}
