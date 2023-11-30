import { Types } from 'mongoose';

export interface ProductInterface {
  name: string;
  description: string;
  price: number;
  isPopular: boolean;
  quantityInStock: number;
  images: Array<Types.ObjectId>;
  similarProducts: Array<Types.ObjectId>
  category?: string;
};
