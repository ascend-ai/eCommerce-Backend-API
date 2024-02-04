import mongoose, {
  CallbackWithoutResultAndOptionalError,
  Schema
} from 'mongoose';

import {
  OrderInterface,
  OrderStatus
} from '../shared';

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
  razorpayPaymentId: String,
  razorpaySignature: String,
  purchases: {
    type: Map,
    of: Number,
    required: true,
  },
  status: {
    type: String,
    enum: [
      OrderStatus.PENDING,
      OrderStatus.PLACED,
      OrderStatus.CONFIRMED,
      OrderStatus.SHIPPED,
      OrderStatus.DELIVERED,
    ],
    default: OrderStatus.PENDING
  },
  totalPurchaseAmount: {
    type: Number,
    required: true
  },
  shippingCharge: {
    type: Number,
    required: true
  },
  isSelfPickup: {
    type: Boolean,
    default: false,
  },
  whenCreated: {
    type: Number,
    default: Date.now
  },
  whenLastUpdated: {
    type: Number,
    default: Date.now
  }
});

orderSchema.pre('updateOne', async function (next: CallbackWithoutResultAndOptionalError) {
  this.set({
    whenLastUpdated: Date.now()
  })
});

export const OrderModel = mongoose.model<OrderInterface>('Order', orderSchema);
