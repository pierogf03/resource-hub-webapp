import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Initiative } from '../../../core/models/initiative.model';
import { User } from '../../../core/models/user.model';
import { InitiativeService } from '../../../core/services/initiative.service';
import { NotificationService } from '../../../core/services/notification.service';
import { UserService } from '../../../core/services/user.service';
import { AuthService } from '../../../core/services/auth.service';

export interface InitiativeFormData {
  initiative?: Initiative;
}

@Component({
  selector: 'app-initiative-form',
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
  templateUrl: './initiative-form.component.html',
})
export class InitiativeFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly initiativeService = inject(InitiativeService);
  private readonly userService = inject(UserService);
  private readonly authService = inject(AuthService);
  private readonly notification = inject(NotificationService);
  private readonly dialogRef = inject(MatDialogRef<InitiativeFormComponent>);
  readonly data = inject<InitiativeFormData>(MAT_DIALOG_DATA);

  isEdit = false;
  loading = false;
  managers: User[] = [];
  showManagerField = false;

  form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    description: [''],
    responsible_manager_id: [''],
    budget_usd: [null as number | null, Validators.min(0)],
    is_active: [true],
  });

  ngOnInit(): void {
    this.userService.getManagersForSelect().subscribe((managers) => {
      this.managers = managers;
      this.showManagerField = this.authService.hasRole('ADMIN') || managers.length > 1;
    });

    if (this.data.initiative) {
      this.isEdit = true;
      this.form.patchValue({
        name: this.data.initiative.name,
        description: this.data.initiative.description ?? '',
        responsible_manager_id: this.data.initiative.responsible_manager_id ?? '',
        budget_usd: this.data.initiative.budget_usd ?? null,
        is_active: this.data.initiative.is_active,
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
      description: value.description || null,
      responsible_manager_id: value.responsible_manager_id || null,
      budget_usd: value.budget_usd,
      ...(this.isEdit ? { is_active: value.is_active } : {}),
    };

    const request$ = this.isEdit
      ? this.initiativeService.updateInitiative(this.data.initiative!.id, payload)
      : this.initiativeService.createInitiative(payload);

    request$.subscribe({
      next: () => {
        this.notification.success(this.isEdit ? 'Iniciativa actualizada' : 'Iniciativa creada');
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
