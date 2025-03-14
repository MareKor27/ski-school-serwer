import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );
    if (!requiredRoles) {
      return true; // Jeśli brak wymagań, dostęp jest otwarty
    }

    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.includes(user.role); // Sprawdzamy, czy użytkownik ma odpowiednią rolę
  }
}

///-------------------------------------------

import { SetMetadata } from '@nestjs/common';

export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
