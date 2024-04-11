import {
  StallScheduleInterface
} from '../interfaces';
import {
  BASE_SORTABLE_COLUMNS
} from './common.constants';

export const STALL_SCHEDULE_SORTABLE_COLUMNS: readonly (keyof StallScheduleInterface)[] = [
  ...BASE_SORTABLE_COLUMNS,
  'date',
] as const;