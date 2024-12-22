export const Role = {
  Client: 'CLIENT',
  Instructor: 'INSTRUCTOR',
  Admin: 'ADMIN',
} as const;

export type Role = (typeof Role)[keyof typeof Role];
export const roles = Object.values(Role);
