import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './commons/middleware/http-exception.filter';
import { BadRequestException, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // służy do połączeń pomiędzy różnymi adresami w celu zabezpieczeń
  // app.enableCors({
  //   origin: process.env.WEBSITE_URL,
  // });

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      // whitelist: true, // strips properties that don't exist in the DTO
      // forbidNonWhitelisted: true, // throws an error if unknown properties are present
      transform: true, // auto-transform payloads to DTO instances
      exceptionFactory: (errors) => new BadRequestException(errors),
    }),
  );

  app.setGlobalPrefix('api');

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
