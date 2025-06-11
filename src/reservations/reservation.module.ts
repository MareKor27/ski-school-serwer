import { Module } from '@nestjs/common';
import { ReservationModel } from './models/reservation.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { ReservationController } from './reservation.controller';
import { ReservationService } from './reservation.service';
import { AppointmentModule } from 'src/appointments/appointment.module';
import { AppointmentModel } from 'src/appointments/models/appointment.model';

@Module({
  imports: [
    SequelizeModule.forFeature([ReservationModel, AppointmentModel]),
    AppointmentModule,
  ],
  controllers: [ReservationController],
  providers: [ReservationService],
})
export class ReservationModule {}
