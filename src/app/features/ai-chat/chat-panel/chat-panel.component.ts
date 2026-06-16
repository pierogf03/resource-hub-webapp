import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { finalize } from 'rxjs';
import { AiChatService } from '../../../core/services/ai-chat.service';
import {
  AiPendingAction,
  ChatMessage,
} from '../../../core/models/ai-chat.model';
import { ChatInputComponent } from '../chat-input/chat-input.component';
import { ChatMessageComponent } from '../chat-message/chat-message.component';
import {
  ChatSuggestionsComponent,
  DEFAULT_CHAT_SUGGESTIONS,
} from '../chat-suggestions/chat-suggestions.component';
import { ChatPendingActionComponent } from '../chat-pending-action/chat-pending-action.component';
import {
  CHAT_CONVERSATION_ID_KEY,
  CHAT_MESSAGES_KEY,
  clearChatSessionStorage,
} from '../../../core/utils/chat-session.util';

const HEADER_WELCOME_MESSAGES = [
  '¿Qué recursos están por vencer hoy?',
  'Revisa el presupuesto comprometido',
  'Pregúntame por las OCs pendientes del mes',
  'Te ayudo con importaciones y alertas en rojo',
  'Genera OCs mensuales con un solo mensaje',
] as const;

const WELCOME_ROTATION_MS = 4000;

@Component({
  selector: 'app-chat-panel',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    ChatMessageComponent,
    ChatInputComponent,
    ChatSuggestionsComponent,
    ChatPendingActionComponent,
  ],
  templateUrl: './chat-panel.component.html',
  styleUrl: './chat-panel.component.scss',
})
export class ChatPanelComponent implements OnChanges, OnDestroy {
  @Input() open = false;
  @Output() closePanel = new EventEmitter<void>();

  @ViewChild('messagesContainer') messagesContainer?: ElementRef<HTMLElement>;

  private readonly aiChat = inject(AiChatService);

  readonly isSending = signal(false);
  readonly conversationId = signal<string | null>(null);
  readonly messages = signal<ChatMessage[]>([]);
  readonly pendingAction = signal<AiPendingAction | null>(null);
  readonly suggestedQuestions = signal<string[]>([...DEFAULT_CHAT_SUGGESTIONS]);
  readonly errorMessage = signal<string | null>(null);
  readonly isConfirming = signal(false);
  readonly headerWelcomeMessage = signal<string>(HEADER_WELCOME_MESSAGES[0]);
  readonly welcomeMessageKey = signal(0);
  readonly typingMessageId = signal<string | null>(null);

