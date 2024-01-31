import { Types } from 'mongoose';
import {
  BaseModelInterface
} from './base-model.interface';

export interface ProductInterface extends BaseModelInterface {
  name: string;
  description: string;
  price: number;
  isPinned: boolean;
  quantityInStock: number;
  images: Array<Types.ObjectId>;
  similarProducts: Array<Types.ObjectId>;
  category?: string;
  totalPurchases: number;
};
