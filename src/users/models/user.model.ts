import {
  Column,
  PrimaryKey,
  Model,
  Table,
  AutoIncrement,
  Unique,
} from 'sequelize-typescript';
import { Role } from '../types/role';
import { InferAttributes, InferCreationAttributes } from 'sequelize';

@Table({
  timestamps: true,
  tableName: 'Users',
})
export class UserModel extends Model<
  InferAttributes<UserModel>,
  InferCreationAttributes<UserModel, { omit: 'id' }>
> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column({ allowNull: false })
  name: string;

  @Column({ allowNull: false })
  password: string;

  @Unique
  @Column({ allowNull: false })
  email: string;

  @Column
  role: Role;
}

export type User = InferAttributes<UserModel>;
