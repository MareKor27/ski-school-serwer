import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { AuditService } from './audit-log.service';
import { Reflector } from '@nestjs/core';
import { AUDIT_KEY } from './audit-log.decorator';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(
    private readonly auditService: AuditService,
    private readonly reflector: Reflector,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const handler = context.getHandler();
    const action = this.reflector.get<string>(AUDIT_KEY, handler);

    if (!action) return next.handle(); // brak dekoratora -> nie logujemy

    const req = context.switchToHttp().getRequest();
    const user = req.user; // JWT lub inny mechanizm uwierzytelniania
    const { method, originalUrl: path, body } = req;

    return next.handle().pipe(
      tap(async (response) => {
        await this.auditService.log({
          action,
          method,
          path,
          userId: user?.id ?? null,
          body,
          response,
          isError: false,
        });
      }),
      catchError(async (err) => {
        await this.auditService.log({
          action,
          method,
          path,
          userId: user?.id ?? null,
          body,
          response: { error: err.message },
          isError: true,
        });
        throw err;
      }),
    );
  }
}
