import { 
  SortDirection
} from '../enums';
import {
  BaseModelInterface
} from '../interfaces';

export const SORT_STRING_REGEX = /^[a-zA-Z]+,(asc|desc)$/;

export const BASE_SORTABLE_COLUMNS: readonly (keyof BaseModelInterface)[] = [
  'whenCreated',
  'whenLastUpdated',
] as const;

export const DEFAULT_SORT_COLUMN: (keyof BaseModelInterface) = BASE_SORTABLE_COLUMNS[0];

export const DEFAULT_SORT_DIRECTION: SortDirection  = SortDirection.desc;
