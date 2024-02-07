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
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  trackingResource?: string;
  purchases: Map<string, number>;
  purchaseAmount: number;
  shippingCharge: number;
  totalAmount: number;
  status: OrderStatus;
  isSelfPickup: boolean;
}
