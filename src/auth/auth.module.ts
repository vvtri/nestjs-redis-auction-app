import { Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { AuthUserModule } from './user/auth.user.module';

@Module({
  imports: [AuthUserModule],
  providers: [],
})
export class AuthModule {}
