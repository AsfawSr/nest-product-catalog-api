import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module.js';
import { DomainExceptionFilter } from './common/filters/domain-exception.filter.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.useGlobalFilters(new DomainExceptionFilter());

  // Configure Swagger OpenAPI documentation
  const config = new DocumentBuilder()
    .setTitle('Product Catalog API')
    .setDescription(
      'Clean Architecture & Domain-Driven Design (DDD) REST API built with NestJS, TypeORM, and PostgreSQL.',
    )
    .setVersion('1.0')
    .addTag('products', 'Product catalog CRUD operations and queries')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    customSiteTitle: 'Product Catalog API Docs',
  });

  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
