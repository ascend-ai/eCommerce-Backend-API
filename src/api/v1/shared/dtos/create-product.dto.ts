import { Types } from 'mongoose';
import { Categories } from '../enums';
import { ProductInterface } from '../interfaces';
import {
  convertArrayOfStringsIntoArrayOfMongooseIds,
  isValidJsonString,
  isValidArrayOfStrings
} from '../../shared';

export class CreateProductDto implements Partial<ProductInterface> {
  name: string;
  description: string;
  isPopular: boolean;
  quantityInStock: number;
  category: string;
  similarProducts: Array<Types.ObjectId>;
  // TODO Requirement for handling categories is changed.
  // categories?: Array<string>;

  constructor(reqBody: Record<string, any>) {
    console.log(reqBody.isPopular);
    this.name = reqBody?.name || '';
    this.description = reqBody?.description || '';
    this.isPopular = (reqBody?.isPopular === 'true');
    this.quantityInStock = parseInt(reqBody?.quantityInStock) || 1;
    this.category = reqBody?.category || Categories.OTHERS;
    if (!(typeof reqBody?.similarProducts === 'undefined')) {
      if (isValidJsonString(reqBody?.similarProducts) &&
          isValidArrayOfStrings(JSON.parse(reqBody?.similarProducts))) {
        this.similarProducts = convertArrayOfStringsIntoArrayOfMongooseIds(
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
