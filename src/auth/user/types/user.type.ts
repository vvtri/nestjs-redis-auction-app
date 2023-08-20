import { NonFunctionProperties } from '../../../common/types/util.type';

export class User {
  username: string;
  password?: string;  

  constructor(obj: NonFunctionProperties<User>) {
    this.username = obj.username;
    this.password = obj.password;
  }
}
