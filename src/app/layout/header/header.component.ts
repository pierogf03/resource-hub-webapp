import { Component, EventEmitter, OnDestroy, OnInit, Output, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { USER_ROLE_LABELS } from '../../core/constants/status.constants';
import { AuthService } from '../../core/services/auth.service';
import { ExchangeRateService } from '../../core/services/exchange-rate.service';

const WELCOME_ROTATE_MS = 6000;

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit, OnDestroy {
  private readonly authService = inject(AuthService);
  private readonly exchangeRateService = inject(ExchangeRateService);
  private readonly router = inject(Router);

  @Output() menuToggle = new EventEmitter<void>();

  readonly usdPenRate = this.exchangeRateService.usdPenRate;
  readonly exchangeRateLoading = this.exchangeRateService.loading;
  readonly exchangeRateError = this.exchangeRateService.error;

  private readonly welcomeIndex = signal(0);
  readonly welcomeVisible = signal(true);
  private welcomeTimer?: ReturnType<typeof setInterval>;
  private welcomeFadeTimer?: ReturnType<typeof setTimeout>;

  private readonly welcomeMessages = [
    (name: string) => `¡Bienvenido de nuevo, ${name}!`,
    (name: string) => `Buen día, ${name}. ¿En qué te ayudamos hoy?`,
    (name: string) => `Hola, ${name}. Gestiona tus recursos con facilidad.`,
    (name: string) => `${name}, tu panel de ResourcePulse está listo.`,
    (name: string) => `¡Hola ${name}! Que tengas una excelente jornada.`,
  ];

  ngOnInit(): void {
    if (this.user) {
      this.exchangeRateService.loadUsdPenRate();
      this.startWelcomeRotation();
    }
  }

  ngOnDestroy(): void {
    if (this.welcomeTimer) {
      clearInterval(this.welcomeTimer);
    }
    if (this.welcomeFadeTimer) {
      clearTimeout(this.welcomeFadeTimer);
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

  get welcomeMessage(): string {
    const firstName = this.user?.full_name?.split(' ')[0] ?? 'Usuario';
    const index = this.welcomeIndex() % this.welcomeMessages.length;
    return this.welcomeMessages[index](firstName);
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

  private startWelcomeRotation(): void {
    this.welcomeTimer = setInterval(() => {
      this.welcomeVisible.set(false);
      this.welcomeFadeTimer = setTimeout(() => {
        this.welcomeIndex.update((i) => (i + 1) % this.welcomeMessages.length);
        this.welcomeVisible.set(true);
      }, 280);
    }, WELCOME_ROTATE_MS);
  }
}
