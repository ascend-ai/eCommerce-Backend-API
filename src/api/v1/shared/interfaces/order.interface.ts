import { Types } from 'mongoose';

export interface OrderInterface {
  user: Types.ObjectId;
  razorpayOrderId: string;
  purchases: Record<string, number>;
  whenCreated: Date;
}
