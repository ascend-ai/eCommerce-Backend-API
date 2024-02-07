import mongoose, {
  CallbackWithoutResultAndOptionalError
} from 'mongoose';

import {
  ProductImageInterface
} from '../shared';

const productImageSchema = new mongoose.Schema<ProductImageInterface>({
  url: {
    type: String,
    required: true
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

productImageSchema.pre('updateOne', { document: true, query: false }, function (next: CallbackWithoutResultAndOptionalError) {
  this.whenLastUpdated = Date.now();
  next();
});

export const ProductImageModel = mongoose.model<ProductImageInterface>('ProductImage', productImageSchema);
