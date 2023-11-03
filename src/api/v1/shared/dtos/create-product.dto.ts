import { ProductCategoryInterface, ProductInterface } from '../interfaces';

export class CreateProductDto {
  name: string;
  description?: string;
  quantityInStock: number;
  categories?: Array<string>;

  constructor(reqBody: Record<string, any>) {
    this.name = reqBody?.name || '';
    this.description = reqBody?.description || '';
    this.quantityInStock = reqBody?.quantityInStock || '';
    if (!(typeof reqBody?.categories === 'undefined')) {
      if (this._isValidArrayOfStringsJSON(reqBody?.categories)) {
        this.categories = JSON.parse(reqBody?.categories);
      } else {
        throw new Error(`Invalid JSON array of strings`);
      }
    } else {
      this.categories = [];
    }
  }

  private _isValidArrayOfStringsJSON(jsonString: string): boolean {
    try {
      const parsedData = JSON.parse(jsonString);
      return Array.isArray(parsedData) && parsedData.every(item => typeof item === 'string');
    } catch (error: any) {
      return false;
    }
  }
}
