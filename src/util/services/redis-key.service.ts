export class RedisKeyService {
  userKey(username: string) {
    return `user#${username}`;
  }

  itemKey(itemId: string) {
    return `item#${itemId}`;
  }
}
