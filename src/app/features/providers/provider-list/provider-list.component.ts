import { Component, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { Provider } from '../../../core/models/provider.model';
import { ProviderService } from '../../../core/services/provider.service';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { SearchFilterBarComponent } from '../../../shared/components/search-filter-bar/search-filter-bar.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { ProviderFormComponent } from '../provider-form/provider-form.component';

@Component({
  selector: 'app-provider-list',
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
  ],
  templateUrl: './provider-list.component.html',
  styleUrl: './provider-list.component.scss',
})
export class ProviderListComponent implements OnInit {
  private readonly providerService = inject(ProviderService);
  private readonly dialog = inject(MatDialog);

  loading = true;
  providers: Provider[] = [];
  total = 0;
  page = 1;
  pageSize = 10;
  search = '';
  displayedColumns = ['name', 'ruc', 'contact_name', 'contact_email', 'is_active', 'actions'];

  ngOnInit(): void {
    this.loadProviders();
  }

  loadProviders(): void {
    this.loading = true;
    this.providerService
      .getProviders({ search: this.search, page: this.page, page_size: this.pageSize })
      .subscribe({
        next: (response) => {
          this.providers = response.data.items;
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
    this.loadProviders();
  }

  onPage(event: PageEvent): void {
    this.page = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadProviders();
  }

  openForm(provider?: Provider): void {
    const ref = this.dialog.open(ProviderFormComponent, {
      width: '680px',
      maxWidth: '95vw',
      panelClass: 'app-dialog-panel',
      autoFocus: false,
      data: { provider },
    });
    ref.afterClosed().subscribe((saved) => {
      if (saved) {
        this.loadProviders();
      }
    });
  }
}
