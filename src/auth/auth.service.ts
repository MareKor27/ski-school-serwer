import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { AccessToken, LoginResponeType, UserData } from './type/auth';
import * as bcrypt from 'bcrypt';
import * as nodemailer from 'nodemailer';
import { PasswordResetRequestModel } from './model/password-reset-request.model';
import { InjectModel } from '@nestjs/sequelize';
import { Op, UniqueConstraintError } from 'sequelize';
import * as crypto from 'crypto';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { ErrorResponseDto } from 'src/commons/dto/error-response.dto';

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
    const accessToken = this.jwtService.sign(payload);
    const decoded: AccessToken = this.jwtService.decode(accessToken);

    return {
      accessToken,
      user: payload,
      expirationDate: new Date(decoded.exp * 1000),
    };
  }
  async createNewToken(payload: UserData): Promise<LoginResponeType> {
    const accessToken = this.jwtService.sign(payload);
    const decoded: AccessToken = this.jwtService.decode(accessToken);

    return {
      accessToken: this.jwtService.sign(payload),
      user: payload,
      expirationDate: new Date(decoded.exp * 1000),
    };
  }

  async createPasswordResetRequest(userId: number, email: string) {
    const token = crypto.randomBytes(16).toString('base64url');
    const date = new Date();
    date.setMinutes(date.getMinutes() + 30);
    await this.passwordResetRequest.create({ userId, token, exp: date });
    await this.sendEmail(email, token);
  }

  async register(email: string, name: string) {
    const isUser = await this.userService.findByEmail(email);

    if (isUser) {
      throw new HttpException(
        {
          message: [
            {
              property: 'email',
              constraints: {
                isEmail: 'Ten email już jest używany',
              },
            },
          ],
        },
        HttpStatus.CONFLICT,
      );
    }

    const randomPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(randomPassword, 10);

    let user;
    try {
      user = await this.userService.create({
        email,
        password: hashedPassword,
        name,
        role: 'INSTRUCTOR',
        iconColor: '',
      });
    } catch (error) {
      throw error;
    }
    this.createPasswordResetRequest(user.id, email);
    return { message: 'User registered successfully', user };
  }

  async forgotPassword(email: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) return;
    this.createPasswordResetRequest(user.id, email);
  }

  async sendEmail(email: string, token: string) {
    console.log('poszło');
    // const transporter = nodemailer.createTransport({
    //   host: 'smtp.gmail.com',
    //   port: 465,
    //   secure: true,
    //   auth: {
    //     user: process.env.MAIL_USER,
    //     pass: process.env.MAIL_PASS,
    //   },
    // });

    // const url = `http://localhost:5173/administrator/zmien-haslo/${token}`;

    // await transporter.sendMail({
    //   from: process.env.MAIL_USER,
    //   to: email,
    //   subject: 'FigowskiSport - Ustaw swoje hasło',
    //   html: `<h1>Witaj!</h1><h2>Zostało stworzone konto Instruktora</h2><p>Kliknij poniższy link, aby ustawić hasło:</p><a href="${url}">${url}</a>`,
    // });
  }

  async resetPassword(newPassword: string, token: string) {
    const responseToken = await this.passwordResetRequest.findOne({
      where: { token, exp: { [Op.gt]: new Date() } },
    });
    //if response null błąd i return
    if (responseToken) {
      const userId = responseToken?.userId;
      const responseUser = await this.userService.findOneUser(userId);
      if (responseUser) {
        const newHashPassword = await bcrypt.hash(newPassword, 10);
        const userWithNewPassword: UpdateUserDto = {
          name: responseUser.name,
          password: newHashPassword,
          email: responseUser.email,
          role: responseUser.role,
        };
        await this.userService.updateOne(userId, userWithNewPassword);
        await responseToken.destroy();
      }
    }
  }
}
