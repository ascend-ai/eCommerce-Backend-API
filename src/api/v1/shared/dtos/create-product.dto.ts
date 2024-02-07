import {
  Types
} from 'mongoose';

import {
  convertStringIdsToObjectId,
  isValidJsonString,
  isValidArrayOfStrings,
  Categories,
  ProductInterface,
  MIN_QTY_IN_STOCK
} from '../../shared';

export class CreateProductDto implements Partial<ProductInterface> {
  name: string;
  description: string;
  quantityInStock: number;
  category: Categories;
  isPinned: boolean;
  maxRetailPrice: number;
  sellingPrice: number;
  similarProducts: Array<Types.ObjectId>;

  constructor(reqBody: Record<string, any>) {
    this.name = reqBody?.name || '';
    this.description = reqBody?.description || '';
    this.isPinned = (reqBody?.isPinned === 'true');
    this.maxRetailPrice = parseFloat(reqBody?.maxRetailPrice) || 0;
    this.sellingPrice = parseFloat(reqBody?.sellingPrice) || 0;
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
