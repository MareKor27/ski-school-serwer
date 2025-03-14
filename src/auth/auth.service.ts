import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { LoginResponeType, UserData } from './type/auth';
import * as bcrypt from 'bcrypt';
import * as nodemailer from 'nodemailer';
import { PasswordResetRequestModel } from './model/password-reset-equest.model';
import { InjectModel } from '@nestjs/sequelize';
import { PasswordResetRequestType } from './type/password-reset-equest';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    @InjectModel(PasswordResetRequestModel)
    private passwordResetRequest: typeof PasswordResetRequestModel,
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

  async createPasswordResetRequest(userId: number, email: string) {
    const token = crypto.randomBytes(16).toString('base64');
    const date = new Date();
    date.setMinutes(date.getMinutes() + 30);
    await this.passwordResetRequest.create({ userId, token, exp: date });
    await this.sendEmail(email, token);
  }

  async register(email: string, name: string) {
    const randomPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(randomPassword, 10);
    const user = await this.userService.create({
      email,
      password: hashedPassword,
      name,
      role: 'INSTRUCTOR',
    });
    this.createPasswordResetRequest(user.id, email);
    return { message: 'User registered successfully', user };
  }

  async sendEmail(email: string, token: string) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const url = `http://localhost:5173/reset-password/${token}`;

    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: email,
      subject: 'Ustaw swoje hasło',
      html: `<p>Kliknij poniższy link, aby ustawić hasło:</p><a href="${url}">Ustaw hasło</a>`,
    });
  }
}
