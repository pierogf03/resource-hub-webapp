import { JsonPipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { ImportError } from '../../../core/models/import.model';
import { ImportService } from '../../../core/services/import.service';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-import-errors',
  standalone: true,
  imports: [
    JsonPipe,
    RouterLink,
    MatTableModule,
    MatButtonModule,
    PageHeaderComponent,
    LoadingSpinnerComponent,
    EmptyStateComponent,
  ],
  templateUrl: './import-errors.component.html',
  styleUrl: './import-errors.component.scss',
})
export class ImportErrorsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly importService = inject(ImportService);

  loading = true;
  errors: ImportError[] = [];
  batchId = '';
  displayedColumns = ['row_number', 'column_name', 'error_message', 'raw_data'];

  ngOnInit(): void {
    this.batchId = this.route.snapshot.paramMap.get('batchId') ?? '';
    this.importService.getImportErrors(this.batchId).subscribe({
      next: (response) => {
        this.errors = response.data ?? [];
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }
}
