import { Module } from '@nestjs/common';
import { ProductUserController } from './controllers/product.user.controller';
import { ProductRepository } from '../common/repositories/product.repository';
import { ProductUserService } from './services/product.user.service';

@Module({
  controllers: [ProductUserController],
  providers: [ProductUserService, ProductRepository],
  exports: [],
})
export class ProductUserModule {}
