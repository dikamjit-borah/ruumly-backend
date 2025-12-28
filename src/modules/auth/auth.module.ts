import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { envConfig } from '@/config/env.config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { FirebaseService } from './firebase.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { OwnersModule } from '@/modules/owners/owners.module';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: envConfig.jwt.secret,
      signOptions: { expiresIn: 604800 }, // 7 days in seconds
    }),
    OwnersModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, FirebaseService, JwtStrategy],
  exports: [AuthService, FirebaseService, JwtModule],
})
export class AuthModule {}
