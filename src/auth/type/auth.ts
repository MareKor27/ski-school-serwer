import { Role } from 'src/users/types/role';

export type UserData = {
  id: number;
  email: string;
  role: Role;
};

export type LoginResponeType = {
  accessToken: string;
  user: UserData;
  expirationDate: Date;
};

export type JWTFields = {
  iat: number; // data utworzenia
  exp: number; // data ważności
};

export type AccessToken = UserData & JWTFields;
