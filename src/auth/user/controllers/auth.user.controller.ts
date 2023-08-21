import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  AuthenticateUser,
  CurrentAuthData,
} from '../../../common/decorators/auth.decorator';
import { PathType } from '../../../common/enums/path-type.enum';
import {
  SignInUserDtoReq,
  SignUpUserDtoReq,
} from '../dtos/req/auth.user.dto.req';
import { AuthUserService } from '../services/auth.user.service';
import { User } from '../types/user.type';

@Controller({ version: '1', path: `${PathType.USER}/auth` })
@ApiTags('Auth User V1')
export class AuthUserController {
  constructor(private authUserSer: AuthUserService) {}

  @Get('current')
  @AuthenticateUser()
  current(@CurrentAuthData() user: User): User {
    return new User({ username: user.username });
  }

  @Post('sign-up')
  signUp(@Body() body: SignUpUserDtoReq) {
    return this.authUserSer.signUp(body);
  }

  @Post('sign-in')
  signIn(@Body() body: SignInUserDtoReq) {
    return this.authUserSer.signIn(body);
  }
}
