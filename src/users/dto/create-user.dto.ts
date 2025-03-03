import {
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { Role, roles } from '../types/role';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  password: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsEnum(roles, { message: 'Valid role required' })
  role: Role;
}
