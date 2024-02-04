import {
  OrderInterface
} from '../interfaces';

export class CreateOrderDto implements Partial<OrderInterface> {
  purchases: Map<string, number>;
  isSelfPickup: boolean;

  constructor(reqBody: Record<string, any>) {
    if (!(typeof reqBody?.purchases === 'object' &&
        reqBody?.purchases !== null &&
        !Array.isArray(reqBody?.purchases))) {
      throw new Error(`Invalid format of purchases.`);
    }

    if (!(Object.entries(reqBody?.purchases).length > 0)) {
      throw new Error(`Purchases not found.`);
    }

    this.purchases = reqBody?.purchases || {};
    this.isSelfPickup = ((typeof reqBody?.isSelfPickup) === 'boolean') ? reqBody?.isSelfPickup : false;
  }
}