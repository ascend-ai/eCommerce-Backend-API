import mongoose, { Schema } from 'mongoose';
import { ProductInterface } from '../shared';

const productSchema = new mongoose.Schema<ProductInterface>({
  name: {
    type: String,
    minlength: 3,
    maxlength: 200,
    required: true,
  },
  description: {
    type: String,
    minlength: 5,
    maxlength: 1000,
  },
  quantityInStock: {
    type: Number,
    validate: {
      validator: function (value: number) {
        return value >= 0;
      },
      message: 'Quantity cannot be less than 0.',
    },
    required: true,
  },
  images: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: 'ProductImage',
      },
    ],
    validate: {
      validator: function (value: Array<any>) {
        return value.length <= 3;
      },
      message: 'The images array should contain no more than 3 elements.',
    },
  },
  categories: [
    {
      type: Schema.Types.ObjectId,
      ref: 'ProductCategory',
    }
  ],
});


export const ProductModel = mongoose.model<ProductInterface>('Product', productSchema);