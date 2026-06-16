import { PurchaseOrderStatus } from '../constants/status.constants';

export interface PurchaseOrder {
  id: string;
  assignment_id: string;
  consultant_name: string;
  provider_name: string;
  period_month: string;
  po_number?: string | null;
  status: PurchaseOrderStatus;
  amount: number;
  currency: 'USD' | 'PEN';
  exchange_rate?: number | null;
  amount_usd: number;
  comments?: string | null;
}

export interface CreatePurchaseOrderRequest {
  assignment_id: string;
  period_month: string;
  po_number?: string | null;
  status: string;
  amount: number;
  currency: 'USD' | 'PEN';
  exchange_rate?: number | null;
  comments?: string | null;
}

export interface UpdatePurchaseOrderRequest {
  po_number?: string | null;
  status?: string;
  amount?: number;
  currency?: 'USD' | 'PEN';
  exchange_rate?: number | null;
  comments?: string | null;
}
