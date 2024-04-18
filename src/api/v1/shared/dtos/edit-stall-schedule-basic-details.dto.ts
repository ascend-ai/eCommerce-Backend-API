import {
  OrderStatus,
  StallScheduleInterface,
  TrackingResourceInterface
} from '../../shared';

export class EditStallScheduleBasicDetailsDto implements Partial<StallScheduleInterface> {
  venue: string;
  date: number;
  openingTime: number;
  closingTime: number;

  constructor(reqBody: Record<string, any>) {
    this.venue = reqBody?.venue || '';
    this.date = reqBody?.date || null;
    this.openingTime = reqBody?.openingTime || null;
    this.closingTime = reqBody?.closingTime || null;
  }
}
