import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { SequelizeModule } from '@nestjs/sequelize';
import { PasswordResetRequestModel } from 'src/auth/model/password-reset-request.model';
import { PasswordResetCleanupService } from './password-reset-cleanup.service';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    SequelizeModule.forFeature([PasswordResetRequestModel]),
  ],
  providers: [PasswordResetCleanupService],
})
export class CronModule {}
