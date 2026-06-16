import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MonthPickerFieldComponent } from '../../../shared/components/month-picker-field/month-picker-field.component';
import { PURCHASE_ORDER_STATUS_CONFIG, PurchaseOrderStatus } from '../../../core/constants/status.constants';
import { Assignment } from '../../../core/models/assignment.model';
import { PurchaseOrder } from '../../../core/models/purchase-order.model';
import { AssignmentService } from '../../../core/services/assignment.service';
import { PurchaseOrderService } from '../../../core/services/purchase-order.service';
import { NotificationService } from '../../../core/services/notification.service';
import { ExchangeRateService } from '../../../core/services/exchange-rate.service';
import { exchangeRateRequiredWhenPen } from '../../../shared/utils/form-validators.util';
import { convertToUsd } from '../../../shared/utils/money-format.util';
import { UsdCurrencyPipe } from '../../../shared/pipes/usd-currency.pipe';

export interface PurchaseOrderFormData {
  purchaseOrder?: PurchaseOrder;
}

@Component({
  selector: 'app-purchase-order-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MonthPickerFieldComponent,
    UsdCurrencyPipe,
  ],
  templateUrl: './purchase-order-form.component.html',
  styleUrl: './purchase-order-form.component.scss',
})
export class PurchaseOrderFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly purchaseOrderService = inject(PurchaseOrderService);
  private readonly assignmentService = inject(AssignmentService);
  private readonly exchangeRateService = inject(ExchangeRateService);
  private readonly notification = inject(NotificationService);
  private readonly dialogRef = inject(MatDialogRef<PurchaseOrderFormComponent>);
  readonly data = inject<PurchaseOrderFormData>(MAT_DIALOG_DATA);

  isEdit = false;
  loading = false;
  assignments: Assignment[] = [];
  statuses = Object.keys(PURCHASE_ORDER_STATUS_CONFIG) as PurchaseOrderStatus[];
  statusLabels = Object.fromEntries(
    Object.entries(PURCHASE_ORDER_STATUS_CONFIG).map(([key, config]) => [key, config.label])
  ) as Record<PurchaseOrderStatus, string>;

  form = this.fb.nonNullable.group(
    {
      assignment_id: ['', Validators.required],
      period_month: ['', Validators.required],
      po_number: [''],
      status: ['PENDING' as PurchaseOrderStatus, Validators.required],
      amount: [0, [Validators.required, Validators.min(0)]],
      currency: ['USD' as 'USD' | 'PEN', Validators.required],
      exchange_rate: [null as number | null],
      comments: [''],
    },
    { validators: [exchangeRateRequiredWhenPen('currency', 'exchange_rate')] }
  );

  ngOnInit(): void {
    this.exchangeRateService.loadUsdPenRate();
    this.form.controls.currency.valueChanges.subscribe((currency) => {
      if (currency === 'PEN') {
        this.applyCurrentExchangeRate();
      }
    });

    this.assignmentService.getAssignments({ page_size: 100 }).subscribe((res) => {
      this.assignments = res.data.items;
    });

    if (this.data.purchaseOrder) {
      this.isEdit = true;
      this.form.patchValue({
        assignment_id: this.data.purchaseOrder.assignment_id,
        period_month: this.data.purchaseOrder.period_month,
        po_number: this.data.purchaseOrder.po_number ?? '',
        status: this.data.purchaseOrder.status,
        amount: this.data.purchaseOrder.amount,
        currency: this.data.purchaseOrder.currency,
        exchange_rate: this.data.purchaseOrder.exchange_rate ?? null,
        comments: this.data.purchaseOrder.comments ?? '',
      });
      this.form.controls.assignment_id.disable();
    }
  }

  get amountUsd(): number | null {
    const value = this.form.getRawValue();
    return convertToUsd(value.amount, value.currency, value.exchange_rate);
  }

  private applyCurrentExchangeRate(): void {
    const currentRate = this.form.controls.exchange_rate.value;
    if (currentRate && currentRate > 0) {
      return;
    }

    const cachedRate = this.exchangeRateService.getRateValue();
    if (cachedRate) {
      this.form.patchValue({ exchange_rate: cachedRate });
      return;
    }

    this.exchangeRateService.getUsdPenRate().subscribe((response) => {
      if (!response.success) {
        return;
      }
      const rate = this.exchangeRateService.getRateValue();
      if (rate && !this.form.controls.exchange_rate.value) {
        this.form.patchValue({ exchange_rate: rate });
      }
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    const value = this.form.getRawValue();

    const request$ = this.isEdit
      ? this.purchaseOrderService.updatePurchaseOrder(this.data.purchaseOrder!.id, {
          po_number: value.po_number || null,
          status: value.status,
          amount: value.amount,
          currency: value.currency,
          exchange_rate: value.currency === 'PEN' ? value.exchange_rate : null,
          comments: value.comments || null,
        })
      : this.purchaseOrderService.createPurchaseOrder({
          assignment_id: value.assignment_id,
          period_month: value.period_month,
          po_number: value.po_number || null,
          status: value.status,
          amount: value.amount,
          currency: value.currency,
          exchange_rate: value.currency === 'PEN' ? value.exchange_rate : null,
          comments: value.comments || null,
        });

    request$.subscribe({
      next: () => {
        this.notification.success(this.isEdit ? 'OC actualizada' : 'OC creada');
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