  private hasLoadedSession = false;
  private welcomeIndex = 0;
  private welcomeInterval?: ReturnType<typeof setInterval>;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['open']?.currentValue) {
      if (!this.hasLoadedSession) {
        this.loadSession();
        this.hasLoadedSession = true;
      }
      this.startWelcomeRotation();
    }

    if (changes['open'] && !changes['open'].currentValue) {
      this.stopWelcomeRotation();
    }
  }

  ngOnDestroy(): void {
    this.stopWelcomeRotation();
  }

  get showSuggestions(): boolean {
    return this.messages().length === 0 && !this.isSending();
  }

  get showFollowUpSuggestions(): boolean {
    return (
      this.messages().length > 0 &&
      this.suggestedQuestions().length > 0 &&
      !this.isSending() &&
      !this.typingMessageId()
    );
  }

  onTypingTick(messageId: string): void {
    if (this.typingMessageId() === messageId) {
      this.scrollToBottom();
    }
  }

  onTypingComplete(messageId: string): void {
    if (this.typingMessageId() === messageId) {
      this.typingMessageId.set(null);
      this.messages.update((msgs) =>
        msgs.map((m) =>
          m.id === messageId ? { ...m, animate_typing: false } : m
        )
      );
      this.persistSession();
      this.scrollToBottom();
    }
  }

  onClose(): void {
    this.closePanel.emit();
  }

  onClearConversation(): void {
    this.messages.set([]);
    this.conversationId.set(null);
    this.pendingAction.set(null);
    this.suggestedQuestions.set([...DEFAULT_CHAT_SUGGESTIONS]);
    this.errorMessage.set(null);
    this.persistSession();
  }

  onSendMessage(text: string): void {
    if (this.isSending()) {
      return;
    }

    this.errorMessage.set(null);
    const userMessage = this.createMessage('user', text);
    const loadingId = crypto.randomUUID();
    const loadingMessage: ChatMessage = {
      id: loadingId,
      source: 'assistant',
      content: '',
      created_at: new Date().toISOString(),
      is_loading: true,
    };

    this.messages.update((msgs) => [...msgs, userMessage, loadingMessage]);
    this.isSending.set(true);
    this.scrollToBottom();

    this.aiChat
      .sendMessage({
        message: text,
        conversation_id: this.conversationId(),
        metadata: { source: 'resource_hub_web' },
      })
      .pipe(finalize(() => this.isSending.set(false)))
      .subscribe({
        next: (response) => {
          this.messages.update((msgs) => msgs.filter((m) => m.id !== loadingId));

          if (!response.success || !response.data?.reply) {
            this.errorMessage.set('No se recibió una respuesta válida del asistente.');
            this.persistSession();
            return;
          }

          const data = response.data;
          this.conversationId.set(data.conversation_id);

          const assistantMessage = this.createMessage('assistant', data.reply, {
            used_skills: data.used_skills,
            intent: data.intent,
            animate_typing: true,
          });
          this.typingMessageId.set(assistantMessage.id);
          this.messages.update((msgs) => [...msgs, assistantMessage]);

          if (data.suggested_questions?.length) {
            this.suggestedQuestions.set(data.suggested_questions);
          }

          if (data.requires_confirmation && data.pending_action) {
            this.pendingAction.set(data.pending_action);
          } else {
            this.pendingAction.set(null);
          }

          this.persistSession();
          this.scrollToBottom();
        },
        error: (error) => this.handleHttpError(error, loadingId),
      });
  }

  onSelectSuggestion(suggestion: string): void {
    this.onSendMessage(suggestion);
  }

  onConfirmAction(): void {
    const action = this.pendingAction();
    const convId = this.conversationId();
    if (!action || !convId || this.isConfirming()) {
      return;
    }

    this.processActionConfirmation({
      conversation_id: convId,
      action_id: action.action_id,
      approved: true,
      rejection_reason: null,
    });
  }

  onCancelAction(): void {
    const action = this.pendingAction();
    const convId = this.conversationId();
    if (!action || !convId || this.isConfirming()) {
      return;
    }

    this.processActionConfirmation({
      conversation_id: convId,
      action_id: action.action_id,
      approved: false,
      rejection_reason: 'El usuario canceló la acción desde el chat',
    });
  }

  private processActionConfirmation(request: {
    conversation_id: string;
    action_id: string;
    approved: boolean;
    rejection_reason: string | null;
  }): void {
    this.errorMessage.set(null);
    this.isConfirming.set(true);

    const systemText = request.approved
      ? 'Procesando la acción confirmada...'
      : 'Acción cancelada. No se realizó ningún cambio.';

    this.messages.update((msgs) => [
      ...msgs,
      this.createMessage('system', systemText),
    ]);

    this.aiChat
      .confirmAction(request)
      .pipe(finalize(() => this.isConfirming.set(false)))
      .subscribe({
        next: (response) => {
          this.pendingAction.set(null);

          if (request.approved) {
            if (!response.success || !response.data?.reply) {
              this.errorMessage.set('No se pudo completar la acción solicitada.');
            } else {
              const data = response.data;
              this.conversationId.set(data.conversation_id);
              const assistantMessage = this.createMessage('assistant', data.reply, {
                animate_typing: true,
              });
              this.typingMessageId.set(assistantMessage.id);
              this.messages.update((msgs) => [...msgs, assistantMessage]);
            }
          }

          this.persistSession();
          this.scrollToBottom();
        },
        error: (error) => {
          this.pendingAction.set(null);
          this.handleConfirmError(error);
        },
      });
  }

  private handleHttpError(error: unknown, loadingId: string): void {
    this.messages.update((msgs) => msgs.filter((m) => m.id !== loadingId));
    this.errorMessage.set(this.mapHttpError(error));
    this.persistSession();
  }

  private handleConfirmError(error: unknown): void {
    this.errorMessage.set(
      this.mapHttpError(error, 'No se pudo completar la acción solicitada.')
    );
    this.persistSession();
  }

  private mapHttpError(error: unknown, fallback = 'Ocurrió un error al contactar al asistente.'): string {
    if (!(error instanceof HttpErrorResponse)) {
      return fallback;
    }

    switch (error.status) {
      case 403:
        return 'No tienes permisos para usar el asistente o ejecutar esta acción.';
      case 504:
        return 'El asistente está tardando más de lo esperado. Intenta nuevamente.';
      case 500:
      case 502:
      case 503:
        return 'Ocurrió un error al contactar al asistente.';
      default:
        return fallback;
    }
  }

  private createMessage(
    source: ChatMessage['source'],
    content: string,
    extra?: Partial<ChatMessage>
  ): ChatMessage {
    return {
      id: crypto.randomUUID(),
      source,
      content,
      created_at: new Date().toISOString(),
      ...extra,
    };
  }

  private loadSession(): void {
    try {
      const storedId = sessionStorage.getItem(CHAT_CONVERSATION_ID_KEY);
      const storedMessages = sessionStorage.getItem(CHAT_MESSAGES_KEY);

      if (storedId) {
        this.conversationId.set(storedId);
      }

      if (storedMessages) {
        const parsed = JSON.parse(storedMessages) as ChatMessage[];
        if (Array.isArray(parsed)) {
          this.messages.set(
            parsed
              .filter((m) => !m.is_loading)
              .map((m) => ({ ...m, animate_typing: false }))
          );
        }
      }
    } catch {
      clearChatSessionStorage();
    }
  }

  private persistSession(): void {
    const convId = this.conversationId();
    if (convId) {
      sessionStorage.setItem(CHAT_CONVERSATION_ID_KEY, convId);
    } else {
      sessionStorage.removeItem(CHAT_CONVERSATION_ID_KEY);
    }

    const toStore = this.messages().filter((m) => !m.is_loading);
    sessionStorage.setItem(CHAT_MESSAGES_KEY, JSON.stringify(toStore));
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      const el = this.messagesContainer?.nativeElement;
      if (el) {
        el.scrollTop = el.scrollHeight;
      }
    }, 50);
  }

  private startWelcomeRotation(): void {
    this.stopWelcomeRotation();
    this.welcomeIndex = 0;
    this.headerWelcomeMessage.set(HEADER_WELCOME_MESSAGES[0]);
    this.welcomeMessageKey.set(0);

    this.welcomeInterval = setInterval(() => {
      this.welcomeIndex = (this.welcomeIndex + 1) % HEADER_WELCOME_MESSAGES.length;
      this.headerWelcomeMessage.set(HEADER_WELCOME_MESSAGES[this.welcomeIndex]);
      this.welcomeMessageKey.update((key) => key + 1);
    }, WELCOME_ROTATION_MS);
  }

  private stopWelcomeRotation(): void {
    if (this.welcomeInterval) {
      clearInterval(this.welcomeInterval);
      this.welcomeInterval = undefined;
    }
  }
}
