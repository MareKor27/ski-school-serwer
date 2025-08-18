import {
  Column,
  PrimaryKey,
  Model,
  Table,
  AutoIncrement,
  Unique,
} from 'sequelize-typescript';
import { Role } from '../types/role';
import { DataTypes, InferAttributes, InferCreationAttributes } from 'sequelize';

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

  @Column({
    allowNull: false,
  })
  email: string;

  @Column
  role: Role;

  @Column
  iconColor: string;

  //'CREATED', 'ACTIVE', 'PASSWORD_RESET', 'INACTIVE'
  @Column({
    allowNull: false,
    defaultValue: 'CREATED',
  })
  status: string;
}

export type User = InferAttributes<UserModel>;
