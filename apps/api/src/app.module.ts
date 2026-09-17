import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './modules/prisma/prisma.module';
import { HealthModule } from './modules/health/health.module';
import { AuthModule } from './modules/auth/auth.module';
import { EmailModule } from './modules/email/email.module';
import { UsersModule } from './modules/users/users.module';
import { CreatorsModule } from './modules/creators/creators.module';
import { BusinessesModule } from './modules/businesses/businesses.module';
import { SocialAccountsModule } from './modules/social-accounts/social-accounts.module';
import { PortfoliosModule } from './modules/portfolios/portfolios.module';
import { CampaignsModule } from './modules/campaigns/campaigns.module';
import { MessagesModule } from './modules/messages/messages.module';
import { ServicesModule } from './modules/services/services.module';
import { ApplicationsModule } from './modules/applications/applications.module';

@Module({
  imports: [
    // Load .env from project root or workspace
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '../.env', '../../.env'],
    }),
    PrismaModule,
    HealthModule,
    EmailModule,
    AuthModule,
    UsersModule,
    CreatorsModule,
    BusinessesModule,
    SocialAccountsModule,
    PortfoliosModule,
    CampaignsModule,
    MessagesModule,
    ServicesModule,
    ApplicationsModule,
  ],
})
export class AppModule {}
