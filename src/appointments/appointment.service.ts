import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/createAppointment.dto';
import { UpdateAppointmentDto } from './dto/updateAppointment.dto';
import { InjectModel } from '@nestjs/sequelize';
import { AppointmentModel } from './models/appointment.model';
import { Op, Sequelize, WhereOptions } from 'sequelize';
import { UserModel } from 'src/users/models/user.model';
import { ReservationModel } from 'src/reservations/models/reservation.model';
import { AppointmentScope } from './models/appointments.model.scopes';
import { Role } from 'src/users/types/role';
import { UserData } from 'src/auth/type/auth';
import { UserDto } from 'src/users/dto/user.dto';
import { AppointmentRequestBody } from './dto/appointmentRequestBody.dto';
import { DateTime } from 'luxon';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectModel(AppointmentModel)
    private appointmentModel: typeof AppointmentModel,

    private userService: UsersService,
  ) {}

  findAppointmentById(id: number): Promise<AppointmentModel | null> {
    return this.appointmentModel.scope(AppointmentScope.Populated).findOne({
      where: {
        id,
      },
    });
  }

  findAppointmentByReservationId(
    reservationId: number,
  ): Promise<AppointmentModel[]> {
    return this.appointmentModel.scope(AppointmentScope.Populated).findAll({
      where: {
        reservationId,
      },
    });
  }

  async findAppointmentsForReservation(
    reservationtDate: Date,
    hours: number,
  ): Promise<AppointmentModel[]> {
    const data1 = new Date(reservationtDate);
    const data2 = new Date(
      reservationtDate.setHours(reservationtDate.getHours() + hours),
    );

    const allAppointments = await this.appointmentModel
      .scope(AppointmentScope.Populated)
      .findAll({
        where: {
          reservationId: { [Op.is]: null },
          appointmentDate: {
            [Op.gte]: data1,
            [Op.lte]: data2,
          },
        },
        order: [
          ['instructorId', 'ASC'],
          ['appointmentDate', 'ASC'],
        ],
      });

    const result: AppointmentModel[] = [];
    const groupedByInstructor = new Map<number, AppointmentModel[]>();
    const instructorsWithStartDate = new Set<number>();

    for (const appt of allAppointments) {
      if (appt.appointmentDate.getTime() === data1.getTime()) {
        instructorsWithStartDate.add(appt.instructorId);
      }
    }

    for (const appt of allAppointments) {
      if (!instructorsWithStartDate.has(appt.instructorId)) {
        continue; // pomiń instruktorów bez wizyty o data1
      }

      const group = groupedByInstructor.get(appt.instructorId) || [];
      group.push(appt);
      groupedByInstructor.set(appt.instructorId, group);
    }

    for (const appointments of groupedByInstructor.values()) {
      let i = 0;
      let pickedHour = 0;
      for (const appt of appointments) {
        if (i == 0) {
          pickedHour = appt.appointmentDate.getHours();
        }

        if (appt.appointmentDate.getHours() == pickedHour) {
          result.push(appt);
        } else {
          break; // przerywamy dalsze dla tego instruktora
        }
        if (i == hours - 1) {
          break; // osiągnięto wymaganą liczbę godzin
        }
        i++, pickedHour++;
      }
    }

    return result;
  }

  async returnTableWithReservationIds(id: number) {
    const whereClause: WhereOptions = {
      reservationId: {
        [Op.ne]: null,
      },
    };

    whereClause.instructorId = id;

    const tableWithReservation = await this.appointmentModel.findAll({
      attributes: [
        [
          Sequelize.fn('DISTINCT', Sequelize.col('reservationId')),
          'reservationId',
        ],
      ],
      where: whereClause,
      raw: true,
    });

    const tableReservationIds = tableWithReservation.map(
      (item) => item.reservationId!,
    );

    return tableReservationIds;
  }

  async findAppointmentsBetweenDates(
    startDate: Date,
    endDate: Date,
    filters?: { instructorId?: number },
  ): Promise<AppointmentModel[]> {
    const whereConditions = {
      appointmentDate: { [Op.gte]: startDate, [Op.lte]: endDate },
      ...(filters?.instructorId && { instructorId: filters.instructorId }),
      // reservationId: null,
    };

    const result = await this.appointmentModel
      .scope(AppointmentScope.Populated)
      .findAll({
        where: whereConditions,
        include: [
          {
            model: UserModel,
            as: 'instructor',
            where: { status: { [Op.ne]: 'INACTIVE' } },
            required: true,
          },
        ],
      });

    return result;
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

  async findOneByUserAndDate(userId: number, data: Date) {
    const appointment = await this.appointmentModel.findOne({
      where: {
        reservationId: { [Op.is]: null },
        appointmentDate: {
          [Op.eq]: data,
        },
        instructorId: { [Op.eq]: userId },
      },
    });
    return appointment;
  }

  async createAppointment(
    instructorId: number,
    appointmentDate: Date,
  ): Promise<AppointmentModel> {
    const checkedAppointment = await this.findOneByUserAndDate(
      instructorId,
      appointmentDate,
    );
    if (checkedAppointment != null) return checkedAppointment;

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

  async createFewAppointmentsOnOneDay(
    requestBody: AppointmentRequestBody,
    user: UserDto,
    userId: number,
  ) {
    const timeZone = 'Europe/Warsaw';

    console.log(requestBody);
    console.log(user);
    console.log(userId);

    const affectedUserId = user.id == userId ? user.id : userId;

    const chosenDate = new Date(requestBody.chosenDate);
    console.log(chosenDate, user);

    if (requestBody.checked) {
      console.log('tworzymy w tym dniu');

      // POWINIENEM TWORZYĆ JEDEN OBIEKT Z DANYMI NIŻ W PĘTLI TWORZYĆ KILKA
      for (let hour = 10; hour < 20; hour++) {
        const appointmentDate = new Date(chosenDate);
        // appointmentDate.setUTCHours(hour);
        // console.log(appointmentDate);
        const localDate: DateTime = DateTime.fromObject(
          {
            year: chosenDate.getFullYear(),
            month: chosenDate.getMonth() + 1,
            day: chosenDate.getDate(),
            hour,
          },
          { zone: timeZone },
        );
        console.log(localDate.toJSDate());
        await this.createAppointment(affectedUserId, localDate.toJSDate());
      }
    } else {
      console.log('usuwamy w tym dniu');
      //USUWANIE
      for (let hour = 10; hour < 20; hour++) {
        // const appointmentDate = new Date(chosenDate);
        // appointmentDate.setHours(hour);

        const localDate = DateTime.fromObject(
          {
            year: chosenDate.getFullYear(),
            month: chosenDate.getMonth() + 1,
            day: chosenDate.getDate(),
            hour,
          },
          { zone: timeZone },
        );
        console.log(localDate.toJSDate());
        await this.deleteOneByDateAndUser(affectedUserId, localDate.toJSDate());
      }
    }
    return this.userService.findOneUser(userId);
  }

  async deleteOne(id: number): Promise<AppointmentModel> {
    const appointment = await this.findAppointmentById(id);
    if (!appointment) {
      throw new Error('Appointment not found');
    }
    await appointment.destroy();
    return appointment;
  }

  async deleteOneByDateAndUser(
    userId: number,
    data: Date,
  ): Promise<AppointmentModel | null> {
    const appointment = await this.findOneByUserAndDate(userId, data);
    if (!appointment || null) {
      throw new Error('Appointment not found');
    }
    await appointment.destroy();
    return appointment;
  }
}
