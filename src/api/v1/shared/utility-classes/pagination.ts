export class Pagination {
  constructor(public content: Array<any>,
              public totalElements: number,
              public totalPages: number,
              public page: number,
              public size: number) {}
}