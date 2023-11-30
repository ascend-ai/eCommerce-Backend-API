import mongoose from 'mongoose';

import {
  PRODUCT_CATEGORY_NAME_REGEX,
  ProductCategoryInterface
} from '../shared';

const productCategorySchema = new mongoose.Schema<ProductCategoryInterface>({
  name: {
    type: String,
    required: true,
    unique: true,
    match: PRODUCT_CATEGORY_NAME_REGEX,
  }
});

export const ProductCategoryModel = mongoose.model<ProductCategoryInterface>('ProductCategory', productCategorySchema);