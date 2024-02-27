import {
  OrderInterface,
  OrderStatus,
  TrackingResourceInterface
} from '../../shared';

export class EditOrderBasicDetailsDto implements Partial<OrderInterface> {
  status: OrderStatus;
  trackingResource: TrackingResourceInterface;

  constructor(reqBody: Record<string, any>) {
    this.status = reqBody?.status || OrderStatus.PLACED;
    this.trackingResource = reqBody?.trackingResource || {};
    this.trackingResource.trackingId = reqBody?.trackingResource?.trackingId || '';
    this.trackingResource.trackingUrl = reqBody?.trackingResource?.trackingUrl || '';
  }
}
