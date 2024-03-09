import {
  Types
} from 'mongoose';
import {
  BaseModelInterface, CustomizationTextRangeInterface
} from './';

export interface ProductInterface extends BaseModelInterface {
  name: string;
  description: string;
  sellingPrice: number;
  maxRetailPrice: number;
  isPinned: boolean;
  quantityInStock: number;
  images: Array<Types.ObjectId>;
  similarProducts: Array<Types.ObjectId>;
  category: string;
  customizationTextRange: CustomizationTextRangeInterface;
  totalPurchases: number;
};
