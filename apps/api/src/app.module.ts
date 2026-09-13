import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './modules/prisma/prisma.module';
import { HealthModule } from './modules/health/health.module';
import { AuthModule } from './modules/auth/auth.module';
import { EmailModule } from './modules/email/email.module';

@Module({
  imports: [
    // Load .env from project root
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../../.env',
    }),
    PrismaModule,
    HealthModule,
    EmailModule,
    AuthModule,
  ],
})
export class AppModule {}
