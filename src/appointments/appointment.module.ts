import { Module } from '@nestjs/common';
import { AppointmentController } from './appointment.controller';
import { AppointmentService } from './appointment.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { AppointmentModel } from './models/appointment.model';

@Module({
  imports: [SequelizeModule.forFeature([AppointmentModel])],
  controllers: [AppointmentController],
  providers: [AppointmentService],
})
export class AppointmentModule {}
