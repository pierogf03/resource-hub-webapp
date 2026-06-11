export interface Provider {
  id: string;
  name: string;
  ruc?: string | null;
  contact_name?: string | null;
  contact_email?: string | null;
  is_active: boolean;
  created_at?: string;
}

export interface CreateProviderRequest {
  name: string;
  ruc?: string | null;
  contact_name?: string | null;
  contact_email?: string | null;
}

export interface UpdateProviderRequest {
  name?: string;
  ruc?: string | null;
  contact_name?: string | null;
  contact_email?: string | null;
  is_active?: boolean;
}
