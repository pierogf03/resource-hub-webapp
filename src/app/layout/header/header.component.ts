import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { USER_ROLE_LABELS } from '../../core/constants/status.constants';
import { AuthService } from '../../core/services/auth.service';
import { ExchangeRateService } from '../../core/services/exchange-rate.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly exchangeRateService = inject(ExchangeRateService);
  private readonly router = inject(Router);

  @Output() menuToggle = new EventEmitter<void>();

  readonly usdPenRate = this.exchangeRateService.usdPenRate;
  readonly exchangeRateLoading = this.exchangeRateService.loading;
  readonly exchangeRateError = this.exchangeRateService.error;

  ngOnInit(): void {
    if (this.user) {
      this.exchangeRateService.loadUsdPenRate();
    }
  }

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

  get exchangeRateLabel(): string {
    const rate = this.usdPenRate();
    if (!rate) {
      return '';
    }
    const value = Number.parseFloat(rate.rate);
    if (!Number.isFinite(value)) {
      return '';
    }
    return value.toFixed(2);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
