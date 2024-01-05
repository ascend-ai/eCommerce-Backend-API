import { Types } from 'mongoose';

import {
  convertStringIdsToObjectId,
  isValidJsonString,
  isValidArrayOfStrings,
  Categories,
  ProductInterface,
  MIN_PRODUCT_PRICE,
  MIN_QTY_IN_STOCK
} from '../../shared';

export class CreateProductDto implements Partial<ProductInterface> {
  name: string;
  description: string;
  quantityInStock: number;
  category: Categories;
  isPopular: boolean;
  price: number;
  similarProducts: Array<Types.ObjectId>;

  constructor(reqBody: Record<string, any>) {
    this.name = reqBody?.name || '';
    this.description = reqBody?.description || '';
    this.isPopular = (reqBody?.isPopular === 'true');
    this.price = parseFloat(reqBody?.price) || MIN_PRODUCT_PRICE;
    this.quantityInStock = parseInt(reqBody?.quantityInStock) || MIN_QTY_IN_STOCK;
    this.category = reqBody?.category || Categories.OTHERS;
    if (!(typeof reqBody?.similarProducts === 'undefined')) {
      if (isValidJsonString(reqBody?.similarProducts) &&
          isValidArrayOfStrings(JSON.parse(reqBody?.similarProducts))) {
        this.similarProducts = convertStringIdsToObjectId(
          <Array<string>>JSON.parse(reqBody?.similarProducts)
        );
      } else {
        throw new Error(`Invalid JSON array of similar products`);
      }
    } else {
      this.similarProducts = [];
    }
  }
}
