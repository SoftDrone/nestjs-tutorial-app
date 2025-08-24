export class PaginationResponseDto<T> {
  page: number;
  limit: number;
  total: number;
  data: T[];
}