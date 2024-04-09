import {
  Types
} from 'mongoose';

import {
  OrderStatus
} from '../enums';
import {
  BaseModelInterface,
  TrackingResourceInterface,
  PurchaseInterface
} from './';

export interface OrderInterface extends BaseModelInterface {
  user: Types.ObjectId;
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  trackingResource: TrackingResourceInterface;
  purchases: Array<PurchaseInterface>;
  purchaseAmount: number;
  shippingCharge: number;
  totalAmount: number;
  status: OrderStatus;
  isSelfPickup: boolean;
}
