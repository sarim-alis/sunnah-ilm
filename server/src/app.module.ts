import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AskModule } from './ask/ask.module';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { QueryModule } from './common/query/query.module';
import { HadithModule } from './hadith/hadith.module';
import { HealthController } from './health.controller';
import { NotificationsModule } from './notifications/notifications.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.getOrThrow<string>('DATABASE_URL'),
        ssl: { rejectUnauthorized: false },
        autoLoadEntities: true,
        synchronize: false,
      }),
    }),
    CommonModule,
    QueryModule,
    UsersModule,
    HadithModule,
    NotificationsModule,
    AskModule,
    AuthModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
