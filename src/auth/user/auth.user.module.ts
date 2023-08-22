import { Module } from '@nestjs/common';
import { UserRepository } from '../common/repositories/user.repository';
import { JwtAuthenUserStrategy } from '../common/strategies/jwt-authen.user.strategy';
import { AuthUserController } from './controllers/auth.user.controller';
import { AuthUserService } from './services/auth.user.service';

@Module({
  controllers: [AuthUserController],
  providers: [AuthUserService, UserRepository, JwtAuthenUserStrategy],
})
export class AuthUserModule {}
