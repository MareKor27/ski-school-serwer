import { Reservation } from '../models/reservation.model';
import { ReservationDto } from './reservation.dto';
import { mapAppointmentToDto } from 'src/appointments/dto/appointment.dto.mapper';

type Options = {
  include?: {
    appointments?: boolean;
  };
};

export function mapReservationToDto(
  reservation: Reservation,
  options: Options = {},
): ReservationDto {
  const isAppointmentsIncluded = options.include?.appointments ?? true;

  return {
    id: reservation.id,
    // client: reservation.client
    //   ? mapUserToDto(reservation.client)
    //   : { id: reservation.clientId },
    fullName: reservation.fullName,
    email: reservation.email,
    phoneNumber: reservation.phoneNumber,
    purchasedTime: reservation.purchasedTime,
    participants: reservation.participants,
    ageOfParticipants: reservation.ageOfParticipants,
    advancement: reservation.advancement,
    chosenEquipment: reservation.chosenEquipment,
    additionalComments: reservation.additionalComments,
    insuranceInformation: reservation.insuranceInformation,
    appointments: reservation.appointments?.map((appointment) =>
      isAppointmentsIncluded
        ? mapAppointmentToDto(appointment, { include: { reservation: false } })
        : { id: appointment.id },
    ),
    lessonStatus: reservation.lessonStatus,
    reservationToken: reservation.tokenReservation,
  };
}
