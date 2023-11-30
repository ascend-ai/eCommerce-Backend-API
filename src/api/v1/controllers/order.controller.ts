import {
  NextFunction,
  Response
} from 'express';
import mongoose, { ClientSession } from 'mongoose';

import { ACCEPTED_CURRENCY, CustomError, CustomSuccess, GetUserAuthInfoRequestInterface } from '../shared';
import Razorpay from 'razorpay';
import { razorpayConfig } from '../../../config';

export const createOrder = async (req: GetUserAuthInfoRequestInterface, res: Response, next: NextFunction) => {
  const session: ClientSession = await mongoose.startSession();
  session.startTransaction();
  try {
    
    // const razorpay = new Razorpay(razorpayConfig);
    // const order = await razorpay.orders.create({
    //   amount: 50000,
    //   currency: ACCEPTED_CURRENCY
    // });

    await session.endSession();
    return next(new CustomSuccess(null, 200));

  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();
    return next(new CustomError(error.message, 400));
  }
};
