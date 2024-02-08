import {
  UserInterface
} from '../interfaces';
import { 
  BASE_SORTABLE_COLUMNS
 } from './common.constants';

export const USER_SORTABLE_COLUMNS: readonly (keyof UserInterface)[] = [
  ...BASE_SORTABLE_COLUMNS
] as const;
