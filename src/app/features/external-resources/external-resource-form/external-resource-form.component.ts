import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { TECHNICAL_PROFILES } from '../../../core/constants/status.constants';
import { ExternalResource } from '../../../core/models/external-resource.model';
import { ExternalResourceService } from '../../../core/services/external-resource.service';
import { NotificationService } from '../../../core/services/notification.service';

export interface ExternalResourceFormData {
  resource?: ExternalResource;
}

@Component({
  selector: 'app-external-resource-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatButtonModule,
  ],
  templateUrl: './external-resource-form.component.html',
})
export class ExternalResourceFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly resourceService = inject(ExternalResourceService);
  private readonly notification = inject(NotificationService);
  private readonly dialogRef = inject(MatDialogRef<ExternalResourceFormComponent>);
  readonly data = inject<ExternalResourceFormData>(MAT_DIALOG_DATA);

  isEdit = false;
  loading = false;
  profiles = TECHNICAL_PROFILES;

  form = this.fb.nonNullable.group({
    consultant_name: ['', Validators.required],
    technical_profile: ['', Validators.required],
    document_number: [''],
    is_active: [true],
  });

  ngOnInit(): void {
    if (this.data.resource) {
      this.isEdit = true;
      this.form.patchValue({
        consultant_name: this.data.resource.consultant_name,
        technical_profile: this.data.resource.technical_profile,
        document_number: this.data.resource.document_number ?? '',
        is_active: this.data.resource.is_active,
      });
    }
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    const value = this.form.getRawValue();
    const payload = {
      consultant_name: value.consultant_name,
      technical_profile: value.technical_profile,
      document_number: value.document_number || null,
      ...(this.isEdit ? { is_active: value.is_active } : {}),
    };

    const request$ = this.isEdit
      ? this.resourceService.updateExternalResource(this.data.resource!.id, payload)
      : this.resourceService.createExternalResource(payload);

    request$.subscribe({
      next: () => {
        this.notification.success(this.isEdit ? 'Recurso actualizado' : 'Recurso creado');
        this.dialogRef.close(true);
      },
      error: () => {
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      },
    });
  }
}
