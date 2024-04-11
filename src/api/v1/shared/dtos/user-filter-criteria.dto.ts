import {
  DEFAULT_PAGINATION_PAGE,
  DEFAULT_PAGINATION_SIZE
} from '../constants';
import {
  UserRole
} from '../enums';
import {
  UserInterface
} from '../interfaces';
import {
  BaseFilterCriteriaDto
} from './';

export class UserFilterCriteriaDto extends BaseFilterCriteriaDto implements Partial<UserInterface> {
  role: UserRole | undefined;
  search: string | undefined;

  constructor(queryParams: Record<string, any> = {
    page: DEFAULT_PAGINATION_PAGE,
    size: DEFAULT_PAGINATION_SIZE,
    role: undefined,
    search: undefined,
  }) {
    super(queryParams);
    this.role = queryParams?.role || undefined;
    this.search = queryParams?.search || undefined;
  }
}
