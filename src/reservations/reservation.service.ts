import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateReservationDto } from './dto/createReservation.dto';
import { UpdateReservationDto } from './dto/updateReservation.dto';
import { ReservationModel } from './models/reservation.model';
import { InjectModel } from '@nestjs/sequelize';
import { AppointmentService } from 'src/appointments/appointment.service';
import { AppointmentModel } from 'src/appointments/models/appointment.model';
import { ReservationBodyDto } from './dto/reservation.dto';
import { UserData } from 'src/auth/type/auth';
import { Op, Sequelize } from 'sequelize';

const SERVER_OPTION_MAX_LESSON_TIME = 3;

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
    actor: UserData,
    page: number,
    size: number,
  ): Promise<[ReservationModel[], number]> {
    switch (actor.role) {
      case 'CLIENT':
        throw new ForbiddenException(`Role '${actor.role}' is not supported`);
      case 'INSTRUCTOR':
        return this.findReservationsForActor(actor, page, size);
      case 'ADMIN':
        return this.findAllReservations(page, size);
      default:
        throw new ForbiddenException(`Role '${actor.role}' is not supported`);
    }
  }

  async findReservationsForActor(
    actor: UserData,
    page: number,
    size: number,
  ): Promise<[ReservationModel[], number]> {
    const limit = size;
    const offset = size * (page - 1);

    const reservationsIds =
      await this.appointmentService.returnTableWithReservationIds(actor);

    if (!reservationsIds || reservationsIds.length === 0) {
      return [[], 0]!;
    }

    const result = await this.reservationModel.findAndCountAll({
      where: { id: { [Op.in]: reservationsIds } },
      limit,
      offset,
    });

    return [result.rows, result.count];
  }

  async findAllReservations(
    page: number,
    size: number,
  ): Promise<[ReservationModel[], number]> {
    const limit = size;
    const offset = size * (page - 1);

    const result = await this.reservationModel.findAndCountAll({
      limit,
      offset,
    });

    return [result.rows, result.count];
  }

  async createOne(
    reservationBodyDto: ReservationBodyDto,
  ): Promise<ReservationModel> {
    try {
      const appointmentsFromIds: Promise<AppointmentModel | null>[] =
        reservationBodyDto.filteredReservationAppoitmentsIds.map((id) =>
          this.appointmentService.findAppointmentById(id),
        );

      const appointments = await Promise.all(appointmentsFromIds);
      // console.log(appointments);

      const areAllAvailable = appointments.every(
        (appointment) => appointment && appointment.reservation == null,
      );

      if (!areAllAvailable) {
        throw new Error('One or more appointments are already reserved.');
      }

      const reservation = await this.reservationModel.create(
        reservationBodyDto.reservation,
      );

      for (const appointment of appointments) {
        if (appointment) {
          appointment.set('reservationId', reservation.id);
          await appointment.save();
        }
      }
      return reservation;
    } catch (error) {
      throw new Error('server error');
    }
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
    const reservation = await this.findOne(id);
    if (!reservation) {
      throw new Error('Reservation not found');
    }

    const appointments =
      await this.appointmentService.findAppointmentByReservationId(id);

    for (const appointment of appointments) {
      console.log(appointment.id);
      await appointment.update({ reservationId: null });
    }

    await reservation.destroy();
    return reservation;
  }
}
