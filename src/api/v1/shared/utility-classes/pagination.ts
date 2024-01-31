import {
  SortDirection
} from '../enums';

export class Pagination {
  constructor(public content: Array<any>,
              public totalElements: number,
              public totalPages: number,
              public page: number,
              public size: number,
              public sortColumn: string,
              public sortDirection: SortDirection) {}
}