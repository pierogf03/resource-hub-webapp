import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import { ApiResponse, ListQueryParams, PaginatedResponse } from '../models/api-response.model';
import { CreateInitiativeRequest, Initiative, UpdateInitiativeRequest } from '../models/initiative.model';
import { buildQueryParams } from '../utils/query-params.util';

@Injectable({ providedIn: 'root' })
export class InitiativeService {
  private readonly http = inject(HttpClient);

  getInitiatives(params: ListQueryParams = {}): Observable<ApiResponse<PaginatedResponse<Initiative>>> {
    return this.http.get<ApiResponse<PaginatedResponse<Initiative>>>(
      `${environment.apiUrl}${API_ENDPOINTS.initiatives.list}`,
      { params: new HttpParams({ fromObject: buildQueryParams(params) }) }
    );
  }

  createInitiative(request: CreateInitiativeRequest): Observable<ApiResponse<Initiative>> {
    return this.http.post<ApiResponse<Initiative>>(
      `${environment.apiUrl}${API_ENDPOINTS.initiatives.create}`,
      request
    );
  }

  updateInitiative(id: string, request: UpdateInitiativeRequest): Observable<ApiResponse<Initiative>> {
    return this.http.put<ApiResponse<Initiative>>(
      `${environment.apiUrl}${API_ENDPOINTS.initiatives.update(id)}`,
      request
    );
  }
}
