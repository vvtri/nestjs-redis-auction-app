import { Global, Module } from '@nestjs/common';
import { RedisKeyService } from './services/redis-key.service';

@Global()
@Module({
  providers: [RedisKeyService],
  exports: [RedisKeyService],
})
export class UtilModule {}
