import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Injectable } from '@nestjs/common';
import { boolean } from 'boolean';
import Redis from 'ioredis';
import { RedisKeyService } from '../../../util/services/redis-key.service';
import { User } from '../types/user.type';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRedis() private redis: Redis,
    private redisKeySer: RedisKeyService,
  ) {}

  userKey(username: string) {
    return `user#${username}`;
  }

  async exists(username: string) {
    const result = await this.redis.exists(this.userKey(username));

    return boolean(result);
  }

  async create(params: CreateUserParams) {
    const { password, username } = params;

    const key = this.userKey(username);
    await this.redis.hset(key, { username, password });

    return new User({ username, password });
  }

  async get(username: string) {
    const result = await this.redis.hgetall(this.userKey(username));
    if (!Object.getOwnPropertyNames(result).length) return undefined;

    return new User(result as any);
  }
}

type CreateUserParams = {
  username: string;
  password: string;
};
