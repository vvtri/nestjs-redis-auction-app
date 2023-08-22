import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { compare, genSalt, hash } from 'bcryptjs';
import { AppConfig } from '../../../common/config/app.config';
import { JwtAuthPayload } from '../../../common/types/jwt-payload.type';
import { UserRepository } from '../../common/repositories/user.repository';
import { User } from '../../common/types/user.type';
import {
  SignInUserDtoReq,
  SignUpUserDtoReq,
} from '../dtos/req/auth.user.dto.req';
import { AuthUserDtoRes } from '../dtos/res/auth.user.dto.res';

@Injectable()
export class AuthUserService {
  constructor(
    private userRepo: UserRepository,
    private jwtService: JwtService,
    private configService: ConfigService<AppConfig>,
  ) {}

  async signUp(dto: SignUpUserDtoReq) {
    const { password, username } = dto;

    const exists = await this.userRepo.exists(username);

    if (exists) throw new ConflictException('User existed');

    const salt = await genSalt();
    const encryptedPwd = await hash(password, salt);

    const user = await this.userRepo.create({
      password: encryptedPwd,
      username,
    });

    const result = new AuthUserDtoRes({
      user: new User({ username }),
      accessToken: this.generateAccessToken({ username }),
      refreshToken: this.generateRefreshToken({ username }),
    });

    return result;
  }

  async signIn(dto: SignInUserDtoReq) {
    const { password, username } = dto;

    const user = await this.userRepo.get(username);

    if (!user) throw new NotFoundException('User does not exist');

    const isMatchPwd = compare(password, user!.password as string);

    if (!isMatchPwd) throw new UnauthorizedException('Invalid password');

    const result = new AuthUserDtoRes({
      user: new User({ username }),
      accessToken: this.generateAccessToken({ username }),
      refreshToken: this.generateRefreshToken({ username }),
    });

    return result;
  }

  private generateAccessToken(payload: JwtAuthPayload) {
    return this.jwtService.sign(payload, {
      expiresIn: this.configService.get('auth.accessToken.expiresTime'),
      secret: this.configService.get('auth.accessToken.secret'),
    });
  }

  private generateRefreshToken(payload: JwtAuthPayload) {
    return this.jwtService.sign(payload, {
      expiresIn: this.configService.get('auth.refreshToken.expiresTime'),
      secret: this.configService.get('auth.refreshToken.secret'),
    });
  }
}
