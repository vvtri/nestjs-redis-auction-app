import { Module } from '@nestjs/common';
import { ProductUserModule } from './user/product.user.module';

@Module({
  imports: [ProductUserModule],
  providers: [],
})
export class ProductModule {}
