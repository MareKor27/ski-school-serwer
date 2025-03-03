import {
  Column,
  PrimaryKey,
  Model,
  Table,
  AutoIncrement,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { InferAttributes, InferCreationAttributes } from 'sequelize';
import { UserModel } from 'src/users/models/user.model';
import { PurchasedTime } from '../types/purchasedTime';
import { ChosenEquipment } from '../types/chosenEquipment';

@Table({
  timestamps: true,
  tableName: 'Reservations',
})
export class ReservationModel extends Model<
  InferAttributes<ReservationModel>,
  InferCreationAttributes<ReservationModel, { omit: 'id' }>
> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  // @ForeignKey(() => UserModel)
  // @Column
  // clientId: number;

  @Column
  fullName: string;

  @Column
  email: string;

  @Column
  phoneNumber: string;

  @Column
  purchasedTime: PurchasedTime;

  @Column
  participants: number;

  @Column
  ageOfParticipants: string;

  @Column
  advancement: string;

  @Column
  chosenEquipment: ChosenEquipment;

  @Column
  additionalComments: string;

  @Column
  insuranceInformation: string;

  // @BelongsTo(() => UserModel)
  // client?: UserModel;
}

export type Reservation = InferAttributes<ReservationModel>;
