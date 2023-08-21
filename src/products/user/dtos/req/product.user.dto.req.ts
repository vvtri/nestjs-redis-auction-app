import {
  IsValidDate,
  IsValidNumber,
  IsValidText,
} from '../../../../common/decorators/custom-validator.decorator';
import { PaginationReqDto } from '../../../../common/dtos/pagination.dto';

export class GetListEndingSoonestUserDtoReq extends PaginationReqDto {}

export class CreateProductUserDtoReq {
  @IsValidText()
  name: string;

  @IsValidText()
  desc: string;

  @IsValidDate()
  endingAt: Date;
}

export class BidProductUserDtoReq {
  @IsValidText()
  id: string;

  @IsValidNumber()
  price: number;
}
