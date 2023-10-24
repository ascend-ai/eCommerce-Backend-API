import mongoose from 'mongoose';
import { ProductCategoryInterface, ProductImageInterface } from '../shared';

const productCategorySchema = new mongoose.Schema<ProductCategoryInterface>({
  isPopular: {
    type: Boolean,
    required: true
  },
  name: {
    type: String,
    required: true
  }
});

export const ProductCategoryModel = mongoose.model<ProductCategoryInterface>('ProductCategory', productCategorySchema);