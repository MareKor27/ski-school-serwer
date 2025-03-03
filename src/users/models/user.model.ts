import {
  Column,
  PrimaryKey,
  Model,
  Table,
  AutoIncrement,
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

  @Column
  name: string;

  @Column
  password: string;

  @Column
  email: string;

  @Column
  role: Role;
}

export type User = InferAttributes<UserModel>;
