import { Categories } from '../enums';

export interface FilterCriteriaInterface {
  page: number;
  size: number;
  category: Categories | undefined;
  isPopular: boolean | undefined;
  search: string | undefined;
}
