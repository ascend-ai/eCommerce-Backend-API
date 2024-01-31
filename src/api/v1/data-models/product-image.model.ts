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

productImageSchema.pre('updateOne', async function (next: CallbackWithoutResultAndOptionalError) {
  this.set({
    whenLastUpdated: Date.now()
  })
});

export const ProductImageModel = mongoose.model<ProductImageInterface>('ProductImage', productImageSchema);
