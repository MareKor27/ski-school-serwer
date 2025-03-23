import {
  Column,
  PrimaryKey,
  Model,
  Table,
  AutoIncrement,
  ForeignKey,
  BelongsTo,
  Scopes,
  DataType,
} from 'sequelize-typescript';
import { InferAttributes, InferCreationAttributes } from 'sequelize';
import { UserModel } from 'src/users/models/user.model';
import { ReservationModel } from 'src/reservations/models/reservation.model';
import { scopes } from './appointments.model.scopes';

@Scopes(() => scopes)
@Table({
  timestamps: true,
  tableName: 'Appointments',
})
export class AppointmentModel extends Model<
  InferAttributes<AppointmentModel>,
  InferCreationAttributes<AppointmentModel, { omit: 'id' }>
> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @ForeignKey(() => UserModel)
  @Column
  instructorId: number;

  @ForeignKey(() => ReservationModel)
  @Column(DataType.INTEGER)
  reservationId: number | null;

  @Column({ type: DataType.DATE, allowNull: false })
  appointmentDate: Date;

  @BelongsTo(() => UserModel)
  instructor?: UserModel;

  @BelongsTo(() => ReservationModel)
  reservation?: ReservationModel;
}

export type Appointment = InferAttributes<AppointmentModel>;

// Object.entries(scopes).forEach(([name, options]) => {
//   AppointmentModel.addScope(name, options);
// });
