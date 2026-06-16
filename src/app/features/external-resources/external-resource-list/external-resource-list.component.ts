import { Component, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { ExternalResource } from '../../../core/models/external-resource.model';
import { ExternalResourceService } from '../../../core/services/external-resource.service';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { SearchFilterBarComponent } from '../../../shared/components/search-filter-bar/search-filter-bar.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { ExternalResourceFormComponent } from '../external-resource-form/external-resource-form.component';

@Component({
  selector: 'app-external-resource-list',
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
  templateUrl: './external-resource-list.component.html',
  styleUrl: './external-resource-list.component.scss',
})
export class ExternalResourceListComponent implements OnInit {
  private readonly resourceService = inject(ExternalResourceService);
  private readonly dialog = inject(MatDialog);

  loading = true;
  resources: ExternalResource[] = [];
  total = 0;
  page = 1;
  pageSize = 10;
  search = '';
  displayedColumns = ['consultant_name', 'technical_profile', 'document_number', 'is_active', 'actions'];

  ngOnInit(): void {
    this.loadResources();
  }

  loadResources(): void {
    this.loading = true;
    this.resourceService
      .getExternalResources({ search: this.search, page: this.page, page_size: this.pageSize })
      .subscribe({
        next: (response) => {
          this.resources = response.data.items;
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
    this.loadResources();
  }

  onPage(event: PageEvent): void {
    this.page = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadResources();
  }

  openForm(resource?: ExternalResource): void {
    const ref = this.dialog.open(ExternalResourceFormComponent, {
      width: '680px',
      maxWidth: '95vw',
      panelClass: 'app-dialog-panel',
      autoFocus: false,
      data: { resource },
    });
    ref.afterClosed().subscribe((saved) => {
      if (saved) {
        this.loadResources();
      }
    });
  }
}
