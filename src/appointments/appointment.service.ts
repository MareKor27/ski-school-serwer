import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/createAppointment.dto';
import { UpdateAppointmentDto } from './dto/updateAppointment.dto';
import { InjectModel } from '@nestjs/sequelize';
import { AppointmentModel } from './models/appointment.model';
import { Op, Sequelize } from 'sequelize';
import { UserModel } from 'src/users/models/user.model';
import { ReservationModel } from 'src/reservations/models/reservation.model';
import { AppointmentScope } from './models/appointments.model.scopes';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectModel(AppointmentModel)
    private appointmentModel: typeof AppointmentModel,
  ) {}

  findAppointmentById(id: number): Promise<AppointmentModel | null> {
    return this.appointmentModel.scope(AppointmentScope.Populated).findOne({
      where: {
        id,
      },
    });
  }

  async findAppointmentsBetweenDates(
    startDate: Date,
    endDate: Date,
  ): Promise<AppointmentModel[]> {
    const result = await this.appointmentModel.findAndCountAll({
      where: { appointmentDate: { [Op.gte]: startDate, [Op.lte]: endDate } },
    });
    return result.rows;
  }

  async findAll(
    filters: {
      idInstructor?: number;
      appointmentDate?: Date;
      available?: boolean;
    },
    page: number,
    size: number,
  ): Promise<[AppointmentModel[], number]> {
    const limit = size;
    const offset = size * (page - 1);
    const whereConditions: any = {};

    if (filters.idInstructor) {
      whereConditions.instructor = filters.idInstructor;
    }

    if (filters.appointmentDate) {
      const dateConditions: any = {};
      whereConditions.availabilityDate = dateConditions;
    }

    if (filters.available) {
      whereConditions.available = filters.available;
    }
    const result = await this.appointmentModel
      .scope(AppointmentScope.Populated)
      .findAndCountAll({
        where: whereConditions,
        limit,
        offset,
      });
    return [result.rows, result.count];
  }

  createAppointment(
    instructorId: number,
    appointmentDate: Date,
  ): Promise<AppointmentModel> {
    return this.appointmentModel.create({ instructorId, appointmentDate });
  }

  async updateOne(
    id: number,
    updateAppointmentDto: UpdateAppointmentDto,
  ): Promise<AppointmentModel> {
    const [affectedCount, affectedRows] = await this.appointmentModel.update(
      updateAppointmentDto,
      {
        where: { id },
        returning: true,
        validate: true,
      },
    );

    if (affectedCount === 0) {
      throw new Error(
        `Appointment with id ${id} was not found or no changes were made.`,
      );
    }

    return affectedRows[0];
  }

  async deleteOne(id: number): Promise<AppointmentModel> {
    const appointment = await this.findAppointmentById(id);
    if (!appointment) {
      throw new Error('Appointment not found');
    }
    await appointment.destroy();
    return appointment;
  }
}
