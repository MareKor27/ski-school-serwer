import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AuditLogModel } from './audit-log.model';
import { CreationAttributes } from 'sequelize';
import { CollectionResponseDto } from 'src/commons/dto/collectionResponse.dto';
import { PaginationQueryDto } from 'src/commons/dto/paginationQueryDto.dto';

@Injectable()
export class AuditService {
  constructor(
    @InjectModel(AuditLogModel) private auditModel: typeof AuditLogModel,
  ) {}

  async log(data: Partial<AuditLogModel>) {
    try {
      await this.auditModel.create(data as CreationAttributes<AuditLogModel>);
    } catch (err) {
      console.error('Audit log error:', err.message);
    }
  }

  async findAllAudits(
    query: PaginationQueryDto,
  ): Promise<[AuditLogModel[], number]> {
    const { page, size, filter, sort } = query;
    const limit = size;
    const offset = size * (page - 1);

    const result = await this.auditModel.findAndCountAll({
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    });
    console.log(result.count);
    return [result.rows, result.count];
  }
}
