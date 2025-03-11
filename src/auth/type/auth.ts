import { Role } from 'src/users/types/role';

export type UserData = {
  id: number;
  email: string;
  role: Role;
};

export type LoginResponeType = {
  accessToken: string;
  payload: UserData;
};
