import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import { ApiResponse, ListQueryParams, PaginatedResponse } from '../models/api-response.model';
import { CreateUserRequest, UpdateUserRequest, User } from '../models/user.model';
import { buildQueryParams } from '../utils/query-params.util';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly http = inject(HttpClient);

  getUsers(params: ListQueryParams = {}): Observable<ApiResponse<PaginatedResponse<User>>> {
    return this.http.get<ApiResponse<PaginatedResponse<User>>>(
      `${environment.apiUrl}${API_ENDPOINTS.users.list}`,
      { params: new HttpParams({ fromObject: buildQueryParams(params) }) }
    );
  }

  createUser(request: CreateUserRequest): Observable<ApiResponse<User>> {
    return this.http.post<ApiResponse<User>>(
      `${environment.apiUrl}${API_ENDPOINTS.users.create}`,
      request
    );
  }

  updateUser(id: string, request: UpdateUserRequest): Observable<ApiResponse<User>> {
    return this.http.put<ApiResponse<User>>(
      `${environment.apiUrl}${API_ENDPOINTS.users.update(id)}`,
      request
    );
  }
}
