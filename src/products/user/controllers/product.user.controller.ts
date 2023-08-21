import { Controller, Get, Query, Body, Post, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { User } from '../../../auth/user/types/user.type';
import {
  AuthenticateUser,
  CurrentAuthData,
} from '../../../common/decorators/auth.decorator';
import { PaginationReqDto } from '../../../common/dtos/pagination.dto';
import { PathType } from '../../../common/enums/path-type.enum';
import {
  CreateProductUserDtoReq,
  GetListEndingSoonestUserDtoReq,
} from '../dtos/req/product.user.dto.req';
import { ProductUserService } from '../services/product.user.service';

@Controller({ version: '1', path: `${PathType.USER}/product` })
@ApiTags('Product User V1')
export class ProductUserController {
  constructor(private productUserSer: ProductUserService) {}

  @Get('ending-soonest')
  getListEndingSoonest(@Query() query: GetListEndingSoonestUserDtoReq) {
    return this.productUserSer.getListEndingSoonest(query);
  }

  @Get('most-views')
  getListMostViews(@Query() query: PaginationReqDto) {
    return this.productUserSer.getListMostViews(query);
  }

  @Get(':id')
  @AuthenticateUser()
  getDetail(@Param('id') id: string, @CurrentAuthData() user: User) {
    return this.productUserSer.getDetail(id, user);
  }

  @Post()
  @AuthenticateUser()
  create(@Body() body: CreateProductUserDtoReq, @CurrentAuthData() user: User) {
    return this.productUserSer.create(body, user);
  }
}
