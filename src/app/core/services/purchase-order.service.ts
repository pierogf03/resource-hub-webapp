import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import { ApiResponse, ListQueryParams, PaginatedResponse } from '../models/api-response.model';
import {
  CreatePurchaseOrderRequest,
  PurchaseOrder,
  UpdatePurchaseOrderRequest,
} from '../models/purchase-order.model';
import { buildQueryParams } from '../utils/query-params.util';

@Injectable({ providedIn: 'root' })
export class PurchaseOrderService {
  private readonly http = inject(HttpClient);

  getPurchaseOrders(
    params: ListQueryParams = {}
  ): Observable<ApiResponse<PaginatedResponse<PurchaseOrder>>> {
    return this.http.get<ApiResponse<PaginatedResponse<PurchaseOrder>>>(
      `${environment.apiUrl}${API_ENDPOINTS.purchaseOrders.list}`,
      { params: new HttpParams({ fromObject: buildQueryParams(params) }) }
    );
  }

  createPurchaseOrder(request: CreatePurchaseOrderRequest): Observable<ApiResponse<PurchaseOrder>> {
    return this.http.post<ApiResponse<PurchaseOrder>>(
      `${environment.apiUrl}${API_ENDPOINTS.purchaseOrders.create}`,
      request
    );
  }

  updatePurchaseOrder(
    id: string,
    request: UpdatePurchaseOrderRequest
  ): Observable<ApiResponse<PurchaseOrder>> {
    return this.http.put<ApiResponse<PurchaseOrder>>(
      `${environment.apiUrl}${API_ENDPOINTS.purchaseOrders.update(id)}`,
      request
    );
  }
}
