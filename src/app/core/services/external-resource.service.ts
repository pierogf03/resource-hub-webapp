import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import { ApiResponse, ListQueryParams, PaginatedResponse } from '../models/api-response.model';
import {
  CreateExternalResourceRequest,
  ExternalResource,
  UpdateExternalResourceRequest,
} from '../models/external-resource.model';
import { buildQueryParams } from '../utils/query-params.util';

@Injectable({ providedIn: 'root' })
export class ExternalResourceService {
  private readonly http = inject(HttpClient);

  getExternalResources(
    params: ListQueryParams = {}
  ): Observable<ApiResponse<PaginatedResponse<ExternalResource>>> {
    return this.http.get<ApiResponse<PaginatedResponse<ExternalResource>>>(
      `${environment.apiUrl}${API_ENDPOINTS.externalResources.list}`,
      { params: new HttpParams({ fromObject: buildQueryParams(params) }) }
    );
  }

  createExternalResource(
    request: CreateExternalResourceRequest
  ): Observable<ApiResponse<ExternalResource>> {
    return this.http.post<ApiResponse<ExternalResource>>(
      `${environment.apiUrl}${API_ENDPOINTS.externalResources.create}`,
      request
    );
  }

  updateExternalResource(
    id: string,
    request: UpdateExternalResourceRequest
  ): Observable<ApiResponse<ExternalResource>> {
    return this.http.put<ApiResponse<ExternalResource>>(
      `${environment.apiUrl}${API_ENDPOINTS.externalResources.update(id)}`,
      request
    );
  }
}
