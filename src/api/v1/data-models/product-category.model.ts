import mongoose from 'mongoose';
import { ProductCategoryInterface } from '../shared';

const productCategorySchema = new mongoose.Schema<ProductCategoryInterface>({
  name: {
    type: String,
    required: true,
    unique: true,
    match: /^(?!_)(?!.*__)(?!.*_$)[a-z_]+$/,
  }
});

export const ProductCategoryModel = mongoose.model<ProductCategoryInterface>('ProductCategory', productCategorySchema);