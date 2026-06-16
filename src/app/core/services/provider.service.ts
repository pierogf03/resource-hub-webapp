import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import { ApiResponse, ListQueryParams, PaginatedResponse } from '../models/api-response.model';
import { CreateProviderRequest, Provider, UpdateProviderRequest } from '../models/provider.model';
import { buildQueryParams } from '../utils/query-params.util';

@Injectable({ providedIn: 'root' })
export class ProviderService {
  private readonly http = inject(HttpClient);

  getProviders(params: ListQueryParams = {}): Observable<ApiResponse<PaginatedResponse<Provider>>> {
    return this.http.get<ApiResponse<PaginatedResponse<Provider>>>(
      `${environment.apiUrl}${API_ENDPOINTS.providers.list}`,
      { params: new HttpParams({ fromObject: buildQueryParams(params) }) }
    );
  }

  createProvider(request: CreateProviderRequest): Observable<ApiResponse<Provider>> {
    return this.http.post<ApiResponse<Provider>>(
      `${environment.apiUrl}${API_ENDPOINTS.providers.create}`,
      request
    );
  }

  updateProvider(id: string, request: UpdateProviderRequest): Observable<ApiResponse<Provider>> {
    return this.http.put<ApiResponse<Provider>>(
      `${environment.apiUrl}${API_ENDPOINTS.providers.update(id)}`,
      request
    );
  }
}
