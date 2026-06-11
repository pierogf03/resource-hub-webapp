import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly snackBar = inject(MatSnackBar);

  success(message: string): void {
    this.show(message, 'success-snackbar');
  }

  error(message: string): void {
    this.show(message, 'error-snackbar', 5000);
  }

  warning(message: string): void {
    this.show(message, 'warning-snackbar', 4000);
  }

  info(message: string): void {
    this.show(message, 'info-snackbar');
  }

  private show(message: string, panelClass: string, duration = 3000): void {
    this.snackBar.open(message, 'Cerrar', {
      duration,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: [panelClass],
    });
  }
}
