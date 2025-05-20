import { UserDto } from 'src/users/dto/user.dto';
import { PurchasedTime } from '../types/purchasedTime';
import { ChosenEquipment } from '../types/chosenEquipment';
import { EmptyDto } from 'src/commons/dto/empty.dto';
import { CreateReservationDto } from './createReservation.dto';

export type ReservationDto = {
  id: number;

  // client: UserDto | EmptyDto;

  fullName: string;

  email: string;

  phoneNumber: string;

  purchasedTime: number;

  participants: number;

  ageOfParticipants: string;

  advancement: string;

  chosenEquipment: ChosenEquipment;

  additionalComments: string;

  insuranceInformation: string;
};

export type ReservationBodyDto = {
  reservation: CreateReservationDto;

  filteredReservationAppoitmentsIds: number[];
};
