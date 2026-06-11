import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { User } from '../../../core/models/user.model';
import { HistoricalImportResult } from '../../../core/models/import.model';
import { ImportService } from '../../../core/services/import.service';
import { NotificationService } from '../../../core/services/notification.service';
import { UserService } from '../../../core/services/user.service';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { FileUploadBoxComponent } from '../../../shared/components/file-upload-box/file-upload-box.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

const EXCEL_COLUMNS = [
  'Proyecto', 'Consultor', 'Analista responsable', 'Proveedor', 'Perfil',
  'Costo Mensual [USD]', 'Costo Mensual [PEN]', 'Duración',
  'Costo Total [USD]', 'Costo Total [PEN]', 'Inicio', 'Fin', 'Comentarios',
  'Mes1', 'Mes2', 'Mes3', 'Mes4', 'Mes5', 'Mes6', 'Mes7', 'Mes8',
];

@Component({
  selector: 'app-historical-import',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatTableModule,
    PageHeaderComponent,
    FileUploadBoxComponent,
    LoadingSpinnerComponent,
  ],
  templateUrl: './historical-import.component.html',
  styleUrl: './historical-import.component.scss',
})
export class HistoricalImportComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly importService = inject(ImportService);
  private readonly userService = inject(UserService);
  private readonly notification = inject(NotificationService);

  loading = false;
  selectedFile: File | null = null;
  result: HistoricalImportResult | null = null;
  managers: User[] = [];
  excelColumns = EXCEL_COLUMNS;
  errorColumns = ['row_number', 'column_name', 'error_message'];

  form = this.fb.nonNullable.group({
    default_manager_id: [''],
    default_exchange_rate: [null as number | null, Validators.min(0.01)],
    auto_generate_purchase_orders: [true],
  });

  ngOnInit(): void {
    this.userService.getUsers({ page_size: 100 }).subscribe((res) => {
      this.managers = res.data.items.filter((u) => u.role === 'MANAGER' || u.role === 'ADMIN');
    });
  }

  onFileSelected(file: File): void {
    this.selectedFile = file;
    this.result = null;
  }

  submit(): void {
    if (!this.selectedFile) {
      this.notification.warning('Selecciona un archivo .xlsx');
      return;
    }

    if (this.form.controls.default_exchange_rate.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formData = new FormData();
    formData.append('file', this.selectedFile);

    const value = this.form.getRawValue();
    if (value.default_manager_id) {
      formData.append('default_manager_id', value.default_manager_id);
    }
    if (value.default_exchange_rate) {
      formData.append('default_exchange_rate', String(value.default_exchange_rate));
    }
    formData.append('auto_generate_purchase_orders', String(value.auto_generate_purchase_orders));

    this.loading = true;
    this.importService.importHistoricalExcel(formData).subscribe({
      next: (response) => {
        this.result = response.data;
        this.loading = false;
        this.notification.success('Importación completada');
      },
      error: () => {
        this.loading = false;
      },
    });
  }
}
