import { Controller, Get, Query } from '@nestjs/common';
import { AuditService } from './audit-log.service';
import { AuditLogDto } from './dto/audit-log.dto';
import { PaginationQueryDto } from 'src/commons/dto/paginationQueryDto.dto';
import { buildCollectionsResponseDto } from 'src/commons/dto/collectionsResponse.dto.mapper';
import { CollectionResponseDto } from 'src/commons/dto/collectionResponse.dto';

@Controller('auditlog')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get()
  async getAuditLogs(
    @Query() query: PaginationQueryDto,
  ): Promise<CollectionResponseDto<AuditLogDto>> {
    console.log('GET AUDIT');
    const [auditLogs, totalRows] = await this.auditService.findAllAudits(query);

    return buildCollectionsResponseDto(auditLogs, {
      page: query.page,
      size: query.size,
      totalRows,
    });
  }
}
