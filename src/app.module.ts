import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ReservationModule } from './reservations/reservation.module';
import { AppointmentModule } from './appointments/appointment.module';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [
    UsersModule,
    ReservationModule,
    AppointmentModule,
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'zaq1@WSX',
      database: 'michal2',
      synchronize: true,
      autoLoadModels: true,
    }),
  ],
})
export class AppModule {}
