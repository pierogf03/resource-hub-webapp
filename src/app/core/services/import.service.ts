import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import { ApiResponse } from '../models/api-response.model';
import { HistoricalImportResult, ImportBatch, ImportError } from '../models/import.model';

@Injectable({ providedIn: 'root' })
export class ImportService {
  private readonly http = inject(HttpClient);

  importHistoricalExcel(formData: FormData): Observable<ApiResponse<HistoricalImportResult>> {
    return this.http.post<ApiResponse<HistoricalImportResult>>(
      `${environment.apiUrl}${API_ENDPOINTS.imports.historicalExcel}`,
      formData
    );
  }

  getImportBatches(): Observable<ApiResponse<ImportBatch[]>> {
    return this.http.get<ApiResponse<ImportBatch[]>>(
      `${environment.apiUrl}${API_ENDPOINTS.imports.list}`
    );
  }

  getImportErrors(batchId: string): Observable<ApiResponse<ImportError[]>> {
    return this.http.get<ApiResponse<ImportError[]>>(
      `${environment.apiUrl}${API_ENDPOINTS.imports.errors(batchId)}`
    );
  }
}
