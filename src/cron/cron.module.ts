import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { SequelizeModule } from '@nestjs/sequelize';
import { PasswordResetRequestModel } from 'src/auth/model/password-reset-request.model';
import { PasswordResetCleanupService } from './password-reset-cleanup.service';
import { ReservastionResetCleanupService } from './reservation-reset-cleanup.service';
import { BookingReservationModel } from 'src/auth/model/booking-confirmation.model';
import { AppointmentModel } from 'src/appointments/models/appointment.model';
import { ReservationModel } from 'src/reservations/models/reservation.model';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    SequelizeModule.forFeature([
      PasswordResetRequestModel,
      BookingReservationModel,
      AppointmentModel,
      ReservationModel,
    ]),
  ],
  providers: [PasswordResetCleanupService, ReservastionResetCleanupService],
})
export class CronModule {}
