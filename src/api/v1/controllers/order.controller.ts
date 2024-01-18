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
  INR_SUBUNIT,
  MIN_ORDERABLE_PRODUCT_QTY,
  OrderDocument,
  OrderStatus,
  generateHmacSha256
} from '../shared';
import {
  razorpayConfig
} from '../../../config';
import {
  OrderModel,
  ProductModel
} from '../data-models';

export const createOrder = async (req: GetUserAuthInfoRequestInterface, res: Response, next: NextFunction) => {
  try {

    const purchases: Record<string, number> = req.body;

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
      const productOrderQty = value;

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
      amount: totalPurchaseAmount * INR_SUBUNIT,
      currency: ACCEPTED_CURRENCY,
      payment_capture: false
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
    const { FRONTEND_URL, RAZORPAY_SECRET } = <Record<string, string>>process.env;
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = generateHmacSha256(body, RAZORPAY_SECRET);

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {

      // * Capturing payment manually
      const razorpay = new Razorpay(razorpayConfig);
      const razorpayOrder = await razorpay.orders.fetch(razorpay_order_id);
      await razorpay.payments.capture(
        razorpay_payment_id,
        razorpayOrder.amount,
        razorpayOrder.currency
      );

      const order: OrderDocument | null = await OrderModel.findOne({
        razorpayOrderId: razorpay_order_id
      });

      if (order) {
        order.status = OrderStatus.PLACED;
        order.razorpayPaymentId = razorpay_payment_id;
        order.razorpaySignature = razorpay_signature;
        await order.save();
      }

      return res.redirect(

        // * Redirecting to frontend success page
        `${FRONTEND_URL}/payment-success?reference=${razorpay_payment_id}`

      );
    } else {
      throw new Error(`Payment failed`);
    }
  } catch (error: any) {
    return next(new CustomError(error.message, 400));
  }
};
