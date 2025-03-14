import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserData } from 'src/auth/type/auth';
import { roles } from 'src/users/types/role';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Pobiera token z nagłówka
      secretOrKey: 'SECRET_KEY', // Sekret do weryfikacji (zmienna środowiskowa w produkcji!)
    });
  }

  async validate(payload: UserData) {
    return { id: payload.id, email: payload.email, role: payload.role };
  }
}
