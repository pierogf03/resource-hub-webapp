import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, switchMap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import { ApiResponse, ListQueryParams, PaginatedResponse } from '../models/api-response.model';
import {
  Assignment,
  CreateAssignmentRequest,
  GeneratePurchaseOrdersRequest,
  GeneratePurchaseOrdersResponse,
  UpdateAssignmentRequest,
} from '../models/assignment.model';
import { buildQueryParams } from '../utils/query-params.util';

const MAX_LIST_PAGE_SIZE = 100;

@Injectable({ providedIn: 'root' })
export class AssignmentService {
  private readonly http = inject(HttpClient);

  getAssignments(params: ListQueryParams = {}): Observable<ApiResponse<PaginatedResponse<Assignment>>> {
    const safeParams = {
      ...params,
      page_size: Math.min(params.page_size ?? MAX_LIST_PAGE_SIZE, MAX_LIST_PAGE_SIZE),
    };

    return this.http.get<ApiResponse<PaginatedResponse<Assignment>>>(
      `${environment.apiUrl}${API_ENDPOINTS.assignments.list}`,
      { params: new HttpParams({ fromObject: buildQueryParams(safeParams) }) }
    );
  }

  getAssignment(id: string): Observable<ApiResponse<Assignment>> {
    return this.findAssignmentById(id).pipe(
      switchMap((assignment) => {
        if (!assignment) {
          return throwError(() => new Error('Assignment not found'));
        }
        return of({
          success: true,
          message: '',
          data: assignment,
        });
      })
    );
  }

  createAssignment(request: CreateAssignmentRequest): Observable<ApiResponse<Assignment>> {
    return this.http.post<ApiResponse<Assignment>>(
      `${environment.apiUrl}${API_ENDPOINTS.assignments.create}`,
      request
    );
  }

  updateAssignment(id: string, request: UpdateAssignmentRequest): Observable<ApiResponse<Assignment>> {
    return this.http.put<ApiResponse<Assignment>>(
      `${environment.apiUrl}${API_ENDPOINTS.assignments.update(id)}`,
      request
    );
  }

  generateMonthlyPurchaseOrders(
    id: string,
    request: GeneratePurchaseOrdersRequest
  ): Observable<ApiResponse<GeneratePurchaseOrdersResponse>> {
    return this.http.post<ApiResponse<GeneratePurchaseOrdersResponse>>(
      `${environment.apiUrl}${API_ENDPOINTS.assignments.generateMonthlyPurchaseOrders(id)}`,
      request
    );
  }

  private findAssignmentById(id: string, page = 1): Observable<Assignment | null> {
    return this.getAssignments({ page, page_size: MAX_LIST_PAGE_SIZE }).pipe(
      switchMap((response) => {
        const items = Array.isArray(response.data?.items) ? response.data.items : [];
        const found = items.find((item) => item.id === id);
        if (found) {
          return of(found);
        }

        const total = response.data?.total ?? 0;
        const fetchedCount = page * MAX_LIST_PAGE_SIZE;
        if (fetchedCount < total && items.length > 0) {
          return this.findAssignmentById(id, page + 1);
        }

        return of(null);
      })
    );
  }
}
