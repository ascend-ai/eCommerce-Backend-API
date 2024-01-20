import {
  DEFAULT_PAGINATION_PAGE,
  DEFAULT_PAGINATION_SIZE
} from '../constants';
import { 
  Categories
} from '../enums';
import {
  BaseFilterCriteriaDto
} from './base-filter-criteria.dto';

export class ProductFilterCriteriaDto extends BaseFilterCriteriaDto {
  category: Categories | undefined;
  isPopular: boolean | undefined;
  search: string | undefined;

  constructor(queryParams: Record<string, any> = {
    page: DEFAULT_PAGINATION_PAGE,
    size: DEFAULT_PAGINATION_SIZE,
    category: undefined,
    isPopular: undefined,
    search: undefined
  }) {
    super(queryParams);
    this.category = queryParams?.category || undefined;
    if (queryParams?.isPopular === 'true') {
      this.isPopular = true;
    } else if (queryParams?.isPopular === 'false') {
      this.isPopular = false;
    } else {
      this.isPopular = undefined
    }
    this.search = queryParams?.search || undefined;
  }
}
