import {
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { Role, roles } from '../types/role';
import { Transform, Type } from 'class-transformer';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  nameSurname: string;

  password: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsPhoneNumber('PL')
  @IsNotEmpty()
  phoneNumber: string;

  @IsNotEmpty()
  @IsEnum(roles, { message: 'Valid role required' })
  role: Role;

  @IsString()
  informationOne: string;

  @IsString()
  informationTwo: string;

  @IsString()
  informationThree: string;

  createAt: Date;

  updateAt?: Date;
}
