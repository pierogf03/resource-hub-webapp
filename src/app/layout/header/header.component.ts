import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { USER_ROLE_LABELS } from '../../core/constants/status.constants';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  @Input() sidebarExpanded = true;
  @Output() menuToggle = new EventEmitter<void>();
  @Output() sidebarToggle = new EventEmitter<void>();

  get user() {
    return this.authService.getCurrentUser();
  }

  get roleLabel(): string {
    const role = this.user?.role;
    return role ? USER_ROLE_LABELS[role] : '';
  }

  get initials(): string {
    const name = this.user?.full_name ?? '';
    return name
      .split(' ')
      .slice(0, 2)
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
