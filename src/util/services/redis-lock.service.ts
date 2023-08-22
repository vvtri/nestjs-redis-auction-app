import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import dayjs from 'dayjs';
import { Redis } from 'ioredis';
import { sleep } from '../../common/utils';
import { RedisKeyService } from './redis-key.service';

@Injectable()
export class RedisLockService {
  constructor(
    @InjectRedis() private redis: Redis,
    private redisKeySer: RedisKeyService,
  ) {}

  async useLock(
    { lockKey, lockTime, retryDelay, retryTime }: UseLockParams,
    cb: (proxiedRedis: Redis) => any,
  ) {
    const lockToken = randomUUID();
    const startTime = dayjs().unix();

    while (retryTime >= 0) {
      retryTime--;

      const acquired = await this.redis.set(
        lockKey,
        lockToken,
        'EX',
        lockTime,
        'NX',
      );

      if (!acquired) {
        await sleep(retryDelay);
        continue;
      }

      const proxiedRedis = this.getLockProxiedRedis(
        this.redis,
        startTime,
        lockTime,
      );

      try {
        const result = await cb(proxiedRedis);

        return result;
      } finally {
        await this.redis.unLock(lockKey, lockToken);
      }
    }

    throw new Error('Could not acquired lock');
  }

  private getLockProxiedRedis(
    redis: Redis,
    startTime: number,
    lockTime: number,
  ) {
    return new Proxy(redis, {
      get(target: Redis, prop: keyof Redis) {
        if (dayjs().unix() >= startTime + lockTime)
          throw new Error('Lock expired');

        const value = target[prop];
        return typeof value === 'function' ? value.bind(target) : value;
      },
    });
  }
}

type UseLockParams = {
  lockKey: string;

  /**
   * seconds
   */
  lockTime: number;

  retryTime: number;
  
  retryDelay: number;
};
