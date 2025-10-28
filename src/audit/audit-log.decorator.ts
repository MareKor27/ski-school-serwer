import { SetMetadata } from '@nestjs/common';

export const AUDIT_KEY = 'auditAction';
export const Audit = (action: string) => SetMetadata(AUDIT_KEY, action);
