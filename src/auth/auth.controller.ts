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
import { Audit } from 'src/audit/audit-log.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @Audit('AUTH-LOGIN_TO_SYSTEM')
  async login(@Body() loginDto: LoginDto) {
    // await this.authService.log({
    //   action: 'UPDATE_ORDER_STATUS',
    //   userId: user.id,
    //   path: `/orders/${id}/status`,
    //   body: { from: oldStatus, to: newStatus },
    //   response: null,
    //   isError: false,
    //   message: `Status zmieniony z ${oldStatus} na ${newStatus}`,
    // });
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
