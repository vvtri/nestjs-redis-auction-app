import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { RedisIndexName } from '../../../common/constants/index.constant';
import { ProductRepository } from '../../common/repositories/product.repository';

@Injectable()
export class ProductAdminService {
  constructor(
    private productRepo: ProductRepository,
    @InjectRedis() private redis: Redis,
  ) {}

  async createIndex() {
    await this.redis.call(
      'FT.CREATE',
      RedisIndexName.PRODUCT,
      'ON',
      'HASH',
      'PREFIX',
      '1',
      'product',
      'SCHEMA',
      'id',
      'TAG',

      'name',
      'TEXT',

      'username',
      'TAG',

      'desc',
      'TEXT',

      'views',
      'NUMERIC',

      'highestBid',
      'NUMERIC',

      'endingAt',
      'NUMERIC',
    );

    return 'success';
  }

  async dropIndex() {
    await this.redis.call('ft.drop', RedisIndexName.PRODUCT);
  }
}
