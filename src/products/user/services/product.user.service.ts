import { Injectable } from '@nestjs/common';
import {
  BadRequestException,
  NotFoundException,
} from '@nestjs/common/exceptions';
import dayjs from 'dayjs';
import { PaginationReqDto } from '../../../common/dtos/pagination.dto';
import { isNullOrUndefined, sleep } from '../../../common/utils';
import { RedisKeyService } from '../../../util/services/redis-key.service';
import { RedisLockService } from '../../../util/services/redis-lock.service';
import {
  BidProductUserDtoReq,
  CreateProductUserDtoReq,
} from '../dtos/req/product.user.dto.req';
import { ProductRepository } from '../../common/repositories/product.repository';
import { User } from '../../../auth/common/types/user.type';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Redis } from 'ioredis';

@Injectable()
export class ProductUserService {
  constructor(
    @InjectRedis() private redis: Redis,
    private productRepo: ProductRepository,
    private redisKeySer: RedisKeyService,
    private redisLockSer: RedisLockService,
  ) {}

  async getListEndingSoonest(dto: PaginationReqDto) {
    return this.productRepo.getListEndingSoonest(dto);
  }

  async getListMostViews(dto: PaginationReqDto) {
    return this.productRepo.getListMostViews(dto);
  }

  async getListMostExpensive(dto: PaginationReqDto) {
    return this.productRepo.getListMostExpensive(dto);
  }

  async getDetail(id: string, user: User) {
    const product = await this.productRepo.getOne(id, user);
    if (!product) throw new NotFoundException();

    return product;
  }

  async create(dto: CreateProductUserDtoReq, user: User) {
    const { desc, endingAt, name } = dto;

    const product = await this.productRepo.create({
      desc,
      name,
      username: user.username,
      endingAt,
    });

    return product;
  }

  async bid(dto: BidProductUserDtoReq, user: User) {
    const { price, id } = dto;

    const lockKey = this.redisKeySer.bidLockKey(id);
    const productKey = this.redisKeySer.productKey(id);
    const productBidHistoryKey = this.redisKeySer.productBidHistoryKey(id);

    await this.redisLockSer.useLock(
      { lockKey, lockTime: 999, retryDelay: 100, retryTime: 20 },
      async (proxiedRedis) => {
        const product = await this.productRepo.getOne(id, user);

        if (dayjs().isAfter(product.endingAt))
          throw new BadRequestException(`invalid date`);

        if (price <= product.highestBid)
          throw new BadRequestException(`invalid price`);

        await sleep(1500);

        await proxiedRedis
          .pipeline()
          .hset(productKey, 'highestBid', price)
          .rpush(productBidHistoryKey, price)
          .exec();
      },
    );
  }

  async getLikeStatus(productId: string, user: User) {
    const productLikeListKey = this.redisKeySer.productLikeListKey(productId);

    const [resultIsMember, resultLikeCount] = await this.redis
      .pipeline()
      .lpos(productLikeListKey, user.username)
      .llen(productLikeListKey)
      .exec();

    let isMember = true;
    let likeCount = 0;

    if (!resultIsMember[0]) isMember = isNullOrUndefined(resultIsMember[1]);
    if (!resultLikeCount[0]) likeCount = Number(resultLikeCount[1]);

    return { isMember, likeCount };
  }

  async likeProduct(productId: string, user: User) {
    const productLikeListKey = this.redisKeySer.productLikeListKey(productId);

    await this.redis.rpush(productLikeListKey, user.username);

    return this.getLikeStatus(productId, user);
  }

  async unLikeProduct(productId: string, user: User) {
    const productLikeListKey = this.redisKeySer.productLikeListKey(productId);

    await this.redis.lrem(productLikeListKey, 1, user.username);

    return this.getLikeStatus(productId, user);
  }
}
