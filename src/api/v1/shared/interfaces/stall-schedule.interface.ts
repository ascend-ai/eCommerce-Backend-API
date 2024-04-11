import {
  BaseModelInterface
} from './base-model.interface';

export interface StallScheduleInterface extends BaseModelInterface {
  venue: string;
  date: number;
  openingTime: number;
  closingTime: number;
}
