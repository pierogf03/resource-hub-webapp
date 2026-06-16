import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { UserRole } from '../../../core/constants/status.constants';
import { User } from '../../../core/models/user.model';
import { UserService } from '../../../core/services/user.service';
import { NotificationService } from '../../../core/services/notification.service';

export interface UserFormData {
  user?: User;
}

@Component({
  selector: 'app-user-form',
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
  templateUrl: './user-form.component.html',
})
export class UserFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly userService = inject(UserService);
  private readonly notification = inject(NotificationService);
  private readonly dialogRef = inject(MatDialogRef<UserFormComponent>);
  readonly data = inject<UserFormData>(MAT_DIALOG_DATA);

  isEdit = false;
  loading = false;
  roles: UserRole[] = ['ADMIN', 'MANAGER', 'ANALYST'];

  form = this.fb.nonNullable.group({
    full_name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.minLength(8)]],
    role: ['MANAGER' as UserRole, Validators.required],
    is_active: [true],
  });

  ngOnInit(): void {
    if (this.data.user) {
      this.isEdit = true;
      this.form.patchValue({
        full_name: this.data.user.full_name,
        email: this.data.user.email,
        role: this.data.user.role,
        is_active: this.data.user.is_active,
      });
      this.form.controls.password.clearValidators();
      this.form.controls.password.updateValueAndValidity();
    } else {
      this.form.controls.password.setValidators([Validators.required, Validators.minLength(8)]);
      this.form.controls.password.updateValueAndValidity();
    }
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    const value = this.form.getRawValue();

    const request$ = this.isEdit
      ? this.userService.updateUser(this.data.user!.id, {
          full_name: value.full_name,
          email: value.email,
          role: value.role,
          is_active: value.is_active,
          ...(value.password ? { password: value.password } : {}),
        })
      : this.userService.createUser({
          full_name: value.full_name,
          email: value.email,
          password: value.password,
          role: value.role,
          is_active: value.is_active,
        });

    request$.subscribe({
      next: () => {
        this.notification.success(this.isEdit ? 'Usuario actualizado' : 'Usuario creado');
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
