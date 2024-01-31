import { 
  SortDirection
} from '../enums';

export const SORT_STRING_REGEX = /^[a-zA-Z]+,(asc|desc)$/;

export const BASE_SORTABLE_COLUMNS: readonly string[] = Object.freeze([
  'whenCreated',
  'whenLastUpdated',
]);

export const DEFAULT_SORT_COLUMN: string = BASE_SORTABLE_COLUMNS[0];

export const DEFAULT_SORT_DIRECTION: SortDirection  = SortDirection.desc;
