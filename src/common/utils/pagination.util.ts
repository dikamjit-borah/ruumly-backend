/**
 * Utility functions for pagination
 */

export interface PaginationQuery {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class PaginationUtil {
  static paginate(page: number = 1, limit: number = 10) {
    const pageNum = Math.max(1, page);
    const limitNum = Math.max(1, Math.min(limit, 100));
    const offset = (pageNum - 1) * limitNum;

    return {
      offset,
      limit: limitNum,
      page: pageNum,
    };
  }

  static formatResponse<T>(
    data: T[],
    total: number,
    page: number,
    limit: number,
  ): PaginatedResponse<T> {
    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
