export interface ImportCreatedSummary {
  providers: number;
  initiatives: number;
  external_resources: number;
  assignments: number;
  purchase_orders: number;
}

export interface ImportError {
  row_number: number;
  column_name?: string | null;
  error_message: string;
  raw_data?: unknown;
}

export interface HistoricalImportResult {
  batch_id: string;
  file_name: string;
  status: 'PROCESSING' | 'COMPLETED' | 'COMPLETED_WITH_ERRORS' | 'FAILED';
  total_rows: number;
  successful_rows: number;
  failed_rows: number;
  created: ImportCreatedSummary;
  errors: ImportError[];
}

export interface ImportBatch {
  id: string;
  file_name: string;
  imported_by: string;
  total_rows: number;
  successful_rows: number;
  failed_rows: number;
  status: string;
  created_at: string;
}
