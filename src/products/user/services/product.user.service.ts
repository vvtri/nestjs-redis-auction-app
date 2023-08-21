import { Injectable } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common/exceptions';
import { User } from '../../../auth/user/types/user.type';
import { PaginationReqDto } from '../../../common/dtos/pagination.dto';
import { CreateProductUserDtoReq } from '../dtos/req/product.user.dto.req';
import { ProductRepository } from '../repositories/product.repository';

@Injectable()
export class ProductUserService {
  constructor(private productRepo: ProductRepository) {}

  async getListEndingSoonest(dto: PaginationReqDto) {
    return this.productRepo.getListEndingSoonest(dto);
  }

  async getListMostViews(dto: PaginationReqDto) {
    return this.productRepo.getListMostViews(dto);
  }

  async getDetail(id: string, user: User) {
    const product = await this.productRepo.getOne(id, user);
    if (!product) throw new NotFoundException();

    return product;
  }

  async create(dto: CreateProductUserDtoReq, user: User) {
    const { desc, endingAt, name } = dto;

    const product = await this.productRepo.create({
      desc,
      name,
      username: user.username,
      endingAt,
    });

    return product;
  }
}
