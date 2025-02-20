import { mapUserToDto } from 'src/users/dto/user.dto.mapper';
import { Reservation } from '../models/reservation.model';
import { ReservationDto } from './reservation.dto';

export function mapReservationToDto(reservation: Reservation): ReservationDto {
  return {
    id: reservation.id,
    client: reservation.client
      ? mapUserToDto(reservation.client)
      : { id: reservation.clientId },
    purchasedTime: reservation.purchasedTime,
    participants: reservation.participants,
    ageOfParticipants: reservation.ageOfParticipants,
    advancement: reservation.advancement,
    chosenEquipment: reservation.chosenEquipment,
    additionalComments: reservation.additionalComments,
    insuranceInformation: reservation.insuranceInformation,
  };
}
