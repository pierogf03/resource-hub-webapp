import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ASSIGNMENT_STATUS_CONFIG,
  AssignmentStatus,
  PURCHASE_ORDER_STATUS_CONFIG,
  PurchaseOrderStatus,
} from '../../../core/constants/status.constants';

@Component({
  selector: 'app-status-chip',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './status-chip.component.html',
  styleUrl: './status-chip.component.scss',
})
export class StatusChipComponent {
  @Input() status = '';
  @Input() type: 'assignment' | 'purchase-order' = 'assignment';

  get config(): { label: string; color: string; bg: string } {
    if (this.type === 'purchase-order') {
      return (
        PURCHASE_ORDER_STATUS_CONFIG[this.status as PurchaseOrderStatus] ?? {
          label: this.status,
          color: '#6b7280',
          bg: '#f3f4f6',
        }
      );
    }
    return (
      ASSIGNMENT_STATUS_CONFIG[this.status as AssignmentStatus] ?? {
        label: this.status,
        color: '#6b7280',
        bg: '#f3f4f6',
      }
    );
  }
}
