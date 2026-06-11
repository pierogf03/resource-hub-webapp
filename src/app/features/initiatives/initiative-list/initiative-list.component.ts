import { Component, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { Initiative } from '../../../core/models/initiative.model';
import { User } from '../../../core/models/user.model';
import { InitiativeService } from '../../../core/services/initiative.service';
import { UserService } from '../../../core/services/user.service';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { SearchFilterBarComponent } from '../../../shared/components/search-filter-bar/search-filter-bar.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { UsdCurrencyPipe } from '../../../shared/pipes/usd-currency.pipe';
import { InitiativeFormComponent } from '../initiative-form/initiative-form.component';

@Component({
  selector: 'app-initiative-list',
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    PageHeaderComponent,
    SearchFilterBarComponent,
    LoadingSpinnerComponent,
    EmptyStateComponent,
    UsdCurrencyPipe,
  ],
  templateUrl: './initiative-list.component.html',
  styleUrl: './initiative-list.component.scss',
})
export class InitiativeListComponent implements OnInit {
  private readonly initiativeService = inject(InitiativeService);
  private readonly userService = inject(UserService);
  private readonly dialog = inject(MatDialog);

  loading = true;
  initiatives: Initiative[] = [];
  managers: User[] = [];
  total = 0;
  page = 1;
  pageSize = 10;
  search = '';
  displayedColumns = ['name', 'responsible_manager_id', 'budget_usd', 'is_active', 'actions'];

  ngOnInit(): void {
    this.userService.getUsers({ page_size: 100 }).subscribe((res) => {
      this.managers = res.data.items;
    });
    this.loadInitiatives();
  }

  getManagerName(id: string | null | undefined): string {
    if (!id) return '-';
    return this.managers.find((m) => m.id === id)?.full_name ?? '-';
  }

  loadInitiatives(): void {
    this.loading = true;
    this.initiativeService
      .getInitiatives({ search: this.search, page: this.page, page_size: this.pageSize })
      .subscribe({
        next: (response) => {
          this.initiatives = response.data.items;
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
    this.loadInitiatives();
  }

  onPage(event: PageEvent): void {
    this.page = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadInitiatives();
  }

  openForm(initiative?: Initiative): void {
    const ref = this.dialog.open(InitiativeFormComponent, {
      width: '500px',
      data: { initiative },
    });
    ref.afterClosed().subscribe((saved) => {
      if (saved) {
        this.loadInitiatives();
      }
    });
  }
}
