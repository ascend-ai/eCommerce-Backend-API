import {
  NextFunction,
  Response
} from 'express';
import mongoose, {
  ClientSession,
  FilterQuery,
  Types
} from 'mongoose';
import Razorpay from 'razorpay';

import {
  ACCEPTED_CURRENCY,
  CreateOrderDto,
  CustomError,
  CustomSuccess,
  DEFAULT_SORT_COLUMN,
  DEFAULT_SORT_DIRECTION,
  GetUserAuthInfoRequestInterface,
  INR_SUBUNIT,
  MIN_ORDERABLE_PRODUCT_QTY,
  NO_SHIPPING_CHARGE_THRESHOLD,
  ORDER_SORTABLE_COLUMNS,
  OrderDocument,
  OrderFilterCriteriaDto,
  OrderStatus,
  Pagination,
  SHIPPING_CHARGE,
  SortDirection,
  UserDocument,
  UserRole,
  generateHmacSha256,
  isSortStringValid,
  retrieveSortInfo
} from '../shared';
import {
  razorpayConfig
} from '../../../config';
import {
  OrderModel,
  ProductModel
} from '../data-models';

export const createOrder = async (req: GetUserAuthInfoRequestInterface, res: Response, next: NextFunction) => {
  const session: ClientSession = await mongoose.startSession();
  session.startTransaction();
  try {

    const orderData = new CreateOrderDto(req.body);

    let purchaseAmount: number = 0;

    for (let [key, value] of Object.entries(orderData.purchases)) {
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

      product.totalPurchases += productOrderQty;

      purchaseAmount += (productOrderQty * product.sellingPrice);

      await product.save({ session });
    };

    const isShippingChargeApplicable: boolean =  !orderData.isSelfPickup && (purchaseAmount < NO_SHIPPING_CHARGE_THRESHOLD);
    const shippingCharge: number = isShippingChargeApplicable ? SHIPPING_CHARGE : 0;
    
    const razorpay = new Razorpay(razorpayConfig);
    const razorpayAmount = (purchaseAmount + shippingCharge) * INR_SUBUNIT;
    const razorpayOrder = await razorpay.orders.create({
      amount: razorpayAmount,
      currency: ACCEPTED_CURRENCY,
      payment_capture: false
    });

    const order = new OrderModel({
      user: req.loggedInUser?._id,
      razorpayOrderId: razorpayOrder.id,
      purchases: orderData.purchases,
      isSelfPickup: orderData.isSelfPickup,
      purchaseAmount,
      shippingCharge
    });

    await order.save({ session });

    await session.commitTransaction();
    await session.endSession();
    return next(new CustomSuccess(order, 200));

  } catch (error: any) {

    await session.abortTransaction();
    await session.endSession();
    return next(new CustomError(error.message, 400));
  }
};

export const getAllOrders = async (req: GetUserAuthInfoRequestInterface, res: Response, next: NextFunction) => {
  try {
    const {
      page,
      size,
      sort,
      status
    } = new OrderFilterCriteriaDto(req.query);

    const filterQuery: FilterQuery<OrderDocument> = {};
    const $andFilterQueryList: Array<FilterQuery<OrderDocument>> = [];
    let sortColumn: string = DEFAULT_SORT_COLUMN;
    let sortDirection: SortDirection = DEFAULT_SORT_DIRECTION;

    if (status) {
      $andFilterQueryList.push({ status });
    }

    if (typeof sort === 'string' && sort.length > 0) {
      if (isSortStringValid(sort, ORDER_SORTABLE_COLUMNS)) {
        ({ sortColumn, sortDirection } = retrieveSortInfo(sort));
      } else {
        throw new Error(`Sort string is of invalid format.`);
      }
    }

    if ($andFilterQueryList.length > 0) {
      filterQuery['$and'] = $andFilterQueryList;
    }

    const totalElements = await OrderModel.countDocuments(filterQuery);

    let totalPages = Math.floor(totalElements / size);
    if ((totalElements % size) > 0) {
      totalPages += 1;
    }

    const orders = await OrderModel
      .find(filterQuery)
      .skip(page * size)
      .limit(size)
      .sort({
        [sortColumn]: sortDirection
      })
      .populate('user');

    const pagination = new Pagination(
      orders,
      totalElements,
      totalPages,
      page,
      size,
      sortColumn,
      sortDirection
    );

    return next(new CustomSuccess(pagination, 200));
  } catch (error: any) {
    return next(new CustomError(error.message, 500));
  }
};

