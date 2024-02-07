import { Types } from 'mongoose';
import {
  BaseModelInterface
} from './base-model.interface';

export interface ProductInterface extends BaseModelInterface {
  name: string;
  description: string;
  sellingPrice: number;
  maxRetailPrice: number;
  isPinned: boolean;
  quantityInStock: number;
  images: Array<Types.ObjectId>;
  similarProducts: Array<Types.ObjectId>;
  category?: string;
  totalPurchases: number;
};
