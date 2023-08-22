import { Module } from '@nestjs/common';
import { ProductAdminModule } from './admin/product.admin.module';
import { ProductUserModule } from './user/product.user.module';

@Module({
  imports: [ProductUserModule, ProductAdminModule],
  providers: [],
})
export class ProductModule {}
