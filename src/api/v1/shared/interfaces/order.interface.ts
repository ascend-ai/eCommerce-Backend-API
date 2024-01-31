import {
  Types
} from 'mongoose';

import {
  OrderStatus
} from '../enums';
import {
  BaseModelInterface
} from './base-model.interface';

export interface OrderInterface extends BaseModelInterface {
  user: Types.ObjectId;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
  purchases: Map<string, number>;
  totalPurchaseAmount: number;
  status: OrderStatus
}
