import {
  DEFAULT_PAGINATION_PAGE,
  DEFAULT_PAGINATION_SIZE
} from '../constants';
import {
  BaseFilterCriteriaInterface
} from '../interfaces';

export class BaseFilterCriteriaDto implements BaseFilterCriteriaInterface {
  page: number;
  size: number;
  sort: string | undefined;

  constructor(queryParams: Record<string, any> = {
    page: DEFAULT_PAGINATION_PAGE,
    size: DEFAULT_PAGINATION_SIZE,
    sort: undefined
  }) {
    this.page = parseInt(queryParams?.page) || DEFAULT_PAGINATION_PAGE;
    this.size = parseInt(queryParams?.size) || DEFAULT_PAGINATION_SIZE;
    this.sort = queryParams?.sort || undefined;
  }
}
