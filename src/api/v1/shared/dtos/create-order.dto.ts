import {
  Types
} from 'mongoose';
import {
  OrderInterface,
  PurchaseInterface
} from '../interfaces';
import {
  MIN_ORDERABLE_PRODUCT_QTY
} from '../constants';

export class CreateOrderDto implements Partial<OrderInterface> {
  purchases: Array<PurchaseInterface>;
  isSelfPickup: boolean;

  constructor(reqBody: Record<string, any>) {
    if (!Array.isArray(reqBody?.purchases)) {
      throw new Error(`Invalid format of purchases.`);
    }

    reqBody?.purchases.forEach((purchase: PurchaseInterface) => {
      if (!purchase.hasOwnProperty('productId') ||
          !purchase.hasOwnProperty('productOrderQty') ||
          !purchase.hasOwnProperty('productCustomizationText') ||
          !Types.ObjectId.isValid(purchase.productId) ||
          !(typeof purchase.productOrderQty === 'number') ||
          !(purchase.productOrderQty >= MIN_ORDERABLE_PRODUCT_QTY) ||
          !(typeof purchase.productCustomizationText === 'string')) {
        throw new Error(`Invalid format of purchases.`);
      }
    });

    if (!(reqBody?.purchases.length > 0)) {
      throw new Error(`Purchases not found.`);
    }

    this.purchases = reqBody?.purchases || [];
    this.isSelfPickup = ((typeof reqBody?.isSelfPickup) === 'boolean') ? reqBody?.isSelfPickup : false;
  }
}