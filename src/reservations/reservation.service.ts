import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReservationDto } from './dto/createReservation.dto';
import { UpdateReservationDto } from './dto/updateReservation.dto';
import { ReservationModel } from './models/reservation.model';
import { InjectModel } from '@nestjs/sequelize';
import { AppointmentService } from 'src/appointments/appointment.service';
import { AppointmentModel } from 'src/appointments/models/appointment.model';

@Injectable()
export class ReservationService {
  constructor(
    @InjectModel(ReservationModel)
    private reservationModel: typeof ReservationModel,
    private appointmentService: AppointmentService,
  ) {}

  findOne(id: number) {
    return this.reservationModel.findOne({
      where: {
        id,
      },
    });
  }

  async findAll(
    page: number,
    size: number,
  ): Promise<[ReservationModel[], number]> {
    const limit = size;
    const offset = size * (page - 1);

    const result = await this.reservationModel.findAndCountAll({
      // where: whereConditions,
      limit,
      offset,
    });

    return [result.rows, result.count];
  }

  async createOne(
    createReservationDto: CreateReservationDto,
    appointmentId: number,
  ): Promise<ReservationModel> {
    const appointment =
      await this.appointmentService.findAppointmentById(appointmentId);
    if (!appointment) throw new Error('Appointment not found'); //TO DO

    const reservation =
      await this.reservationModel.create(createReservationDto);

    appointment.set('reservationId', reservation.id);
    await appointment.save();

    return reservation;
  }

  async updateOne(
    id: number,
    updateReservationDto: UpdateReservationDto,
  ): Promise<ReservationModel> {
    const [affectedCount, affectedRows] = await this.reservationModel.update(
      updateReservationDto,
      { where: { id }, returning: true, validate: true },
    );

    if (affectedCount === 0) {
      throw new Error(
        `Reservation with id ${id} was not found or no changes were made.`,
      );
    }

    return affectedRows[0];
  }

  async deleteOne(id: number): Promise<ReservationModel> {
    const appointment =
      await this.appointmentService.findAppointmentByReservationId(id);
    if (appointment) {
      await appointment.update({ reservationId: null });
    }

    const reservation = await this.findOne(id);
    if (!reservation) {
      throw new Error('Reservation not found');
    }

    await reservation.destroy();
    return reservation;
  }
}
