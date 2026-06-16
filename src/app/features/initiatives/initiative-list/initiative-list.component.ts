import { Component, OnInit, inject } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { Initiative } from '../../../core/models/initiative.model';
import { ListQueryParams } from '../../../core/models/api-response.model';
import { User } from '../../../core/models/user.model';
import { InitiativeService } from '../../../core/services/initiative.service';
import { UserService } from '../../../core/services/user.service';
import { AuthService } from '../../../core/services/auth.service';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { SearchFilterBarComponent } from '../../../shared/components/search-filter-bar/search-filter-bar.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { UsdCurrencyPipe } from '../../../shared/pipes/usd-currency.pipe';
import { InitiativeFormComponent } from '../initiative-form/initiative-form.component';

const MAX_PAGE_SIZE = 100;

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
  private readonly authService = inject(AuthService);
  private readonly dialog = inject(MatDialog);

  loading = true;
  initiatives: Initiative[] = [];
  managers: User[] = [];
  total = 0;
  page = 1;
  pageSize = 10;
  search = '';
  displayedColumns = ['name', 'responsible_manager_id', 'budget_usd', 'is_active', 'actions'];
  private ownedInitiatives: Initiative[] = [];

  readonly isAdmin = this.authService.hasRole('ADMIN');

  ngOnInit(): void {
    if (this.isAdmin) {
      this.userService.getUsersForLookup().subscribe((users) => {
        this.managers = users;
      });
    }
    this.loadInitiatives();
  }

  private get currentUserId(): string | undefined {
    return this.authService.getCurrentUser()?.id;
  }

  private shouldScopeToCurrentManager(): boolean {
    return !this.isAdmin && this.authService.hasRole('MANAGER');
  }

  getManagerName(id: string | null | undefined): string {
    if (!id) {
      return '-';
    }
    const fromList = this.managers.find((m) => m.id === id)?.full_name;
    if (fromList) {
      return fromList;
    }
    const current = this.authService.getCurrentUser();
    if (current?.id === id) {
      return current.full_name;
    }
    return '-';
  }

  loadInitiatives(): void {
    this.loading = true;

    if (this.shouldScopeToCurrentManager() && this.currentUserId) {
      this.loadOwnedInitiatives();
      return;
    }

    this.initiativeService
      .getInitiatives({ search: this.search, page: this.page, page_size: this.pageSize })
      .subscribe({
        next: (response) => {
          this.initiatives = Array.isArray(response.data?.items) ? response.data.items : [];
          this.total = response.data?.total ?? 0;
          this.loading = false;
        },
        error: () => {
          this.initiatives = [];
          this.total = 0;
          this.loading = false;
        },
      });
  }

  private loadOwnedInitiatives(): void {
    const managerId = this.currentUserId!;
    this.fetchOwnedInitiatives(managerId, 1, []).subscribe({
      next: (owned) => {
        this.ownedInitiatives = owned;
        this.applyOwnedInitiativesPage();
        this.loading = false;
      },
      error: () => {
        this.ownedInitiatives = [];
        this.initiatives = [];
        this.total = 0;
        this.loading = false;
      },
    });
  }

  private fetchOwnedInitiatives(
    managerId: string,
    page: number,
    accumulated: Initiative[]
  ): Observable<Initiative[]> {
    const params: ListQueryParams = {
      search: this.search,
      page,
      page_size: MAX_PAGE_SIZE,
      responsible_manager_id: managerId,
    };

    return this.initiativeService.getInitiatives(params).pipe(
      switchMap((response) => {
        const pageItems = (response.data?.items ?? []).filter(
          (initiative) => initiative.responsible_manager_id === managerId
        );
        const all = [...accumulated, ...pageItems];
        const total = response.data?.total ?? 0;
        const fetchedCount = page * MAX_PAGE_SIZE;

        if (fetchedCount < total && (response.data?.items?.length ?? 0) > 0) {
          return this.fetchOwnedInitiatives(managerId, page + 1, all);
        }

        return of(all);
      })
    );
  }

  private applyOwnedInitiativesPage(): void {
    const start = (this.page - 1) * this.pageSize;
    this.initiatives = this.ownedInitiatives.slice(start, start + this.pageSize);
    this.total = this.ownedInitiatives.length;
  }

  onSearch(value: string): void {
    this.search = value;
    this.page = 1;
    this.ownedInitiatives = [];
    this.loadInitiatives();
  }

  onPage(event: PageEvent): void {
    this.page = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    if (this.shouldScopeToCurrentManager() && this.ownedInitiatives.length > 0) {
      this.applyOwnedInitiativesPage();
      return;
    }
    this.loadInitiatives();
  }

  openForm(initiative?: Initiative): void {
    const ref = this.dialog.open(InitiativeFormComponent, {
      width: '680px',
      maxWidth: '95vw',
      panelClass: 'app-dialog-panel',
      autoFocus: false,
      data: { initiative },
    });
    ref.afterClosed().subscribe((saved) => {
      if (saved) {
        this.loadInitiatives();
      }
    });
  }
}
