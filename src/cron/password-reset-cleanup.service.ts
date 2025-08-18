import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/sequelize';
import { PasswordResetRequestModel } from 'src/auth/model/password-reset-request.model';
import { Op } from 'sequelize';

@Injectable()
export class PasswordResetCleanupService {
  private readonly logger = new Logger(PasswordResetCleanupService.name);

  constructor(
    @InjectModel(PasswordResetRequestModel)
    private readonly passwordResetModel: typeof PasswordResetRequestModel,
  ) {}

  @Cron(process.env.PASSWORD_RESET_CLEANUP_CRON || '0 0 4 * * *')
  async cleanupExpiredRequests() {
    this.logger.log('Czyszczenie wygasłych żądań resetu hasła...');
    const now = new Date();
    const deleted = await this.passwordResetModel.destroy({
      where: {
        exp: { [Op.lt]: now },
      },
    });
    this.logger.log(`Usunięto ${deleted} wygasłych rekordów.`);
  }
}
