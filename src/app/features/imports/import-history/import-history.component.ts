import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { ImportBatch } from '../../../core/models/import.model';
import { ImportService } from '../../../core/services/import.service';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { formatDate } from '../../../shared/utils/date-format.util';

@Component({
  selector: 'app-import-history',
  standalone: true,
  imports: [
    RouterLink,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    PageHeaderComponent,
    LoadingSpinnerComponent,
    EmptyStateComponent,
  ],
  templateUrl: './import-history.component.html',
  styleUrl: './import-history.component.scss',
})
export class ImportHistoryComponent implements OnInit {
  private readonly importService = inject(ImportService);

  loading = true;
  batches: ImportBatch[] = [];
  displayedColumns = ['file_name', 'status', 'total_rows', 'successful_rows', 'failed_rows', 'created_at', 'actions'];
  formatDate = formatDate;

  ngOnInit(): void {
    this.importService.getImportBatches().subscribe({
      next: (response) => {
        this.batches = response.data ?? [];
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }
}
