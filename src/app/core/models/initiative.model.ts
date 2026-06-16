export interface Initiative {
  id: string;
  name: string;
  description?: string | null;
  responsible_manager_id?: string | null;
  budget_usd?: number | null;
  is_active: boolean;
}

export interface CreateInitiativeRequest {
  name: string;
  description?: string | null;
  responsible_manager_id?: string | null;
  budget_usd?: number | null;
}

export interface UpdateInitiativeRequest {
  name?: string;
  description?: string | null;
  responsible_manager_id?: string | null;
  budget_usd?: number | null;
  is_active?: boolean;
}
