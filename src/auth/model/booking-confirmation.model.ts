import {
  Column,
  PrimaryKey,
  Model,
  Table,
  AutoIncrement,
  Unique,
} from 'sequelize-typescript';
import { InferAttributes, InferCreationAttributes } from 'sequelize';

@Table({
  timestamps: true,
  tableName: 'BookingReservation',
})
export class BookingReservationModel extends Model<
  InferAttributes<BookingReservationModel>,
  InferCreationAttributes<BookingReservationModel, { omit: 'id' }>
> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Unique
  @Column({ allowNull: false })
  reservationId: number;

  @Unique
  @Column({ allowNull: false })
  token: string;

  @Column({ allowNull: false })
  exp: Date;
}

export type BookingReservation = InferAttributes<BookingReservationModel>;
