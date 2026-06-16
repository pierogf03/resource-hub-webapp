import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import { ApiResponse } from '../models/api-response.model';
import { DashboardSummary, ExpiringResource } from '../models/dashboard.model';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly http = inject(HttpClient);

  getSummary(): Observable<ApiResponse<DashboardSummary>> {
    return this.http.get<ApiResponse<DashboardSummary>>(
      `${environment.apiUrl}${API_ENDPOINTS.dashboard.summary}`
    );
  }

  getExpiringResources(): Observable<ApiResponse<ExpiringResource[]>> {
    return this.http.get<ApiResponse<ExpiringResource[]>>(
      `${environment.apiUrl}${API_ENDPOINTS.dashboard.expiringResources}`
    );
  }
}
