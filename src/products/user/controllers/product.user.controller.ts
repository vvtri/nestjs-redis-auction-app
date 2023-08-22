import {
  Controller,
  Get,
  Query,
  Body,
  Post,
  Param,
  Patch,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { User } from '../../../auth/common/types/user.type';
import {
  AuthenticateUser,
  CurrentAuthData,
} from '../../../common/decorators/auth.decorator';
import { PaginationReqDto } from '../../../common/dtos/pagination.dto';
import { PathType } from '../../../common/enums/path-type.enum';
import {
  BidProductUserDtoReq,
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

  @Get('most-expensive')
  getListMostExpensive(@Query() query: PaginationReqDto) {
    return this.productUserSer.getListMostExpensive(query);
  }

  @Get(':id')
  @AuthenticateUser()
  getDetail(@Param('id') id: string, @CurrentAuthData() user: User) {
    return this.productUserSer.getDetail(id, user);
  }

  @Get(':id/like-status')
  @AuthenticateUser()
  getLikeStatus(@Param('id') productId: string, @CurrentAuthData() user: User) {
    return this.productUserSer.getLikeStatus(productId, user);
  }

  @Post('bid')
  @AuthenticateUser()
  bid(@Body() body: BidProductUserDtoReq, @CurrentAuthData() user: User) {
    return this.productUserSer.bid(body, user);
  }

  @Patch(':id/like')
  @AuthenticateUser()
  like(@Param('id') productId: string, @CurrentAuthData() user: User) {
    return this.productUserSer.likeProduct(productId, user);
  }

  @Patch(':id/un-like')
  @AuthenticateUser()
  unLike(@Param('id') productId: string, @CurrentAuthData() user: User) {
    return this.productUserSer.unLikeProduct(productId, user);
  }

  @Post()
  @AuthenticateUser()
  create(@Body() body: CreateProductUserDtoReq, @CurrentAuthData() user: User) {
    return this.productUserSer.create(body, user);
  }
}
