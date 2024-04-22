import {
  StallScheduleInterface
} from '../interfaces';
import {
  BASE_SORTABLE_COLUMNS
} from './common.constants';

export const STALL_SCHEDULE_VENUE_LENGTH_RANGE = {
  MIN: 5,
} as const;

export const STALL_SCHEDULE_SORTABLE_COLUMNS: readonly (keyof StallScheduleInterface)[] = [
  ...BASE_SORTABLE_COLUMNS,
  'date',
] as const;