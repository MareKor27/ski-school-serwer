import { User } from '../models/user.model';
import { UserDto } from './user.dto';

export function mapUserToDto(user: User): UserDto {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phoneNumber: user.phoneNumber,
    informationOne: user.informationOne,
    informationTwo: user.informationTwo,
    informationThree: user.informationThree,
  };
}
