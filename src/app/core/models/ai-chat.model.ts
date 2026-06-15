export interface AiChatMessageRequest {
  message: string;
  conversation_id?: string | null;
  metadata?: AiChatMetadata;
}

export interface AiChatMetadata {
  source?: string;
  screen?: string;
}

export interface AiChatMessageResponse {
  conversation_id: string;
  reply: string;
  intent?: string | null;
  used_skills?: string[];
  suggested_questions?: string[];
  requires_confirmation: boolean;
  pending_action?: AiPendingAction | null;
  created_at?: string;
}

export interface AiPendingAction {
  action_id: string;
  action_type: 'generate_monthly_purchase_orders' | 'update_purchase_order_status' | string;
  summary: string;
  payload: unknown;
}

export interface AiChatConfirmActionRequest {
  conversation_id: string;
  action_id: string;
  approved: boolean;
  rejection_reason?: string | null;
}

export interface AiChatConfirmActionResponse {
  conversation_id: string;
  action_id: string;
  status: 'APPROVED' | 'REJECTED' | 'FAILED';
  reply: string;
  result?: unknown;
}

export type ChatMessageSource = 'user' | 'assistant' | 'system';

export interface ChatMessage {
  id: string;
  source: ChatMessageSource;
  content: string;
  created_at: string;
  is_loading?: boolean;
  used_skills?: string[];
  intent?: string | null;
  animate_typing?: boolean;
}
