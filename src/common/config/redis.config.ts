import {
  RedisModuleAsyncOptions,
  RedisModuleOptions,
} from '@liaoliaots/nestjs-redis';
import { ConfigService } from '@nestjs/config';
import appConfig, { AppConfig } from './app.config';

export enum RedisNamespace {
  MASTER_NS = 'MASTER_NS',
  SLAVE_NS = 'SLAVE_NS',
}

export const redisConfig: RedisModuleAsyncOptions = {
  inject: [ConfigService],
  useFactory(configService: ConfigService<AppConfig>) {
    const redisHost = configService.get('redis.standAlone.host');
    const redisPort = configService.get('redis.standAlone.port');
    const redisPassword = configService.get('redis.standAlone.password');

    const redisConfig: RedisModuleOptions = {
      readyLog: true,
      errorLog: true,
      config: {
        host: redisHost,
        port: Number(redisPort),
        password: redisPassword,
        onClientCreated(client) {
          client.defineCommand('unLock', {
            numberOfKeys: 1,
            lua: `
              local lockKey = KEYS[1]
              local token = ARGV[1]
              
              if (redis.call("GET", lockKey) == token) then
                redis.call("DEL", lockKey)
              end
            `,
          });
        },
      },
    };

    return redisConfig;
  },
};
