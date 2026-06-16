import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Assignment } from '../../../core/models/assignment.model';
import { AssignmentService } from '../../../core/services/assignment.service';
import { NotificationService } from '../../../core/services/notification.service';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { StatusChipComponent } from '../../../shared/components/status-chip/status-chip.component';
import { ExpirationBadgeComponent } from '../../../shared/components/expiration-badge/expiration-badge.component';
import {
  ConfirmDialogComponent,
  ConfirmDialogData,
} from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { UsdCurrencyPipe } from '../../../shared/pipes/usd-currency.pipe';
import { DaysLeftPipe } from '../../../shared/pipes/days-left.pipe';
import { formatDate } from '../../../shared/utils/date-format.util';

@Component({
  selector: 'app-assignment-detail',
  standalone: true,
  imports: [
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    PageHeaderComponent,
    LoadingSpinnerComponent,
    StatusChipComponent,
    ExpirationBadgeComponent,
    UsdCurrencyPipe,
    DaysLeftPipe,
  ],
  templateUrl: './assignment-detail.component.html',
  styleUrl: './assignment-detail.component.scss',
})
export class AssignmentDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly assignmentService = inject(AssignmentService);
  private readonly notification = inject(NotificationService);
  private readonly dialog = inject(MatDialog);

  loading = true;
  assignment: Assignment | null = null;
  formatDate = formatDate;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate(['/assignments']);
      return;
    }

    this.loadAssignment(id);
  }

  private loadAssignment(id: string): void {
    this.assignmentService.getAssignment(id).subscribe({
      next: (response) => {
        this.assignment = response.data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.notification.error('Asignación no encontrada');
        this.router.navigate(['/assignments']);
      },
    });
  }

  generatePurchaseOrders(): void {
    if (!this.assignment) return;

    const ref = this.dialog.open(ConfirmDialogComponent, {
      width: '450px',
      data: {
        title: 'Generar OCs mensuales',
        message:
          'Se generará una OC por cada mes de la asignación. ¿Deseas continuar?',
        confirmLabel: 'Generar OCs',
      } as ConfirmDialogData,
    });

    ref.afterClosed().subscribe((confirmed) => {
      if (!confirmed || !this.assignment) return;

      this.assignmentService
        .generateMonthlyPurchaseOrders(this.assignment.id, { overwrite_existing: false })
        .subscribe({
          next: (response) => {
            const data = response.data;
            this.notification.success(
              `Generadas: ${data.generated_count}. Omitidas: ${data.skipped_count}.`
            );
            this.loadAssignment(this.assignment!.id);
          },
        });
    });
  }
}
