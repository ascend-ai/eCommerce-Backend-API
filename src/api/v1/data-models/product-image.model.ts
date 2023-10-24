import mongoose from 'mongoose';
import { ProductImageInterface } from '../shared';

const productImageSchema = new mongoose.Schema<ProductImageInterface>({
  url: {
    type: String,
    required: true
  }
});

export const ProductImageModel = mongoose.model<ProductImageInterface>('ProductImage', productImageSchema);