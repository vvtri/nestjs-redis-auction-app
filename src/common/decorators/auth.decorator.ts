import {
  applyDecorators,
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthenUserGuard } from '../../auth/user/guards/jwt-authen.user.guard';

export const IS_PUBLIC_KEY = Symbol();
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

export const AuthenticateUser = () =>
  applyDecorators(UseGuards(JwtAuthenUserGuard), ApiBearerAuth());

export const CurrentAuthData = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
