import { ExpirationAlert } from '../constants/status.constants';

export interface PurchaseOrderStatusSummary {
  total: number;
  pending: number;
  coupa_generated: number;
  sent: number;
  approved: number;
  closed: number;
}

export interface ExpirationAlertSummary {
  green: number;
  amber: number;
  red: number;
}

export interface DashboardSummary {
  active_assignments: number;
  expiring_soon: number;
  expired: number;
  total_monthly_cost_usd: number;
  total_committed_cost_usd: number;
  purchase_orders: PurchaseOrderStatusSummary;
  expiration_alerts: ExpirationAlertSummary;
}

export interface ExpiringResource {
  assignment_id: string;
  consultant_name: string;
  technical_profile: string;
  provider_name: string;
  main_initiative_name: string;
  end_date: string;
  days_to_end: number;
  expiration_alert: ExpirationAlert;
}
