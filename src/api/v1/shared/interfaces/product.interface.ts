import { Types } from 'mongoose';

export interface ProductInterface {
  name: string;
  description: string;
  price: number;
  isPinned: boolean;
  quantityInStock: number;
  images: Array<Types.ObjectId>;
  similarProducts: Array<Types.ObjectId>;
  category?: string;
  whenCreated: number;
  totalPurchases: number;
};
