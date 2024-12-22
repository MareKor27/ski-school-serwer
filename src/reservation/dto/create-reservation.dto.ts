import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { purchasedTime, PurchasedTime } from '../types/purchasedTime';
import { ChosenEquipment, chosenEquipment } from '../types/chosenEquipment';
import { Type } from 'class-transformer';

export class CreateReservationDto {
  @IsNotEmpty()
  @IsNumber()
  idClient: number;

  @IsNotEmpty()
  @IsNumber()
  idInstructor: number;

  reservationDate: string;

  @IsNotEmpty()
  @IsEnum(purchasedTime, { message: 'Bad time chosen' })
  purchasedTime: PurchasedTime;

  @IsNotEmpty()
  @IsString()
  participants: string;

  @IsNotEmpty()
  @IsString()
  ageOfParticipants: string;

  @IsNotEmpty()
  @IsString()
  advancement: string;

  @IsNotEmpty()
  @IsEnum(chosenEquipment, { message: 'incorrectly selected equipment' })
  chosenEquipment: ChosenEquipment;

  @IsString()
  additionalComments: string;

  @IsString()
  insuranceInformation: string;

  @Type(() => Date)
  createdAt: string;

  @Type(() => Date)
  updatedAt: string;
}
