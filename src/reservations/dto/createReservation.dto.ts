import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { purchasedTime, PurchasedTime } from '../types/purchasedTime';
import { ChosenEquipment, chosenEquipment } from '../types/chosenEquipment';
import { UserModel } from 'src/users/models/user.model';

export class CreateReservationDto {
  @IsNotEmpty()
  clientId: number;

  @IsNotEmpty()
  @IsEnum(purchasedTime, { message: 'Bad time chosen' })
  purchasedTime: PurchasedTime;

  @IsNotEmpty()
  @IsNumber()
  participants: number;

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
}
