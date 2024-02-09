import {
  DEFAULT_PAGINATION_PAGE,
  DEFAULT_PAGINATION_SIZE
} from '../constants';
import { 
  Categories
} from '../enums';
import {
  ProductInterface
} from '../interfaces';
import {
  BaseFilterCriteriaDto
} from './base-filter-criteria.dto';

export class ProductFilterCriteriaDto extends BaseFilterCriteriaDto implements Partial<ProductInterface> {
  category: Categories | undefined;
  isPinned: boolean | undefined;
  search: string | undefined;

  constructor(queryParams: Record<string, any> = {
    page: DEFAULT_PAGINATION_PAGE,
    size: DEFAULT_PAGINATION_SIZE,
    category: undefined,
    isPinned: undefined,
    search: undefined
  }) {
    super(queryParams);
    this.category = queryParams?.category || undefined;
    if (queryParams?.isPinned === 'true') {
      this.isPinned = true;
    } else if (queryParams?.isPinned === 'false') {
      this.isPinned = false;
    } else {
      this.isPinned = undefined
    }
    this.search = queryParams?.search || undefined;
  }
}
