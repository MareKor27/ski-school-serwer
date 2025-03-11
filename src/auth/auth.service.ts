import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { LoginResponeType, UserData } from './type/auth';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.validateUser(email, password);
    if (!user) throw new UnauthorizedException();
    return user;
  }

  async login(email: string, password: string): Promise<LoginResponeType> {
    const user = await this.validateUser(email, password);
    const payload: UserData = {
      id: user.id,
      email: user.email,
      role: user.role,
    };
    return {
      accessToken: this.jwtService.sign(payload),
      payload,
    };
  }

  //   async register(email: string, password: string) {
  //     const user = await this.userService.createUser(email, password);
  //     return { message: 'User registered successfully', user };
  //   }
}
