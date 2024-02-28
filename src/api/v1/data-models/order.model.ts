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
    enum: Object.values(OrderStatus).filter(value => typeof value === 'string'),
    default: OrderStatus.PENDING
  },
  trackingResource: {
    trackingId: {
      type: String,
      default: '',
      validate: function(this: OrderInterface) {
        const haveTrackingId: boolean = !!this.trackingResource.trackingId.trim().length;
        const haveTrackingUrl: boolean = !!this.trackingResource.trackingUrl.trim().length;
        return (haveTrackingId && haveTrackingUrl) || (!haveTrackingId && !haveTrackingUrl);
      },
    },
    trackingUrl: {
      type: String,
      default: '',
      validate: function(this: OrderInterface) {
        const haveTrackingId: boolean = !!this.trackingResource.trackingId.trim().length;
        const haveTrackingUrl: boolean = !!this.trackingResource.trackingUrl.trim().length;
        return (haveTrackingId && haveTrackingUrl) || (!haveTrackingId && !haveTrackingUrl);
      }
    }
  },
  purchaseAmount: {
    type: Number,
    required: true
  },
  shippingCharge: {
    type: Number,
    required: true
  },
  totalAmount: {
    type: Number,
    default: 0
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

orderSchema.pre('save', function (next: CallbackWithoutResultAndOptionalError) {
  if (this.isModified('purchaseAmount') || this.isModified('shippingCharge')) {
    this.totalAmount = this.purchaseAmount + this.shippingCharge;
  }
  next();
});

orderSchema.pre('updateOne', { document: true, query: false }, function (next: CallbackWithoutResultAndOptionalError) {
  if (this.isModified('purchaseAmount') || this.isModified('shippingCharge')) {
    this.totalAmount = this.purchaseAmount + this.shippingCharge;
  }
  this.whenLastUpdated = Date.now();
  next();
});

export const OrderModel = mongoose.model<OrderInterface>('Order', orderSchema);
