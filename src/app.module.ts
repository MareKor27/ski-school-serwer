import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReservationService } from './reservation/reservation.service';
import { ReservationController } from './reservation/reservation.controller';
import { ReservationModule } from './reservation/reservation.module';
import { InstructorAvailabilityModule } from './instructor-availability/instructor-availability.module';

@Module({
  imports: [UsersModule, ReservationModule, InstructorAvailabilityModule],
  controllers: [AppController, ReservationController],
  providers: [AppService, ReservationService],
})
export class AppModule {}
