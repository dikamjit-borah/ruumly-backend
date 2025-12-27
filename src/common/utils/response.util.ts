/**
 * API Response Interceptor
 * Wraps all responses in a consistent format
 * Can be applied globally or to specific routes
 */

export interface ApiResponse<T = any> {
  statusCode: number;
  message: string;
  data?: T;
  timestamp: string;
  path?: string;
}

export class ResponseFormatterUtil {
  static success<T>(
    data: T,
    message: string = 'Success',
    statusCode: number = 200,
  ): ApiResponse<T> {
    return {
      statusCode,
      message,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  static created<T>(data: T, message: string = 'Created successfully'): ApiResponse<T> {
    return this.success(data, message, 201);
  }

  static error(message: string, statusCode: number = 500, path?: string): ApiResponse {
    return {
      statusCode,
      message,
      timestamp: new Date().toISOString(),
      ...(path && { path }),
    };
  }
}
