import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from 'src/commons/middleware/jwt-strategy';
import { PasswordResetRequestModel } from './model/password-reset-request.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { BookingReservationModel } from './model/booking-confirmation.model';
import { UsersService } from 'src/users/users.service';
import { ReservationService } from 'src/reservations/reservation.service';
import { ReservationModule } from 'src/reservations/reservation.module';
import { RecaptchaService } from './recaptcha.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    SequelizeModule.forFeature([
      PasswordResetRequestModel,
      BookingReservationModel,
    ]),
    UsersModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '15m' },
    }),
    ScheduleModule.forRoot(),
    forwardRef(() => ReservationModule),
  ],
  providers: [AuthService, JwtStrategy, RecaptchaService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
