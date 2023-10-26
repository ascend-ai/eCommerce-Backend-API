import { ProductCategoryInterface, ProductInterface } from '../interfaces';

export class CreateProductDto {
  name: string;
  description?: string;
  quantityInStock: number;
  categories?: Array<ProductCategoryInterface>;

  constructor(reqBody: Record<string, any>) {
    this.name = reqBody?.name || '';
    this.description = reqBody?.description || '';
    this.quantityInStock = reqBody?.quantityInStock || '';
    this.categories = JSON.parse(reqBody?.categories) || [];
  }
}
