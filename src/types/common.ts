export type SortDirection = 'asc' | 'desc';

export interface PaginationParams {
  page: number;
  pageSize: number;
  total: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationParams;
}

export interface SelectOption<T = string> {
  label: string;
  value: T;
  hint?: string;
  disabled?: boolean;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ToastMessage {
  id: string;
  type: 'info' | 'ok' | 'warn' | 'error';
  message: string;
  duration?: number;
}

