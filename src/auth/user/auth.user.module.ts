import { Module } from '@nestjs/common';
import { AuthUserController } from './controllers/auth.user.controller';
import { UserRepository } from './repositories/user.repository';
import { AuthUserService } from './services/auth.user.service';
import { JwtAuthenUserStrategy } from './strategies/jwt-authen.user.strategy';

@Module({
  controllers: [AuthUserController],
  providers: [AuthUserService, UserRepository, JwtAuthenUserStrategy],
})
export class AuthUserModule {}
