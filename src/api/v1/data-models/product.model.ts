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
  PRODUCT_DESCRIPTION_LENGTH_RANGE,
  PRODUCT_NAME_LENGTH_RANGE,
  ProductInterface
} from '../shared';

const productSchema = new mongoose.Schema<ProductInterface>({
  name: {
    type: String,
    minlength: PRODUCT_NAME_LENGTH_RANGE.MIN,
    maxlength: PRODUCT_NAME_LENGTH_RANGE.MAX,
    required: true,
  },
  description: {
    type: String,
    validate: {
      validator: function (value: string) {
        return (value?.length === 0) ||
               (value?.length >= PRODUCT_DESCRIPTION_LENGTH_RANGE.MIN &&
                value?.length <= PRODUCT_DESCRIPTION_LENGTH_RANGE.MAX);
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
    enum: Object.values(Categories).filter(value => typeof value === 'string'),
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
  customizationTextRange: {
    min: {
      type: Number,
      default: 0,
      validate: function(this: ProductInterface) {
        const bothMinAndMaxNotAvailable: boolean = !this.customizationTextRange.min &&
                                                   !this.customizationTextRange.max;
        const bothValidMinAndMaxAvailable: boolean = !!this.customizationTextRange.min &&
                                                     !!this.customizationTextRange.max &&
                                                     this.customizationTextRange.min > 0 &&
                                                     this.customizationTextRange.min <= this.customizationTextRange.max;

        return (bothMinAndMaxNotAvailable) || (bothValidMinAndMaxAvailable);
      },
    },
    max: {
      type: Number,
      default: 0,
      validate: function(this: ProductInterface) {
        const bothMinAndMaxNotAvailable: boolean = !this.customizationTextRange.min &&
                                                   !this.customizationTextRange.max;
        const bothValidMinAndMaxAvailable: boolean = !!this.customizationTextRange.min &&
                                                     !!this.customizationTextRange.max &&
                                                     this.customizationTextRange.min > 0 &&
                                                     this.customizationTextRange.min <= this.customizationTextRange.max;

        return (bothMinAndMaxNotAvailable) || (bothValidMinAndMaxAvailable);
      }
    }
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
