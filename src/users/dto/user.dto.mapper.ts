import { User } from '../models/user.model';
import { UserDto } from './user.dto';

export function mapUserToDto(user: User): UserDto {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    iconColor: user.iconColor,
    status: user.status,
  };
}
