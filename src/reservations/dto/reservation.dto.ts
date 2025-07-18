import { UserDto } from 'src/users/dto/user.dto';
import { PurchasedTime } from '../types/purchasedTime';
import { ChosenEquipment } from '../types/chosenEquipment';
import { EmptyDto } from 'src/commons/dto/empty.dto';
import { CreateReservationDto } from './createReservation.dto';
import { AppointmentDto } from 'src/appointments/dto/appointment.dto';
import { ReservationAdvancement } from '../types/reservationAdvancement';

export type ReservationDto = {
  id: number;

  // client: UserDto | EmptyDto;

  fullName: string;

  email: string;

  phoneNumber: string;

  purchasedTime: number;

  participants: number;

  ageOfParticipants: string;

  advancement: ReservationAdvancement;

  chosenEquipment: ChosenEquipment;

  additionalComments: string;

  insuranceInformation: string;

  appointments: AppointmentDto[] | EmptyDto[];

  lessonStatus: string;
};

export type ReservationBodyDto = {
  reservation: CreateReservationDto;

  filteredReservationAppoitmentsIds: number[];
};
