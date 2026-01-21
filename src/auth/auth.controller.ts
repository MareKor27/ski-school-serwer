import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ForgotPasswordDto,
  LoginDto,
  RegisterDto,
  ResetPasswordDto,
} from './dto/auth.dto';
import { Actor } from 'src/commons/provider/actor.decorator';
import { UserData } from './type/auth';
import { AuthGuard } from '@nestjs/passport';
import { buildResponseDto } from 'src/commons/dto/response.dto.mapper';
import { Audit } from 'src/audit/audit-log.decorator';
import { RecaptchaService } from './recaptcha.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private recaptchaService: RecaptchaService,
  ) {}

  @Post('login')
  @Audit('AUTH-LOGIN_TO_SYSTEM')
  async login(@Body() loginDto: LoginDto) {
    await this.recaptchaService.verifyToken(loginDto.recaptchaToken, 'login');

    return this.authService.login(loginDto.email, loginDto.password);
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto.email, registerDto.name);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto.email);
  }

  @Post('reset-password')
  @Audit('AUTH-RESET-PASSWORD')
  async resetPassword(
    @Body()
    resetPasswordDto: ResetPasswordDto,
  ) {
    return this.authService.resetPassword(
      resetPasswordDto.password,
      resetPasswordDto.token,
    );
  }

  @Post('token')
  @UseGuards(AuthGuard('jwt'))
  async loginToken(@Actor() user: UserData) {
    return this.authService.createNewToken(user);
  }

  @Get('verification/:token')
  @Audit('AUTH-RESERVATION_VERYFICATION')
  async reservationVerification(@Param('token') token: string) {
    console.log('verification/:token');
    const reservation = await this.authService.checkReservation(token);

    return buildResponseDto(reservation);
  }
}
