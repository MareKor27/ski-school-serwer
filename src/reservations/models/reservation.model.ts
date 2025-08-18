import {
  Column,
  PrimaryKey,
  Model,
  Table,
  AutoIncrement,
  ForeignKey,
  BelongsTo,
  HasMany,
  DataType,
} from 'sequelize-typescript';
import { InferAttributes, InferCreationAttributes } from 'sequelize';
import { UserModel } from 'src/users/models/user.model';
import { PurchasedTime } from '../types/purchasedTime';
import { ChosenEquipment } from '../types/chosenEquipment';
import { AppointmentModel } from 'src/appointments/models/appointment.model';
import { ReservationAdvancement } from '../types/reservationAdvancement';
import { LessonStatus } from '../types/lessonStatus';

@Table({
  timestamps: true,
  tableName: 'Reservations',
})
export class ReservationModel extends Model<
  InferAttributes<ReservationModel>,
  InferCreationAttributes<ReservationModel, { omit: 'id' | 'appointments' }>
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
  purchasedTime: number;

  @Column
  participants: number;

  @Column
  ageOfParticipants: string;

  @Column
  advancement: ReservationAdvancement;

  @Column
  chosenEquipment: ChosenEquipment;

  @Column
  additionalComments: string;

  @Column
  insuranceInformation: string;

  @Column({
    allowNull: false,
    defaultValue: 'reserved',
  })
  lessonStatus: LessonStatus;

  @HasMany(() => AppointmentModel)
  appointments: AppointmentModel[];

  // @BelongsTo(() => UserModel)
  // client?: UserModel;
}

export type Reservation = InferAttributes<ReservationModel>;
