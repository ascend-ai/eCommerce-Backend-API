import {
  Types
} from 'mongoose';

import {
  OrderStatus
} from '../enums';

export interface OrderInterface {
  user: Types.ObjectId;
  razorpayOrderId: string;
  purchases: Record<string, number>;
  status: OrderStatus
  whenCreated: Date;
}
