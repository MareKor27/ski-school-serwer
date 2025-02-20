import { mapUserToDto } from 'src/users/dto/user.dto.mapper';
import { Appointment } from '../models/appointment.model';
import { AppointmentDto } from './appointment.dto';
import { mapReservationToDto } from 'src/reservations/dto/reservation.dto.mapper';

export function mapAppointmentToDto(appointment: Appointment): AppointmentDto {
  console.log(typeof appointment.reservation);
  return {
    id: appointment.id,
    instructor: appointment.instructor
      ? mapUserToDto(appointment.instructor)
      : { id: appointment.instructorId },
    reservation: appointment.reservation
      ? mapReservationToDto(appointment.reservation)
      : { id: appointment.reservationId },
    appointmentDate: appointment.appointmentDate,
  };
}
