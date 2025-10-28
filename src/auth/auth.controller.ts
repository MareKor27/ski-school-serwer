import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ForgotPasswordDto,
  LoginDto,
  RegisterDto,
  ResetPasswordDto,
} from './dto/auth.dto';
import { Actor } from 'src/commons/provider/actor.decorator';
import { UserDto } from 'src/users/dto/user.dto';
import { UserData } from './type/auth';
import { AuthGuard } from '@nestjs/passport';
import { buildResponseDto } from 'src/commons/dto/response.dto.mapper';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
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
  async reservationVerification(@Param('token') token: string) {
    console.log('verification/:token');
    const reservation = await this.authService.checkReservation(token);

    return buildResponseDto(reservation);
  }
}
