import { SetMetadata } from '@nestjs/common';
import { AuditEvent } from './profiles/audit-body-profile.enum';

export const AUDIT_KEY = 'auditAction';

export const Audit = (options: AuditEvent) => SetMetadata(AUDIT_KEY, options);
