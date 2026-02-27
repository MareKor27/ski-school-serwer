import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuditLogModel } from './audit-log.model';
import { AuditService } from './audit-log.service';
import { AuditInterceptor } from './audit.interceptor';
import { AuditController } from './audit-log.controller';

@Module({
  controllers: [AuditController],
  imports: [SequelizeModule.forFeature([AuditLogModel])],
  providers: [AuditService, AuditInterceptor],
  exports: [AuditService, AuditInterceptor],
})
export class AuditModule {}
