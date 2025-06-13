import { mapUserToDto } from 'src/users/dto/user.dto.mapper';
import { Appointment } from '../models/appointment.model';
import { AppointmentDto } from './appointment.dto';
import { mapReservationToDto } from 'src/reservations/dto/reservation.dto.mapper';

type Options = {
  include?: {
    reservation?: boolean;
    instructor?: boolean;
  };
};

export function mapAppointmentToDto(
  appointment: Appointment,
  options: Options = {},
): AppointmentDto {
  const isReservationIncluded = options.include?.reservation ?? true; //opcje
  const isInstructorIncluded = options.include?.instructor ?? true; //opcje

  // console.log('appointment:', appointment);
  // console.log('appointment.reservation:', appointment.reservation);
  // console.log(
  //   'appointment.reservation && isReservationIncluded:',
  //   appointment.reservation && isReservationIncluded,
  // );
  // console.log(
  //   appointment.reservation && isReservationIncluded
  //     ? mapReservationToDto(appointment.reservation, {
  //         include: { appointments: false },
  //       })
  //     : appointment.reservationId
  //       ? { id: appointment.reservationId }
  //       : null,
  // ); //opcje)

  return {
    id: appointment.id,
    //instructor: appointment.instructor ? mapUserToDto(appointment.instructor): { id: appointment.instructorId }, // bez opcji
    instructor:
      appointment.instructor && isInstructorIncluded
        ? mapUserToDto(appointment.instructor)
        : { id: appointment.instructorId }, //opcje
    //reservation: appointment.reservation? mapReservationToDto(appointment.reservation): appointment.reservationId? { id: appointment.reservationId }: null, // bez opcji
    reservation:
      appointment.reservation && isReservationIncluded
        ? mapReservationToDto(appointment.reservation, {
            include: { appointments: false },
          })
        : appointment.reservationId
          ? { id: appointment.reservationId }
          : null, //opcje
    appointmentDate: appointment.appointmentDate,
  };
}
