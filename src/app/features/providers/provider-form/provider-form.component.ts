import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Provider } from '../../../core/models/provider.model';
import { ProviderService } from '../../../core/services/provider.service';
import { NotificationService } from '../../../core/services/notification.service';

export interface ProviderFormData {
  provider?: Provider;
}

@Component({
  selector: 'app-provider-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
    MatButtonModule,
  ],
  templateUrl: './provider-form.component.html',
})
export class ProviderFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly providerService = inject(ProviderService);
  private readonly notification = inject(NotificationService);
  private readonly dialogRef = inject(MatDialogRef<ProviderFormComponent>);
  readonly data = inject<ProviderFormData>(MAT_DIALOG_DATA);

  isEdit = false;
  loading = false;

  form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    ruc: [''],
    contact_name: [''],
    contact_email: ['', Validators.email],
    is_active: [true],
  });

  ngOnInit(): void {
    if (this.data.provider) {
      this.isEdit = true;
      this.form.patchValue({
        name: this.data.provider.name,
        ruc: this.data.provider.ruc ?? '',
        contact_name: this.data.provider.contact_name ?? '',
        contact_email: this.data.provider.contact_email ?? '',
        is_active: this.data.provider.is_active,
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
      name: value.name,
      ruc: value.ruc || null,
      contact_name: value.contact_name || null,
      contact_email: value.contact_email || null,
      ...(this.isEdit ? { is_active: value.is_active } : {}),
    };

    const request$ = this.isEdit
      ? this.providerService.updateProvider(this.data.provider!.id, payload)
      : this.providerService.createProvider(payload);

    request$.subscribe({
      next: () => {
        this.notification.success(this.isEdit ? 'Proveedor actualizado' : 'Proveedor creado');
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
