import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import { UserRole } from '../constants/status.constants';
import { ApiResponse } from '../models/api-response.model';
import { AuthUser, LoginRequest, LoginResponse } from '../models/auth.model';
import { StorageService } from './storage.service';
import { clearChatSessionStorage } from '../utils/chat-session.util';
import { ExchangeRateService } from './exchange-rate.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly storage = inject(StorageService);
  private readonly exchangeRateService = inject(ExchangeRateService);

  login(credentials: LoginRequest): Observable<ApiResponse<LoginResponse>> {
    return this.http
      .post<ApiResponse<LoginResponse>>(
        `${environment.apiUrl}${API_ENDPOINTS.auth.login}`,
        credentials
      )
      .pipe(
        tap((response) => {
          if (response.success && response.data) {
            this.storage.setToken(response.data.access_token);
            this.storage.setUser(response.data.user);
            this.exchangeRateService.getUsdPenRate().subscribe();
          }
        })
      );
  }

  me(): Observable<ApiResponse<AuthUser>> {
    return this.http.get<ApiResponse<AuthUser>>(
      `${environment.apiUrl}${API_ENDPOINTS.auth.me}`
    );
  }

  logout(): void {
    clearChatSessionStorage();
    this.exchangeRateService.clearCache();
    this.storage.clearSession();
  }

  getCurrentUser(): AuthUser | null {
    return this.storage.getUser();
  }

  isAuthenticated(): boolean {
    return !!this.storage.getToken();
  }

  hasRole(role: UserRole): boolean {
    const user = this.getCurrentUser();
    return user?.role === role;
  }

  getToken(): string | null {
    return this.storage.getToken();
  }
}
