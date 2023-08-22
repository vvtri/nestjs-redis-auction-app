import { Controller, Get } from '@nestjs/common';
import {
  Delete,
  Post,
} from '@nestjs/common/decorators/http/request-mapping.decorator';
import { ApiTags } from '@nestjs/swagger';
import { PathType } from '../../../common/enums/path-type.enum';
import { ProductAdminService } from '../services/product.admin.service';

@Controller({ version: '1', path: `${PathType.ADMIN}/product` })
@ApiTags('Product admin')
export class ProductAdminController {
  constructor(private productAdminSer: ProductAdminService) {}

  @Post('index')
  createIndex() {
    return this.productAdminSer.createIndex();
  }

  @Delete('index')
  dropIndex() {
    return this.productAdminSer.dropIndex();
  }
}
