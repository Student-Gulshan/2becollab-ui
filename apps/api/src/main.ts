import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // Cookie parser (must be before any route handlers)
  app.use(cookieParser());

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3000);
  const appUrl = configService.get<string>('APP_URL', 'http://localhost:5173');

  // Global prefix
  app.setGlobalPrefix('api/v1');

  // CORS
  app.enableCors({
    origin: appUrl,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  });

  // Global validation pipe
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

  // Global exception filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // Global response interceptor
  app.useGlobalInterceptors(new TransformInterceptor());

  await app.listen(port);
  logger.log(`🚀 2BeCollab API running on http://localhost:${port}/api/v1`);
  logger.log(`📖 Health check: http://localhost:${port}/api/v1/health`);
}

bootstrap();
