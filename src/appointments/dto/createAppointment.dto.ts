import { IsNotEmpty, IsNumber } from 'class-validator';
import { ReservationModel } from 'src/reservations/models/reservation.model';
import { UserModel } from 'src/users/models/user.model';

export class CreateAppointmentDto {
  appointmentDate: Date;
}
