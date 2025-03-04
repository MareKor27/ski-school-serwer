import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReservationDto } from './dto/createReservation.dto';
import { UpdateReservationDto } from './dto/updateReservation.dto';
import { ReservationModel } from './models/reservation.model';
import { InjectModel } from '@nestjs/sequelize';
import { UserModel } from 'src/users/models/user.model';
import { PurchasedTime } from './types/purchasedTime';
import { ChosenEquipment } from './types/chosenEquipment';
import { Op } from 'sequelize';

@Injectable()
export class ReservationService {
  constructor(
    @InjectModel(ReservationModel)
    private reservationModel: typeof ReservationModel,
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

  createOne(
    createReservationDto: CreateReservationDto,
  ): Promise<ReservationModel> {
    return this.reservationModel.create(createReservationDto);
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
    await reservation.destroy();
    return reservation;
  }
}
