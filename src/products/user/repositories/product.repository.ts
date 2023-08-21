import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import dayjs from 'dayjs';
import { Redis } from 'ioredis';
import { User } from '../../../auth/user/types/user.type';
import { PaginationReqDto } from '../../../common/dtos/pagination.dto';
import { chunk } from '../../../common/utils';
import { RedisKeyService } from '../../../util/services/redis-key.service';
import { Product } from '../types/product.type';

@Injectable()
export class ProductRepository {
  constructor(
    @InjectRedis() private redis: Redis,
    private redisKeySer: RedisKeyService,
  ) {}

  async getListEndingSoonest({ limit, page }: PaginationReqDto) {
    const productEndingSoonestKey = this.redisKeySer.productEndingSoonestKey();
    const offset = (page - 1) * limit;
    const count = limit;

    const productIds = await this.redis.zrange(
      productEndingSoonestKey,
      Date.now(),
      'inf',
      'BYSCORE',
      'LIMIT',
      offset,
      count,
    );

    const pipeline = this.redis.pipeline();

    for (const productId of productIds) {
      pipeline.hgetall(this.redisKeySer.productKey(productId));
    }

    const products = await pipeline.exec();

    return products
      .map(([error, result], idx) => {
        if (error) {
          return console.log(error);
        }

        return this.deserialize(productIds[idx], result as any);
      })
      .filter(Boolean);
  }

  async getListMostExpensive({ limit, page }: PaginationReqDto) {}

  async getListMostViews({ limit, page }: PaginationReqDto) {
    const offset = (page - 1) * limit;
    const count = limit;

    const asteriskKey = this.redisKeySer.productKey('*');

    const result = await this.redis.sort(
      this.redisKeySer.productViewBoardKey(),
      'BY',
      `${asteriskKey}->views`,
      'LIMIT',
      offset,
      count,
      'DESC',
      'GET',
      `#`,
      'GET',
      `${asteriskKey}->name`,
      'GET',
      `${asteriskKey}->username`,
      'GET',
      `${asteriskKey}->desc`,
      'GET',
      `${asteriskKey}->views`,
      'GET',
      `${asteriskKey}->highestBids`,
      'GET',
      `${asteriskKey}->endingAt`,
    );

    if (!Array.isArray(result)) return [];

    return chunk(result, 7).map((item) => {
      const [key, name, username, desc, views, highestBids, endingAt] = item;

      return this.deserialize(key, {
        name,
        username,
        desc,
        views,
        highestBids,
        endingAt,
      });
    });
  }

  async getOne(productId: string, user: User) {
    const productKey = this.redisKeySer.productKey(productId);
    const rawProduct = await this.redis.hgetall(productKey);

    if (!Object.getOwnPropertyNames(rawProduct).length) return null;

    const result = await this.redis.pfadd(
      this.redisKeySer.productUniqueViewKey(productId),
      user.username,
    );

    if (result) {
      await this.redis
        .pipeline()
        .hincrby(this.redisKeySer.productKey(productId), 'views', 1)
        .zincrby(this.redisKeySer.productViewBoardKey(), 1, productId)
        .exec();
    }

    const product = this.deserialize(productId, rawProduct);
    product.views += 1;
    return product;
  }

  async create(params: CreateProductParams) {
    const { desc, endingAt, name, username } = params;

    const productId = randomUUID();
    const productKey = this.redisKeySer.productKey(productId);
    const productEndingSoonestKey = this.redisKeySer.productEndingSoonestKey();
    const serialized = this.serialize({
      desc,
      name,
      username,
      endingAt,
      views: 0,
    });

    const pipeline = this.redis.pipeline();

    pipeline.hset(productKey, serialized);
    pipeline.zadd(productEndingSoonestKey, endingAt.getTime(), productId);

    const result = await pipeline.exec();

    return new Product({
      id: productId,
      desc,
      name,
      username,
      endingAt,
      views: 0,
    });
  }

  async update(id: string, params: UpdateProductParams) {
    const { desc, endingAt, name, username } = params;

    const productKey = this.redisKeySer.productKey(id);

    const updatedObj = {
      ...(desc && { desc }),
      ...(endingAt && { endingAt }),
      ...(name && { name }),
      ...(username && { username }),
    };

    if (!Object.getOwnPropertyNames(updatedObj).length) return;

    return this.redis.hset(productKey, this.serialize(updatedObj));
  }

  private serialize(
    product: Omit<Product, 'id' | 'views'> & { views?: Product['views'] },
  ) {
    return {
      name: product.name,
      username: product.username,
      desc: product.desc,
      views: product.views && product.views.toString(),
      highestBid: product.highestBid && product.highestBid.toString(),
      endingAt: dayjs(product.endingAt).unix(), //unix
    };
  }

  private deserialize(id: string, data: Record<string, string>) {
    return new Product({
      id,
      desc: data['desc'],
      endingAt: dayjs.unix(Number(data['endingAt'])).toDate(),
      name: data['name'],
      username: data['username'],
      views: Number(data['views']) || 0,
      highestBid: Number(data['highestBid']) || 0,
    });
  }
}

type CreateProductParams = {
  name: string;
  username: string;
  desc: string;
  endingAt: Date; //unix
};

type UpdateProductParams = Partial<CreateProductParams>;
