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
  tableName: 'PasswordResetRequests',
})
export class PasswordResetRequestModel extends Model<
  InferAttributes<PasswordResetRequestModel>,
  InferCreationAttributes<PasswordResetRequestModel, { omit: 'id' }>
> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Unique
  @Column({ allowNull: false })
  userId: number;

  @Unique
  @Column({ allowNull: false })
  token: string;

  @Column({ allowNull: false })
  exp: Date;
}

export type PasswordReset = InferAttributes<PasswordResetRequestModel>;
