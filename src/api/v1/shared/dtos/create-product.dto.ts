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
  category: string;
  isPopular: boolean;
  price: number;
  similarProducts: Array<Types.ObjectId>;
  // TODO Requirement for handling categories is changed.
  // categories?: Array<string>;

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

    // TODO Requirement for handling categories is changed.
    // if (!(typeof reqBody?.categories === 'undefined')) {
    //   if (this._isValidArrayOfStringsJSON(reqBody?.categories)) {
    //     this.categories = JSON.parse(reqBody?.categories);
    //   } else {
    //     throw new Error(`Invalid JSON array of strings`);
    //   }
    // } else {
    //   this.categories = [];
    // }
  }
}
