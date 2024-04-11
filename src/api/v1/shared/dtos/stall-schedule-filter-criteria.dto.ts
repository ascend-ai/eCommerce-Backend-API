import {
  DEFAULT_PAGINATION_PAGE,
  DEFAULT_PAGINATION_SIZE
} from '../constants';
import {
  StallScheduleInterface
} from '../interfaces';
import {
  BaseFilterCriteriaDto
} from './';

export class StallScheduleFilterCriteriaDto extends BaseFilterCriteriaDto implements Partial<StallScheduleInterface> {
  date: number | undefined;

  constructor(queryParams: Record<string, any> = {
    page: DEFAULT_PAGINATION_PAGE,
    size: DEFAULT_PAGINATION_SIZE,
    date: undefined,
  }) {
    super(queryParams);
    this.date = queryParams?.date || undefined;
  }
}