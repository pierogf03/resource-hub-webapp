import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { ExpirationAlert } from '../../../core/constants/status.constants';
import { Assignment } from '../../../core/models/assignment.model';
import { Initiative } from '../../../core/models/initiative.model';
import { Provider } from '../../../core/models/provider.model';
import { User } from '../../../core/models/user.model';
import { AssignmentService } from '../../../core/services/assignment.service';
import { AuthService } from '../../../core/services/auth.service';
import { InitiativeService } from '../../../core/services/initiative.service';
import { ProviderService } from '../../../core/services/provider.service';
import { UserService } from '../../../core/services/user.service';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { SearchFilterBarComponent } from '../../../shared/components/search-filter-bar/search-filter-bar.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { StatusChipComponent } from '../../../shared/components/status-chip/status-chip.component';
import { ExpirationBadgeComponent } from '../../../shared/components/expiration-badge/expiration-badge.component';
import { UsdCurrencyPipe } from '../../../shared/pipes/usd-currency.pipe';
import { DaysLeftPipe } from '../../../shared/pipes/days-left.pipe';
import { formatDate } from '../../../shared/utils/date-format.util';

@Component({
  selector: 'app-assignment-list',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatSelectModule,
    PageHeaderComponent,
    SearchFilterBarComponent,
    LoadingSpinnerComponent,
    EmptyStateComponent,
    StatusChipComponent,
    ExpirationBadgeComponent,
    UsdCurrencyPipe,
    DaysLeftPipe,
  ],
  templateUrl: './assignment-list.component.html',
  styleUrl: './assignment-list.component.scss',
})
export class AssignmentListComponent implements OnInit {
  private readonly assignmentService = inject(AssignmentService);
  private readonly providerService = inject(ProviderService);
  private readonly initiativeService = inject(InitiativeService);
  private readonly userService = inject(UserService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  loading = true;
  assignments: Assignment[] = [];
  providers: Provider[] = [];
  initiatives: Initiative[] = [];
  managers: User[] = [];
  total = 0;
  page = 1;
  pageSize = 10;
  search = '';

  statusFilter = new FormControl('');
  providerFilter = new FormControl('');
  initiativeFilter = new FormControl('');
  alertFilter = new FormControl<ExpirationAlert | ''>('');
  managerFilter = new FormControl('');

  isAdmin = this.authService.hasRole('ADMIN');
  formatDate = formatDate;

  displayedColumns = [
    'consultant_name',
    'technical_profile',
    'provider_name',
    'main_initiative_name',
    'manager_name',
    'start_date',
    'end_date',
    'monthly_cost_usd',
    'days_to_end',
    'expiration_alert',
    'purchase_orders_count',
    'status',
    'actions',
  ];

  ngOnInit(): void {
    this.providerService.getProviders({ page_size: 100 }).subscribe((r) => (this.providers = r.data.items));
    this.initiativeService.getInitiatives({ page_size: 100 }).subscribe((r) => (this.initiatives = r.data.items));
    this.userService.getUsers({ page_size: 100 }).subscribe((r) => {
      this.managers = r.data.items.filter((u) => u.role === 'MANAGER' || u.role === 'ADMIN');
    });
    this.loadAssignments();
  }

  loadAssignments(): void {
    this.loading = true;
    this.assignmentService
      .getAssignments({
        search: this.search,
        page: this.page,
        page_size: this.pageSize,
        status: this.statusFilter.value || undefined,
        provider_id: this.providerFilter.value || undefined,
        initiative_id: this.initiativeFilter.value || undefined,
        expiration_alert: this.alertFilter.value || undefined,
        manager_id: this.managerFilter.value || undefined,
      })
      .subscribe({
        next: (response) => {
          this.assignments = response.data.items;
          this.total = response.data.total;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        },
      });
  }

  onSearch(value: string): void {
    this.search = value;
    this.page = 1;
    this.loadAssignments();
  }

  onFilterChange(): void {
    this.page = 1;
    this.loadAssignments();
  }

  onPage(event: PageEvent): void {
    this.page = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadAssignments();
  }

  createNew(): void {
    this.router.navigate(['/assignments/new']);
  }
}
