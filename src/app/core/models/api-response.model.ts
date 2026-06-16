export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
}

export interface FieldError {
  field: string;
  message: string;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: FieldError[];
}

export interface ListQueryParams {
  search?: string;
  page?: number;
  page_size?: number;
  is_active?: boolean;
  status?: string;
  provider_id?: string;
  initiative_id?: string;
  expiration_alert?: string;
  manager_id?: string;
  assignment_id?: string;
  period_from?: string;
  period_to?: string;
}
