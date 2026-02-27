import { Module } from '@nestjs/common';
import { AppointmentController } from './appointment.controller';
import { AppointmentService } from './appointment.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { AppointmentModel } from './models/appointment.model';
import { UserModel } from 'src/users/models/user.model';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [SequelizeModule.forFeature([AppointmentModel]), UsersModule],
  controllers: [AppointmentController],
  providers: [AppointmentService],
  exports: [AppointmentService],
})
export class AppointmentModule {}
