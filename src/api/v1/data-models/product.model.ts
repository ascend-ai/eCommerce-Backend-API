import mongoose, {
  CallbackWithoutResultAndOptionalError,
  Schema
} from 'mongoose';

import {
  Categories,
  MAX_IMAGES_PER_PRODUCT,
  MIN_IMAGES_PER_PRODUCT,
  MIN_PRODUCT_PRICE,
  MIN_QTY_IN_STOCK,
  ProductInterface
} from '../shared';

const productSchema = new mongoose.Schema<ProductInterface>({
  name: {
    type: String,
    minlength: 3,
    maxlength: 200,
    required: true,
  },
  description: {
    type: String,
    validate: {
      validator: function (value: string) {
        return (value?.length === 0) || (value?.length >= 5 && value?.length <= 1000);
      },
      message: 'Description should be minimum 5 and maximum 1000 characters long.'
    }
  },
  isPinned: {
    type: Boolean,
    default: false
  },
  maxRetailPrice: {
    type: Number,
    validate: {
      validator: function (value: number) {
        return value >= MIN_PRODUCT_PRICE;
      },
      message: `Max retail price cannot be less than ${MIN_PRODUCT_PRICE}.`,
    },
    required: true
  },
  sellingPrice: {
    type: Number,
    validate: {
      validator: function (this: ProductInterface) {
        return this.sellingPrice >= MIN_PRODUCT_PRICE &&
               this.sellingPrice <= this.maxRetailPrice;
      },
      message: `Selling price cannot be less than ${MIN_PRODUCT_PRICE} & no more than max retail price.`,
    },
    required: true
  },
  quantityInStock: {
    type: Number,
    validate: {
      validator: function (value: number) {
        return value >= MIN_QTY_IN_STOCK;
      },
      message: `Quantity cannot be less than ${MIN_QTY_IN_STOCK}.`,
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
      validator: function (this: ProductInterface) {
        return this.images.length <= MAX_IMAGES_PER_PRODUCT &&
               this.images.length >= MIN_IMAGES_PER_PRODUCT;
      },
      message: `The images array should contain no less than ${MIN_IMAGES_PER_PRODUCT} & no more than ${MAX_IMAGES_PER_PRODUCT} images.`,
    },
  },
  category: {
    type: String,
    enum: [
      Categories.ANKLET,
      Categories.BODY_JEWELLERY,
      Categories.BRACELET,
      Categories.EARRING,
      Categories.NECKLACE,
      Categories.OTHERS,
      Categories.PHONE_STRAP,
    ],
    default: Categories.OTHERS
  },
  similarProducts: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Product'
    }
  ],
  totalPurchases: {
    type: Number,
    default: 0
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

productSchema.pre('updateOne', { document: true, query: false }, function (next: CallbackWithoutResultAndOptionalError) {
  this.whenLastUpdated = Date.now();
  next();
});


export const ProductModel = mongoose.model<ProductInterface>('Product', productSchema);
