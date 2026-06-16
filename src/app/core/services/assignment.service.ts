import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, of, switchMap, throwError } from 'rxjs';
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

@Injectable({ providedIn: 'root' })
export class AssignmentService {
  private readonly http = inject(HttpClient);

  getAssignments(params: ListQueryParams = {}): Observable<ApiResponse<PaginatedResponse<Assignment>>> {
    return this.http.get<ApiResponse<PaginatedResponse<Assignment>>>(
      `${environment.apiUrl}${API_ENDPOINTS.assignments.list}`,
      { params: new HttpParams({ fromObject: buildQueryParams(params) }) }
    );
  }

  getAssignment(id: string): Observable<ApiResponse<Assignment>> {
    return this.http
      .get<ApiResponse<Assignment>>(`${environment.apiUrl}${API_ENDPOINTS.assignments.detail(id)}`)
      .pipe(
        catchError(() =>
          this.getAssignments({ page_size: 500 }).pipe(
            switchMap((response) => {
              const assignment = response.data.items.find((item) => item.id === id);
              if (!assignment) {
                return throwError(() => new Error('Assignment not found'));
              }
              return of({
                success: true,
                message: response.message,
                data: assignment,
              });
            })
          )
        )
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
}
