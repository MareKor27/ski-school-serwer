import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ReservationModule } from './reservations/reservation.module';
import { AppointmentModule } from './appointments/appointment.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { CronModule } from './cron/cron.module';
import { AuditModule } from './audit/audit.module';

@Module({
  imports: [
    UsersModule,
    ReservationModule,
    AppointmentModule,
    AuthModule,
    CronModule,
    AuditModule,
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
      // sync: { alter: true },
    }),
  ],
})
export class AppModule {}
