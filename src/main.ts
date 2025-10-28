import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './commons/middleware/http-exception.filter';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { AuditService } from './audit/audit-log.service';
import { AuditInterceptor } from './audit/audit.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const reflector = app.get(Reflector);
  const auditService = app.get(AuditService);

  //służy do połączeń pomiędzy różnymi adresami w celu zabezpieczeń
  app.enableCors({
    origin: process.env.WEBSITE_URL,
  });

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      // whitelist: true, // strips properties that don't exist in the DTO
      // forbidNonWhitelisted: true, // throws an error if unknown properties are present
      transform: true, // auto-transform payloads to DTO instances
      exceptionFactory: (errors) => new BadRequestException(errors),
    }),
  );
  app.useGlobalInterceptors(new AuditInterceptor(auditService, reflector));

  if (process.env.ROOT_PATH) {
    app.setGlobalPrefix(process.env.ROOT_PATH);
  }

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
