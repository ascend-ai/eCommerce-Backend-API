import {
  NextFunction,
  Response
} from 'express';
import {
  Types
} from 'mongoose';
import Razorpay from 'razorpay';

import {
  ACCEPTED_CURRENCY,
  CustomError,
  CustomSuccess,
  GetUserAuthInfoRequestInterface,
  MIN_ORDERABLE_PRODUCT_QTY
} from '../shared';
import { razorpayConfig } from '../../../config';
import { OrderModel, ProductModel } from '../data-models';

export const createOrder = async (req: GetUserAuthInfoRequestInterface, res: Response, next: NextFunction) => {
  try {

    const purchases: Record<string, string> = req.body;

    if (!(typeof purchases === 'object' &&
        purchases !== null &&
        !Array.isArray(purchases))) {
      throw new Error(`Invalid format of purchases.`);
    }

    if (!(Object.entries(purchases).length > 0)) {
      throw new Error(`Purchases not found.`);
    }

    let totalPurchaseAmount: number = 0;

    for (let [key, value] of Object.entries(purchases)) {
      const productId = new Types.ObjectId(key);
      const productOrderQty = parseInt(value);

      if (!(!Number.isNaN(productOrderQty) &&
          productOrderQty >= MIN_ORDERABLE_PRODUCT_QTY)) {
        throw new Error(`Invalid order quantity for product with id ${productId}.`);
      }

      const product = await ProductModel.findById(productId);

      if (!product) {
        throw new Error(`Product with id ${productId} not found.`);
      }

      if (productOrderQty > product.quantityInStock) {
        throw new Error(`Insufficient quantity of product with id ${productId} in stock.`);
      }

      totalPurchaseAmount += (productOrderQty * product.price);
    };

    const razorpay = new Razorpay(razorpayConfig);
    const razorpayOrder = await razorpay.orders.create({
      amount: totalPurchaseAmount,
      currency: ACCEPTED_CURRENCY
    });

    const order = new OrderModel({
      user: req.loggedInUser?._id,
      razorpayOrderId: razorpayOrder.id,
      purchases,
    });

    await order.save();
    return next(new CustomSuccess(order, 200));

  } catch (error: any) {
    return next(new CustomError(error.message, 400));
  }
};

export const verifyOrderPayment = async (req: GetUserAuthInfoRequestInterface, res: Response, next: NextFunction) => {
  try {

    return next(new CustomSuccess(null, 200));
  } catch (error: any) {
    return next(new CustomError(error.message, 400));
  }
};
