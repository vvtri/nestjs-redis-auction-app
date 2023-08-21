import { RedisModule } from '@liaoliaots/nestjs-redis';
import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import appConfig from './common/config/app.config';
import { redisConfig } from './common/config/redis.config';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';
import { UtilModule } from './util/util.module';
import { ProductModule } from './products/product.module';

@Module({
  imports: [
    RedisModule.forRootAsync(redisConfig),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [() => appConfig],
      cache: true,
    }),
    JwtModule.register({ global: true }),

    UtilModule,
    AuthModule,
    ProductModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
