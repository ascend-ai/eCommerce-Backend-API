import {
  Types
} from 'mongoose';

import {
  OrderStatus
} from '../enums';
import {
  BaseModelInterface,
  TrackingResourceInterface
} from './';

export interface OrderInterface extends BaseModelInterface {
  user: Types.ObjectId;
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  trackingResource: TrackingResourceInterface;
  purchases: Map<string, number>;
  purchaseAmount: number;
  shippingCharge: number;
  totalAmount: number;
  status: OrderStatus;
  isSelfPickup: boolean;
}
