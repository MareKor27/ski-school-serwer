import {
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  MinLength,
} from 'class-validator';
import { Role, roles } from '../types/role';
import { Unique } from 'sequelize-typescript';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'name must be at least 8 characters long' })
  name: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsEnum(roles, { message: 'Valid role required' })
  role: Role;
}
