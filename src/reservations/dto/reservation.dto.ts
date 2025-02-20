import { UserDto } from 'src/users/dto/user.dto';
import { PurchasedTime } from '../types/purchasedTime';
import { ChosenEquipment } from '../types/chosenEquipment';
import { EmptyDto } from 'src/commons/dto/empty.dto';

export type ReservationDto = {
  id: number;

  client: UserDto | EmptyDto;

  purchasedTime: PurchasedTime;

  participants: number;

  ageOfParticipants: string;

  advancement: string;

  chosenEquipment: ChosenEquipment;

  additionalComments: string;

  insuranceInformation: string;
};
