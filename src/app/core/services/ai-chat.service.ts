import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import { ApiResponse } from '../models/api-response.model';
import {
  AiChatConfirmActionRequest,
  AiChatConfirmActionResponse,
  AiChatMessageRequest,
  AiChatMessageResponse,
} from '../models/ai-chat.model';

@Injectable({ providedIn: 'root' })
export class AiChatService {
  private readonly http = inject(HttpClient);

  sendMessage(
    request: AiChatMessageRequest
  ): Observable<ApiResponse<AiChatMessageResponse>> {
    return this.http.post<ApiResponse<AiChatMessageResponse>>(
      `${environment.apiUrl}${API_ENDPOINTS.aiChat.sendMessage}`,
      request
    );
  }

  confirmAction(
    request: AiChatConfirmActionRequest
  ): Observable<ApiResponse<AiChatConfirmActionResponse>> {
    return this.http.post<ApiResponse<AiChatConfirmActionResponse>>(
      `${environment.apiUrl}${API_ENDPOINTS.aiChat.confirmAction}`,
      request
    );
  }
}
