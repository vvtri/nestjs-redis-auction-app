import { PassportStrategy } from '@nestjs/passport';
import { PassportStrategyName } from '../../../common/enums/passpport-strategy.enum';
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';
import { UserRepository } from '../repositories/user.repository';
import { AppConfig } from '../../../common/config/app.config';
import { ConfigService } from '@nestjs/config';
import { JwtAuthPayload } from '../../../common/types/jwt-payload.type';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class JwtAuthenUserStrategy extends PassportStrategy(
  Strategy,
  PassportStrategyName.USER,
) {
  constructor(
    private readonly userRepo: UserRepository,
    configService: ConfigService<AppConfig>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('auth.accessToken.secret'),
      algorithms: [configService.get('auth.accessToken.algorithm')],
    } as StrategyOptions);
  }

  async validate(payload: JwtAuthPayload) {
    const { username } = payload;

    const user = await this.userRepo.get(username);
    
    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
