import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const Actor = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user; // Passport stores JWT payload here
  },
);