export const getOrdersSpecificToUser = async (req: GetUserAuthInfoRequestInterface, res: Response, next: NextFunction) => {
  try {
    let { userId }: any = req.params;
    userId = new Types.ObjectId(userId);

    const isLoggedInUserAdminOrMod: boolean =  [
      UserRole.ADMIN,
      UserRole.MODERATOR
    ].includes((<UserDocument>req.loggedInUser)?.role);

    const isLoggedInUserSelf: boolean = (<UserDocument>req.loggedInUser)?._id.equals(userId);

    if (isLoggedInUserAdminOrMod || isLoggedInUserSelf) {
      const {
        page,
        size,
        sort,
        status
      } = new OrderFilterCriteriaDto(req.query);
  
      const filterQuery: FilterQuery<OrderDocument> = {};
      const $andFilterQueryList: Array<FilterQuery<OrderDocument>> = [];
      let sortColumn: string = DEFAULT_SORT_COLUMN;
      let sortDirection: SortDirection = DEFAULT_SORT_DIRECTION;

      $andFilterQueryList.push({ user: userId });
  
      if (status) {
        $andFilterQueryList.push({ status });
      } else {
        $andFilterQueryList.push({ status: { $ne: OrderStatus.PENDING } })
      }
  
      if (typeof sort === 'string' && sort.length > 0) {
        if (isSortStringValid(sort, ORDER_SORTABLE_COLUMNS)) {
          ({ sortColumn, sortDirection } = retrieveSortInfo(sort));
        } else {
          throw new Error(`Sort string is of invalid format.`);
        }
      }
  
  
      if ($andFilterQueryList.length > 0) {
        filterQuery['$and'] = $andFilterQueryList;
      }
  
      const totalElements = await OrderModel.countDocuments(filterQuery);
  
      let totalPages = Math.floor(totalElements / size);
      if ((totalElements % size) > 0) {
        totalPages += 1;
      }
  
      const orders = await OrderModel
        .find(filterQuery)
        .skip(page * size)
        .limit(size)
        .sort({
          [sortColumn]: sortDirection
        })
        .populate('user');
  
      const pagination = new Pagination(
        orders,
        totalElements,
        totalPages,
        page,
        size,
        sortColumn,
        sortDirection
      );
  
      return next(new CustomSuccess(pagination, 200));
    } else {
      return next(new CustomError(`Unauthorized access`, 401))
    }
  } catch (error: any) {
    return next(new CustomError(error.message, 500));
  }
};

export const getOrder = async (req: GetUserAuthInfoRequestInterface, res: Response, next: NextFunction) => {
  try {
    let { orderId }: any = req.params;
    orderId = new Types.ObjectId(orderId);

    const order = await OrderModel
      .findById(orderId)
      .populate('user');

    if (!order) {
      throw new Error(`Order with id ${orderId} not found`);
    }

    const userId = order.user._id;

    const isLoggedInUserAdminOrMod: boolean =  [
      UserRole.ADMIN,
      UserRole.MODERATOR
    ].includes((<UserDocument>req.loggedInUser)?.role);

    const doesOrderBelongsToLoggedInUser: boolean = (<UserDocument>req.loggedInUser)?._id.equals(userId);

    if (isLoggedInUserAdminOrMod || doesOrderBelongsToLoggedInUser) {
      return next(new CustomSuccess(order, 200));
    } else {
      return next(new CustomError(`Unauthorized access`, 401));
    }
  } catch (error: any) {
    return next(new CustomError(error.message, 500));
  }
};

export const updateOrderStatus = async (req: GetUserAuthInfoRequestInterface, res: Response, next: NextFunction) => {
  try {
    const acceptableOrderStatusList: Array<OrderStatus> = [
      OrderStatus.PLACED,
      OrderStatus.CONFIRMED,
      OrderStatus.SHIPPED,
      OrderStatus.DELIVERED,
    ];
    const { status } = req.body;

    if (!status) {
      throw new Error('New status not present');
    }

    if (!acceptableOrderStatusList.includes(status)) {
      throw new Error('Invalid status');
    }

    let { orderId }: any = req.params;
    orderId = new Types.ObjectId(orderId);

    const order = await OrderModel
      .findById(orderId)
      .populate('user');

    if (!order) {
      throw new Error(`Order with id ${orderId} not found`);
    }

    order.status = status;

    await order.save();

    return next(new CustomSuccess(order, 200));
  } catch (error: any) {
    return next(new CustomError(error.message, 500));
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

      const order: OrderDocument = <OrderDocument>(await OrderModel.findOne({
        razorpayOrderId: razorpay_order_id
      }));

      order.status = OrderStatus.PLACED;
      order.razorpayPaymentId = razorpay_payment_id;
      order.razorpaySignature = razorpay_signature;
      await order.save();

      return res.redirect(

        // * Redirecting to frontend success page
        `${FRONTEND_URL}/orders/${order?._id}`

      );
    } else {
      throw new Error(`Payment failed`);
    }
  } catch (error: any) {
    return next(new CustomError(error.message, 400));
  }
};
