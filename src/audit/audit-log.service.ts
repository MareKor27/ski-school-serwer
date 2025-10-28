import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AuditLog } from './audit-log.model';
import { CreationAttributes } from 'sequelize';

@Injectable()
export class AuditService {
  constructor(@InjectModel(AuditLog) private auditModel: typeof AuditLog) {}

  async log(data: Partial<AuditLog>) {
    try {
      await this.auditModel.create(data as CreationAttributes<AuditLog>);
    } catch (err) {
      console.error('Audit log error:', err.message);
    }
  }
}
