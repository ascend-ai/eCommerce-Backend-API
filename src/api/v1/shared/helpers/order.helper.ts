import {
  OrderModel
} from '../../data-models';
import {
  PENDING_ORDER_DELETION_DELAY
} from '../constants';
import {
  OrderStatus
} from '../enums';

/**
 * Delets orders which are still pending past the delay time.
 */
export const deletePendingOrdersPastDelay = async (): Promise<void> => {
  const currentTime = new Date();
  const delayAgoTime = new Date(currentTime.getTime() - PENDING_ORDER_DELETION_DELAY);
  await OrderModel.deleteMany({
    $and: [
      { status: OrderStatus.PENDING },
      { whenCreated: { $lte: delayAgoTime } }
    ]
  });
  console.log(`Pending orders created past ${delayAgoTime} deleted`.grey);
}
