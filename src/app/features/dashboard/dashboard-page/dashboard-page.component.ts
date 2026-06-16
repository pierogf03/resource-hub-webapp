import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { DashboardService } from '../../../core/services/dashboard.service';
import { DashboardSummary, ExpiringResource } from '../../../core/models/dashboard.model';
import { PaginatedResponse } from '../../../core/models/api-response.model';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { StatCardComponent } from '../../../shared/components/stat-card/stat-card.component';
import { ExpirationBadgeComponent } from '../../../shared/components/expiration-badge/expiration-badge.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { UsdCurrencyPipe } from '../../../shared/pipes/usd-currency.pipe';
import { formatDate } from '../../../shared/utils/date-format.util';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [
    RouterLink,
    MatTableModule,
    PageHeaderComponent,
    StatCardComponent,
    ExpirationBadgeComponent,
    LoadingSpinnerComponent,
    EmptyStateComponent,
    UsdCurrencyPipe,
  ],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.scss',
})
export class DashboardPageComponent implements OnInit {
  private readonly dashboardService = inject(DashboardService);

  summaryLoading = true;
  expiringLoading = false;
  summary: DashboardSummary | null = null;
  expiringResources: ExpiringResource[] = [];

  displayedColumns = [
    'consultant_name',
    'technical_profile',
    'provider_name',
    'main_initiative_name',
    'end_date',
    'expiration_alert',
  ];

  formatDate = formatDate;

  ngOnInit(): void {
    this.dashboardService.getSummary().subscribe({
      next: (response) => {
        this.summary = response.data;
        this.summaryLoading = false;
        this.loadExpiringResources();
      },
      error: () => {
        this.summaryLoading = false;
      },
    });
  }

  private loadExpiringResources(): void {
    this.expiringLoading = true;
    this.dashboardService.getExpiringResources().subscribe({
      next: (response) => {
        this.expiringResources = this.normalizeExpiringResources(response.data);
        this.expiringLoading = false;
      },
      error: () => {
        this.expiringResources = [];
        this.expiringLoading = false;
      },
    });
  }

  private normalizeExpiringResources(data: unknown): ExpiringResource[] {
    if (Array.isArray(data)) {
      return data;
    }

    if (
      data &&
      typeof data === 'object' &&
      'items' in data &&
      Array.isArray((data as PaginatedResponse<ExpiringResource>).items)
    ) {
      return (data as PaginatedResponse<ExpiringResource>).items;
    }

    return [];
  }
}
