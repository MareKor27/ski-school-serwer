import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { UserData } from 'src/auth/type/auth';

export const Actor = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserData => {
    const request = ctx.switchToHttp().getRequest();
    return request.user; // Passport stores JWT payload here
  },
);
