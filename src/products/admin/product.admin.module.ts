import { Module } from '@nestjs/common';
import { ProductAdminController } from './controllers/product.admin.controller';
import { ProductAdminService } from './services/product.admin.service';
import { ProductRepository } from '../common/repositories/product.repository';

@Module({
  controllers: [ProductAdminController],
  providers: [ProductAdminService, ProductRepository],
})
export class ProductAdminModule {}
