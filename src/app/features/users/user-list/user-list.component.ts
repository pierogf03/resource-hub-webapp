import { Component, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { USER_ROLE_LABELS, UserRole } from '../../../core/constants/status.constants';
import { User } from '../../../core/models/user.model';
import { UserService } from '../../../core/services/user.service';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { SearchFilterBarComponent } from '../../../shared/components/search-filter-bar/search-filter-bar.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { UserFormComponent } from '../user-form/user-form.component';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatDialogModule,
    PageHeaderComponent,
    SearchFilterBarComponent,
    LoadingSpinnerComponent,
    EmptyStateComponent,
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
})
export class UserListComponent implements OnInit {
  private readonly userService = inject(UserService);
  private readonly dialog = inject(MatDialog);

  loading = true;
  users: User[] = [];
  total = 0;
  page = 1;
  pageSize = 10;
  search = '';
  displayedColumns = ['full_name', 'email', 'role', 'is_active', 'actions'];
  roleLabels = USER_ROLE_LABELS;

  getRoleLabel(role: UserRole): string {
    return this.roleLabels[role];
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.userService
      .getUsers({ search: this.search, page: this.page, page_size: this.pageSize })
      .subscribe({
        next: (response) => {
          this.users = response.data.items;
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
    this.loadUsers();
  }

  onPage(event: PageEvent): void {
    this.page = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadUsers();
  }

  openForm(user?: User): void {
    const ref = this.dialog.open(UserFormComponent, {
      width: '680px',
      maxWidth: '95vw',
      panelClass: 'app-dialog-panel',
      autoFocus: false,
      data: { user },
    });
    ref.afterClosed().subscribe((saved) => {
      if (saved) {
        this.loadUsers();
      }
    });
  }
}
