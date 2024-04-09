import {
  Types
} from 'mongoose';

export interface PurchaseInterface {
  productId: Types.ObjectId;
  productOrderQty: number;
  productCustomizationText: string;
}