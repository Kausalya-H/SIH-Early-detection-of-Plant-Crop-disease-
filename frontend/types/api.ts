export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  status: number;
  timestamp: string;
}

export interface ApiError {
  message: string;
  detail?: string | Record<string, unknown>;
  statusCode: number;
  timestamp?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
