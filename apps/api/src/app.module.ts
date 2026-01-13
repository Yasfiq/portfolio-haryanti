import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { APP_GUARD } from '@nestjs/core';

import { appConfig } from './config';
import { SupabaseAuthGuard } from './common/guards';

// Feature Modules
import { HealthModule } from './modules/health';
import { EmailModule } from './modules/email';
import { DashboardModule } from './modules/dashboard';
import { MessagesModule } from './modules/messages';
import { ClientsModule } from './modules/clients/clients.module';
import { ProfileModule } from './modules/profile';
import { SkillsModule } from './modules/skills';
import { ExperiencesModule } from './modules/experiences';
import { ServicesModule } from './modules/services';
import { HeroSlidesModule } from './modules/hero-slides';
import { SettingsModule } from './modules/settings';
import { UploadModule } from './modules/upload';

@Module({
  imports: [
    // Global Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
    }),

    // Rate Limiting
    ThrottlerModule.forRoot([{
      ttl: 60000, // 1 minute
      limit: 100, // 100 requests per minute
    }]),

    // Scheduled Tasks (for keep-alive)
    ScheduleModule.forRoot(),

    // Feature Modules
    HealthModule,
    EmailModule,
    DashboardModule,
    MessagesModule,
    ClientsModule,
    ProfileModule,
    SkillsModule,
    ExperiencesModule,
    ServicesModule,
    HeroSlidesModule,
    SettingsModule,
    UploadModule,
  ],
  providers: [
    // Global Auth Guard
    {
      provide: APP_GUARD,
      useClass: SupabaseAuthGuard,
    },
    // Global Rate Limiting
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule { }
