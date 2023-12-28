import { DEFAULT_PAGINATION_PAGE, DEFAULT_PAGINATION_SIZE } from '../constants';
import { Categories } from '../enums';
import { FilterCriteriaInterface } from '../interfaces';

export class FilterCriteriaDto implements FilterCriteriaInterface {
  page: number;
  size: number;
  category: Categories | undefined;
  isPopular: boolean | undefined;
  search: string | undefined;

  constructor(params: Record<string, any> = {
    page: DEFAULT_PAGINATION_PAGE,
    size: DEFAULT_PAGINATION_SIZE,
    category: undefined,
    isPopular: undefined,
    search: undefined
  }) {
    this.page = parseInt(params?.page) || DEFAULT_PAGINATION_PAGE;
    this.size = parseInt(params?.size) || DEFAULT_PAGINATION_SIZE;
    this.category = params?.category || undefined;
    if (params?.isPopular === 'true') {
      this.isPopular = true;
    } else if (params?.isPopular === 'false') {
      this.isPopular = false;
    } else {
      this.isPopular = undefined
    }
    this.search = params?.search || undefined;
  }
}
