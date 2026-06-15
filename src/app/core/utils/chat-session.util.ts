export const CHAT_CONVERSATION_ID_KEY = 'resourceHubChatConversationId';
export const CHAT_MESSAGES_KEY = 'resourceHubChatMessages';

export function clearChatSessionStorage(): void {
  sessionStorage.removeItem(CHAT_CONVERSATION_ID_KEY);
  sessionStorage.removeItem(CHAT_MESSAGES_KEY);
}
