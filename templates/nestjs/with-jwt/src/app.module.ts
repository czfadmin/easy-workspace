import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TechModule } from './tech/tech.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { JobsModule } from './jobs/jobs.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TechModule,
    AuthModule,
    UserModule,
    JobsModule,
    TypeOrmModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
