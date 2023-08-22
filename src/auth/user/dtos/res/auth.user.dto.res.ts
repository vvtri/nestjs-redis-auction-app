import { NonFunctionProperties } from '../../../../common/types/util.type';
import { User } from '../../../common/types/user.type';

export class AuthUserDtoRes {
  user: User;
  accessToken: string;
  refreshToken: string;

  constructor(obj: NonFunctionProperties<AuthUserDtoRes>) {
    Object.assign(this, obj);
  }
}
