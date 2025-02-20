import { EmptyDto } from 'src/commons/dto/empty.dto';
import { ReservationDto } from 'src/reservations/dto/reservation.dto';
import { UserDto } from 'src/users/dto/user.dto';

export type AppointmentDto = {
  id: number;

  instructor: UserDto | EmptyDto;

  reservation: ReservationDto | EmptyDto | null;

  appointmentDate: Date;
};
