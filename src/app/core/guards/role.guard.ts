import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserRole } from '../constants/status.constants';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

export const roleGuard = (roles: UserRole[]): CanActivateFn => {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const notification = inject(NotificationService);
    const user = authService.getCurrentUser();

    if (user && roles.includes(user.role)) {
      return true;
    }

    notification.error('No tienes permisos para acceder a esta sección.');
    return router.createUrlTree(['/dashboard']);
  };
};
