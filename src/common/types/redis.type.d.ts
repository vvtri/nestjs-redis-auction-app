export declare module 'ioredis' {
  interface RedisCommander<Context> {
    unLock(key: string, token: string): Promise<void>;
  }
}
