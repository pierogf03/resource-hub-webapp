export interface ExternalResource {
  id: string;
  consultant_name: string;
  technical_profile: string;
  document_number?: string | null;
  is_active: boolean;
}

export interface CreateExternalResourceRequest {
  consultant_name: string;
  technical_profile: string;
  document_number?: string | null;
}

export interface UpdateExternalResourceRequest {
  consultant_name?: string;
  technical_profile?: string;
  document_number?: string | null;
  is_active?: boolean;
}
