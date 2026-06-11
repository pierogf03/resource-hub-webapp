import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { ApiErrorResponse } from '../models/api-response.model';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const notification = inject(NotificationService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !req.url.includes('/auth/login')) {
        authService.logout();
        notification.warning('Sesión expirada. Inicia sesión nuevamente.');
        router.navigate(['/login']);
        return throwError(() => error);
      }

      if (error.status === 403) {
        notification.error('No tienes permisos para realizar esta acción.');
        return throwError(() => error);
      }

      if (error.status === 400 || error.status === 422) {
        const body = error.error as ApiErrorResponse;
        const message =
          body?.errors?.map((e) => e.message).join('. ') ||
          body?.message ||
          'Error de validación.';
        notification.error(message);
        return throwError(() => error);
      }

      if (error.status >= 500) {
        notification.error('Ocurrió un error inesperado. Intenta nuevamente.');
        return throwError(() => error);
      }

      return throwError(() => error);
    })
  );
};
