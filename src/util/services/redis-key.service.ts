export class RedisKeyService {
  userKey(username: string) {
    return `user#${username}`;
  }

  productKey(productId: string) {
    return `product#${productId}`;
  }

  productEndingSoonestKey() {
    return `product:ending:soonest`;
  }

  productUniqueViewKey(productId: string) {
    return `product:unique:view:${productId}`;
  }

  productViewBoardKey() {
    return `product:view:board`;
  }
}
