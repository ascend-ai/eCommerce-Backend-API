import { DEFAULT_PAGINATION_PAGE, DEFAULT_PAGINATION_SIZE } from '../constants';
import { OrderStatus } from '../enums';
import { BaseFilterCriteriaDto } from './base-filter-criteria.dto';

export class OrderFilterCriteriaDto extends BaseFilterCriteriaDto {
  status: OrderStatus | undefined;

  constructor(queryParams: Record<string, any> = {
    page: DEFAULT_PAGINATION_PAGE,
    size: DEFAULT_PAGINATION_SIZE,
    status: undefined,
  }) {
    super(queryParams);
    this.status = queryParams?.status || undefined;
  }
}