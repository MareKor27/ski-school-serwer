import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { purchasedTime, PurchasedTime } from '../types/purchasedTime';
import { ChosenEquipment, chosenEquipment } from '../types/chosenEquipment';
import { UserModel } from 'src/users/models/user.model';
import {
  reservationAdvancement,
  ReservationAdvancement,
} from '../types/reservationAdvancement';

export class CreateReservationDto {
  // @IsNotEmpty()
  // clientId: number;

  @IsNotEmpty()
  @IsString()
  fullName: string;

  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  phoneNumber: string;

  @IsNotEmpty()
  @IsNumber()
  purchasedTime: number;

  @IsNotEmpty()
  @IsNumber()
  participants: number;

  @IsNotEmpty()
  @IsString()
  ageOfParticipants: string;

  @IsNotEmpty()
  @IsEnum(reservationAdvancement, {
    message: 'incorrectly selected reservationAdvancement',
  })
  advancement: ReservationAdvancement;

  @IsNotEmpty()
  @IsEnum(chosenEquipment, { message: 'incorrectly selected equipment' })
  chosenEquipment: ChosenEquipment;

  @IsString()
  additionalComments: string;

  @IsString()
  insuranceInformation: string;
}
