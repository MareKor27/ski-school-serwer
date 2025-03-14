export type PasswordResetRequestType = {
  id: number;
  userId: number;
  token: string;
  exp: Date;
};
