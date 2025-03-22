import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ReservationModule } from './reservations/reservation.module';
import { AppointmentModule } from './appointments/appointment.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    UsersModule,
    ReservationModule,
    AppointmentModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.DB_HOST,
      port: 5432,
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      synchronize: true,
      autoLoadModels: true,
    }),
  ],
})
export class AppModule {}
