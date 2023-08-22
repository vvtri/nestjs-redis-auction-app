import { Global, Module } from '@nestjs/common';
import { RedisKeyService } from './services/redis-key.service';
import { RedisLockService } from './services/redis-lock.service';

@Global()
@Module({
  providers: [RedisKeyService, RedisLockService],
  exports: [RedisKeyService, RedisLockService],
})
export class UtilModule {}
