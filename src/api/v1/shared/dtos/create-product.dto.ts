import {
  Types
} from 'mongoose';

import {
  convertStringIdsToObjectId,
  isValidJsonString,
  isValidArrayOfStrings,
  Categories,
  ProductInterface,
  MIN_QTY_IN_STOCK,
  CustomizationTextRangeInterface
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
  customizationTextRange: CustomizationTextRangeInterface;

  constructor(reqBody: Record<string, any>) {
    this.name = reqBody?.name || '';
    this.description = reqBody?.description || '';
    this.isPinned = (reqBody?.isPinned === 'true');
    this.maxRetailPrice = parseFloat(reqBody?.maxRetailPrice) || 0;
    this.sellingPrice = parseFloat(reqBody?.sellingPrice) || 0;
    this.quantityInStock = parseInt(reqBody?.quantityInStock) || MIN_QTY_IN_STOCK;
    this.category = reqBody?.category || Categories.OTHERS;

    if (!(typeof reqBody?.customizationTextRange === 'undefined')) {
      if (isValidJsonString(reqBody?.customizationTextRange) &&
          !Array.isArray(JSON.parse(reqBody?.customizationTextRange))) {
        const data = JSON.parse(reqBody?.customizationTextRange);
        this.customizationTextRange = data || {};
        this.customizationTextRange.min = parseInt(data.min) || 0;
        this.customizationTextRange.max = parseInt(data.max) || 0;
      } else {
        throw new Error(`Invalid JSON for customization text range`);
      }
    } else {
      this.customizationTextRange = {
        min: 0,
        max: 0
      };
    }

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
