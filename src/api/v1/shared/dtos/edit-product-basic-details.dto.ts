import {
  Categories,
  ProductInterface,
  MIN_PRODUCT_PRICE,
  MIN_QTY_IN_STOCK,
  CustomizationTextRangeInterface
} from '../../shared';

export class EditProductBasicDetailsDto implements Partial<ProductInterface> {
  name: string;
  description: string;
  quantityInStock: number;
  category: Categories;
  isPinned: boolean;
  maxRetailPrice: number;
  sellingPrice: number;
  customizationTextRange: CustomizationTextRangeInterface;

  constructor(reqBody: Record<string, any>) {
    this.name = reqBody?.name || '';
    this.description = reqBody?.description || '';
    this.isPinned = ((typeof reqBody?.isPinned) === 'boolean') ? reqBody?.isPinned : false;
    this.maxRetailPrice = parseFloat(reqBody?.maxRetailPrice) || MIN_PRODUCT_PRICE;
    this.sellingPrice = parseFloat(reqBody?.sellingPrice) || MIN_PRODUCT_PRICE;
    this.quantityInStock = parseInt(reqBody?.quantityInStock) || MIN_QTY_IN_STOCK;
    this.customizationTextRange = reqBody?.customizationTextRange || {};
    this.customizationTextRange.min = reqBody?.customizationTextRange?.min || 0;
    this.customizationTextRange.max = reqBody?.customizationTextRange?.max || 0;
    this.category = reqBody?.category || Categories.OTHERS;
  }
}
