import { NonFunctionProperties } from '../../../common/types/util.type';

export class Product {
  id: string;
  name: string;
  username: string;
  desc: string;
  views: number;
  highestBid?: number;
  endingAt: Date; //unix

  constructor(params: NonFunctionProperties<Product>) {
    Object.assign(this, params);
  }
}
