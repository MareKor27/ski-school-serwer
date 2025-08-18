import { Module } from '@nestjs/common';
import { ReservationModel } from './models/reservation.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { ReservationController } from './reservation.controller';
import { ReservationService } from './reservation.service';
import { AppointmentModule } from 'src/appointments/appointment.module';
import { AppointmentModel } from 'src/appointments/models/appointment.model';
import { UserModel } from 'src/users/models/user.model';
import { BookingReservationModel } from 'src/auth/model/booking-confirmation.model';
import { AuthService } from 'src/auth/auth.service';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    SequelizeModule.forFeature([
      ReservationModel,
      AppointmentModel,
      UserModel,
      BookingReservationModel,
    ]),
    AppointmentModule,
    AuthModule,
  ],
  controllers: [ReservationController],
  providers: [ReservationService],
  exports: [ReservationService],
})
export class ReservationModule {}
