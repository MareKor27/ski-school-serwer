import { ReservationModel } from 'src/reservations/models/reservation.model';
import { UserModel } from 'src/users/models/user.model';

export const AppointmentScope = {
  Populated: 'populated',
  Test: 'test',
} as const;

export const appointmentScopes = Object.values(AppointmentScope);

export const scopes = {
  [AppointmentScope.Populated]: {
    include: [
      {
        model: UserModel,
        as: 'instructor',
      },
      {
        model: ReservationModel,
        as: 'reservation',
        include: [
          {
            model: UserModel,
            as: 'client',
          },
        ],
      },
    ],
  },
  [AppointmentScope.Test]: {
    include: [
      {
        model: UserModel,
        as: 'instructor',
      },
    ],
  },
};
