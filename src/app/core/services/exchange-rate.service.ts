import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of, shareReplay, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import { ApiResponse } from '../models/api-response.model';
import { ExchangeRate } from '../models/exchange-rate.model';

@Injectable({ providedIn: 'root' })
export class ExchangeRateService {
  private readonly http = inject(HttpClient);

  private usdPenRequest$: Observable<ApiResponse<ExchangeRate>> | null = null;

  readonly usdPenRate = signal<ExchangeRate | null>(null);
  readonly loading = signal(false);
  readonly error = signal(false);

  getUsdPenRate(forceRefresh = false): Observable<ApiResponse<ExchangeRate>> {
    if (!forceRefresh && this.usdPenRequest$) {
      return this.usdPenRequest$;
    }

    this.loading.set(true);
    this.error.set(false);

    this.usdPenRequest$ = this.http
      .get<ApiResponse<ExchangeRate>>(`${environment.apiUrl}${API_ENDPOINTS.exchangeRates.usdPen}`)
      .pipe(
        tap((response) => {
          if (response.success) {
            this.usdPenRate.set(response.data);
          }
          this.loading.set(false);
        }),
        catchError(() => {
          this.loading.set(false);
          this.error.set(true);
          this.usdPenRequest$ = null;
          return of({
            success: false,
            message: 'No se pudo obtener el tipo de cambio',
            data: null as unknown as ExchangeRate,
          });
        }),
        shareReplay(1)
      );

    return this.usdPenRequest$;
  }

  loadUsdPenRate(): void {
    if (this.usdPenRate() || this.loading()) {
      return;
    }
    this.getUsdPenRate().subscribe();
  }

  getRateValue(): number | null {
    const rate = this.usdPenRate()?.rate;
    if (!rate) {
      return null;
    }
    const parsed = Number.parseFloat(rate);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
  }

  clearCache(): void {
    this.usdPenRequest$ = null;
    this.usdPenRate.set(null);
    this.loading.set(false);
    this.error.set(false);
  }
}
