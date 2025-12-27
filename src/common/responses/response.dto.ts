export class ErrorResponse {
  statusCode: number;
  message: string;
  timestamp: string;
  path: string;
}

export class SuccessResponse<T> {
  statusCode: number;
  message: string;
  data: T;
  timestamp: string;
}
