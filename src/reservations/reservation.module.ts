import { Module } from '@nestjs/common';
import { ReservationModel } from './models/reservation.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { ReservationController } from './reservation.controller';
import { ReservationService } from './reservation.service';

@Module({
  imports: [SequelizeModule.forFeature([ReservationModel])],
  controllers: [ReservationController],
  providers: [ReservationService],
})
export class ReservationModule {}
