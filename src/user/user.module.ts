import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccessTokenStrategy } from './jwt.access.strategy';
import { refreshTokenStrategy } from './jwt.refresh.strategy';
import UserController from './user.controller';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    ConfigModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_ACCESS_KEY'),
        signOptions: {
          expiresIn: '300s', 
        }
      })
    })
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository ,AccessTokenStrategy, refreshTokenStrategy]
})
export class UserModule {}
