import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import { ApiResponse, ListQueryParams, PaginatedResponse } from '../models/api-response.model';
import { CreateUserRequest, UpdateUserRequest, User } from '../models/user.model';
import { buildQueryParams } from '../utils/query-params.util';
import { AuthService } from './auth.service';
import { AuthUser } from '../models/auth.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);

  canListUsers(): boolean {
    return this.authService.hasRole('ADMIN');
  }

  getUsers(params: ListQueryParams = {}): Observable<ApiResponse<PaginatedResponse<User>>> {
    return this.http.get<ApiResponse<PaginatedResponse<User>>>(
      `${environment.apiUrl}${API_ENDPOINTS.users.list}`,
      { params: new HttpParams({ fromObject: buildQueryParams(params) }) }
    );
  }

  getManagersForSelect(): Observable<User[]> {
    if (!this.canListUsers()) {
      const current = this.authService.getCurrentUser();
      if (current && (current.role === 'MANAGER' || current.role === 'ADMIN')) {
        return of([this.toUser(current)]);
      }
      return of([]);
    }

    return this.getUsers({ page_size: 100 }).pipe(
      map((response) =>
        response.data.items.filter((user) => user.role === 'MANAGER' || user.role === 'ADMIN')
      )
    );
  }

  getAnalystsForSelect(): Observable<User[]> {
    if (!this.canListUsers()) {
      return of([]);
    }

    return this.getUsers({ page_size: 100 }).pipe(
      map((response) => response.data.items.filter((user) => user.role === 'ANALYST'))
    );
  }

  getUsersForLookup(): Observable<User[]> {
    return this.getManagersForSelect();
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

  private toUser(user: AuthUser): User {
    return {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      role: user.role,
      is_active: true,
    };
  }
}
