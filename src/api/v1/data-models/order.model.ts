import mongoose, { Schema, Types } from 'mongoose';

import { OrderInterface } from '../shared';

const orderSchema = new mongoose.Schema<OrderInterface>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  razorpayOrderId: {
    type: String,
    required: true
  },
  purchases: {
    type: Map,
    of: Number,
    required: true,
    validate: {
      validator: function (purchases: Record<string, number>) {
        let isValid = true;
        for (const [key, value] of Object.entries(purchases)) {
          if (!(Types.ObjectId.isValid(key) && (typeof value === 'number'))) {
            isValid = false;
            break;
          }
        }
        return isValid;
      },
      message: 'Purchases object should be a valid key value pair.',
    },
  },
  whenCreated: {
    type: Date,
    default: Date.now
  }
});

export const OrderModel = mongoose.model<OrderInterface>('Order', orderSchema);
