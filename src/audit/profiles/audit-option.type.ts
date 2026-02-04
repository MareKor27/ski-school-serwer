import { AuditEvent } from './audit-body-profile.enum';

export interface AuditEventConfig {
  action: string;
  bodyMapper: (body: any) => any;
  responseMapper?: (response: any) => any;
  errorMapper?: (error: any) => any;
}
