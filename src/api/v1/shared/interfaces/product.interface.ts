import { Types } from 'mongoose';

export interface ProductInterface {
  name: string;
  description: string;
  quantityInStock: number;
  images: Array<Types.ObjectId>;
  similarProducts: Array<Types.ObjectId>
  category?: string;
};
