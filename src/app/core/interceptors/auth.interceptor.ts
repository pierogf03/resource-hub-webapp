import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { StorageService } from '../services/storage.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const storage = inject(StorageService);

  if (req.url.includes('/auth/login')) {
    return next(req);
  }

  const token = storage.getToken();
  if (token) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
  }

  return next(req);
};
