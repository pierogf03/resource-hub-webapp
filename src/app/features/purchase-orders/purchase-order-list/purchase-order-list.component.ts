import { Component, OnInit, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { PURCHASE_ORDER_STATUS_CONFIG, PurchaseOrderStatus } from '../../../core/constants/status.constants';
import { Assignment } from '../../../core/models/assignment.model';
import { Provider } from '../../../core/models/provider.model';
import { PurchaseOrder } from '../../../core/models/purchase-order.model';
import { AssignmentService } from '../../../core/services/assignment.service';
import { ProviderService } from '../../../core/services/provider.service';
import { PurchaseOrderService } from '../../../core/services/purchase-order.service';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { SearchFilterBarComponent } from '../../../shared/components/search-filter-bar/search-filter-bar.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { StatusChipComponent } from '../../../shared/components/status-chip/status-chip.component';
import { UsdCurrencyPipe } from '../../../shared/pipes/usd-currency.pipe';
import { MonthLabelPipe } from '../../../shared/pipes/month-label.pipe';
import { PurchaseOrderFormComponent } from '../purchase-order-form/purchase-order-form.component';

@Component({
  selector: 'app-purchase-order-list',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatSelectModule,
    PageHeaderComponent,
    SearchFilterBarComponent,
    LoadingSpinnerComponent,
    EmptyStateComponent,
    StatusChipComponent,
    UsdCurrencyPipe,
    MonthLabelPipe,
  ],
  templateUrl: './purchase-order-list.component.html',
  styleUrl: './purchase-order-list.component.scss',
})
export class PurchaseOrderListComponent implements OnInit {
  private readonly purchaseOrderService = inject(PurchaseOrderService);
  private readonly providerService = inject(ProviderService);
  private readonly assignmentService = inject(AssignmentService);
  private readonly dialog = inject(MatDialog);

  loading = true;
  purchaseOrders: PurchaseOrder[] = [];
  providers: Provider[] = [];
  assignments: Assignment[] = [];
  total = 0;
  page = 1;
  pageSize = 10;
  search = '';

  statusFilter = new FormControl<PurchaseOrderStatus | ''>('');
  providerFilter = new FormControl('');
  assignmentFilter = new FormControl('');
  periodFrom = new FormControl('');
  periodTo = new FormControl('');

  statuses = Object.keys(PURCHASE_ORDER_STATUS_CONFIG) as PurchaseOrderStatus[];

  displayedColumns = [
    'consultant_name',
    'provider_name',
    'period_month',
    'po_number',
    'status',
    'amount',
    'currency',
    'amount_usd',
    'actions',
  ];

  ngOnInit(): void {
    this.providerService.getProviders({ page_size: 100 }).subscribe((r) => (this.providers = r.data.items));
    this.assignmentService.getAssignments({ page_size: 100 }).subscribe((r) => (this.assignments = r.data.items));
    this.loadPurchaseOrders();
  }

  loadPurchaseOrders(): void {
    this.loading = true;
    this.purchaseOrderService
      .getPurchaseOrders({
        search: this.search,
        page: this.page,
        page_size: this.pageSize,
        status: this.statusFilter.value || undefined,
        provider_id: this.providerFilter.value || undefined,
        assignment_id: this.assignmentFilter.value || undefined,
        period_from: this.periodFrom.value || undefined,
        period_to: this.periodTo.value || undefined,
      })
      .subscribe({
        next: (response) => {
          this.purchaseOrders = response.data.items;
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
    this.loadPurchaseOrders();
  }

  onFilterChange(): void {
    this.page = 1;
    this.loadPurchaseOrders();
  }

  onPage(event: PageEvent): void {
    this.page = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadPurchaseOrders();
  }

  openForm(po?: PurchaseOrder): void {
    const ref = this.dialog.open(PurchaseOrderFormComponent, {
      width: '550px',
      data: { purchaseOrder: po },
    });
    ref.afterClosed().subscribe((saved) => {
      if (saved) {
        this.loadPurchaseOrders();
      }
    });
  }
}
