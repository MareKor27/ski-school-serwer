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
      include: [UserModel],
    });
  }

  async findAll(
    page: number,
    size: number,

    // filters: {
    // client?: UserModel;
    // purchasedTime?: string;
    // participants?: number;
    // advancement?: string;
    // chosenEquipment?: string;
    // }
  ): Promise<ReservationModel[]> {
    const limit = size;
    const offset = size * (page - 1);

    ////???? jak tutaj wyszukiwać po dacie ? i czy trzeba tutaj?
    // const whereConditions: any = {};

    // if (filters.client) {
    //   whereConditions.client = filters.client;
    // }

    // if (filters.purchasedTime) {
    //   whereConditions.purchasedTime = filters.purchasedTime;
    // }

    // if (filters.participants) {
    //   whereConditions.participants = { [Op.like]: `%${filters.participants}%` };
    // }

    // if (filters.advancement) {
    //   whereConditions.advancement = filters.advancement;
    // }

    // if (filters.chosenEquipment) {
    //   whereConditions.chosenEquipment = filters.chosenEquipment;
    // }

    return this.reservationModel.findAll({
      // where: whereConditions,
      limit,
      offset,
    });
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
        `User with id ${id} was not found or no changes were made.`,
      );
    }

    return affectedRows[0];
  }

  async deleteOne(id: number) {
    const reservation = await this.findOne(id);
    await reservation.destroy();
  }
}
