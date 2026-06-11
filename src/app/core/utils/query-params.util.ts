import { ListQueryParams } from '../models/api-response.model';

export function buildQueryParams(params: ListQueryParams): Record<string, string> {
  const result: Record<string, string> = {};
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      result[key] = String(value);
    }
  });
  return result;
}
