import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './commons/middleware/http-exception.filter';
import { BadRequestException, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:5173',
  });

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      // whitelist: true, // strips properties that don't exist in the DTO
      // forbidNonWhitelisted: true, // throws an error if unknown properties are present
      // transform: true, // auto-transform payloads to DTO instances
      exceptionFactory: (errors) => new BadRequestException(errors),
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
