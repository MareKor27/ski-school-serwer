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
  InferCreationAttributes<UserModel>
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
  phoneNumber: string;

  @Column
  role: Role;

  @Column
  informationOne: string;

  @Column
  informationTwo: string;

  @Column
  informationThree: string;
}

export type User = InferAttributes<UserModel>;
