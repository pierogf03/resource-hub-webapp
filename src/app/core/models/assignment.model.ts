import { AssignmentStatus, ExpirationAlert } from '../constants/status.constants';

export interface AssignmentInitiativeItem {
  initiative_id: string;
  initiative_name?: string;
  allocation_percentage: number;
  is_primary: boolean;
  is_funding_source: boolean;
}

export interface Assignment {
  id: string;
  resource_id?: string;
  provider_id?: string;
  main_initiative_id?: string;
  manager_id?: string;
  analyst_responsible_id?: string | null;
  comments?: string | null;
  initiatives?: AssignmentInitiativeItem[];
  consultant_name: string;
  technical_profile: string;
  provider_name: string;
  main_initiative_name: string;
  manager_name: string;
  analyst_responsible_name?: string | null;
  start_date: string;
  end_date: string;
  duration_months: number;
  monthly_cost: number;
  currency: 'USD' | 'PEN';
  exchange_rate?: number | null;
  monthly_cost_usd: number;
  total_cost_usd: number;
  status: AssignmentStatus;
  days_to_end: number;
  expiration_alert: ExpirationAlert;
  purchase_orders_count: number;
}

export interface AssignmentInitiativeRequest {
  initiative_id: string;
  allocation_percentage: number;
  is_primary: boolean;
  is_funding_source: boolean;
}

export interface CreateAssignmentRequest {
  resource_id: string;
  provider_id: string;
  main_initiative_id: string;
  manager_id: string;
  analyst_responsible_id?: string | null;
  start_date: string;
  end_date: string;
  duration_months: number;
  monthly_cost: number;
  currency: 'USD' | 'PEN';
  exchange_rate?: number | null;
  comments?: string | null;
  initiatives: AssignmentInitiativeRequest[];
}

export interface UpdateAssignmentRequest extends Partial<CreateAssignmentRequest> {
  status?: AssignmentStatus;
}

export interface GeneratePurchaseOrdersRequest {
  overwrite_existing: boolean;
}

export interface GeneratedPurchaseOrder {
  id: string;
  period_month: string;
  status: string;
  amount_usd: number;
}

export interface GeneratePurchaseOrdersResponse {
  assignment_id: string;
  generated_count: number;
  skipped_count: number;
  items: GeneratedPurchaseOrder[];
}
