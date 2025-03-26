import { EmptyDto } from 'src/commons/dto/empty.dto';
import { ReservationDto } from 'src/reservations/dto/reservation.dto';

export class UpdateAppointmentDto {
  reservationId: number | null;
}
