import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserModel } from './models/user.model';
import { AppointmentModel } from 'src/appointments/models/appointment.model';

@Module({
  imports: [SequelizeModule.forFeature([UserModel, AppointmentModel])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
