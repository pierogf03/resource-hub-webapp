import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ChatMessage } from '../../../core/models/ai-chat.model';
import { ChatMarkdownPipe } from '../../../shared/pipes/chat-markdown.pipe';

@Component({
  selector: 'app-chat-message',
  standalone: true,
  imports: [MatIconModule, MatProgressSpinnerModule, ChatMarkdownPipe],
  templateUrl: './chat-message.component.html',
  styleUrl: './chat-message.component.scss',
})
export class ChatMessageComponent implements OnChanges, OnDestroy {
  @Input({ required: true }) message!: ChatMessage;
  @Output() typingTick = new EventEmitter<void>();
  @Output() typingComplete = new EventEmitter<void>();

  displayedContent = '';
  isTyping = false;
  skillsExpanded = false;

  private typingTimer?: ReturnType<typeof setTimeout>;
  private charIndex = 0;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['message']) {
      this.skillsExpanded = false;
      this.setupContent();
    }
  }

  ngOnDestroy(): void {
    this.clearTypingTimer();
  }

  get isUser(): boolean {
    return this.message.source === 'user';
  }

  get isAssistant(): boolean {
    return this.message.source === 'assistant';
  }

  get isSystem(): boolean {
    return this.message.source === 'system';
  }

  get showMetadata(): boolean {
    return !this.message.is_loading && !this.isTyping;
  }

  get renderAsMarkdown(): boolean {
    return this.isAssistant && !this.isTyping;
  }

  get contentToShow(): string {
    return this.isAssistant ? this.displayedContent : this.message.content;
  }

  toggleSkills(event: Event): void {
    event.preventDefault();
    this.skillsExpanded = !this.skillsExpanded;
  }

  private setupContent(): void {
    this.clearTypingTimer();

    if (this.message.is_loading || !this.isAssistant) {
      this.displayedContent = this.message.content;
      this.isTyping = false;
      return;
    }

    if (this.message.animate_typing) {
      this.isTyping = true;
      this.displayedContent = '';
      this.charIndex = 0;
      this.scheduleTypeChunk();
      return;
    }

    this.displayedContent = this.message.content;
    this.isTyping = false;
  }

  private scheduleTypeChunk(): void {
    const full = this.message.content;

    if (this.charIndex >= full.length) {
      this.isTyping = false;
      this.typingComplete.emit();
      return;
    }

    const chunkSize = full.length > 500 ? 4 : full.length > 200 ? 2 : 1;
    this.charIndex = Math.min(this.charIndex + chunkSize, full.length);
    this.displayedContent = full.slice(0, this.charIndex);
    this.typingTick.emit();

    const delay = full.length > 400 ? 10 : full.length > 150 ? 16 : 24;
    this.typingTimer = setTimeout(() => this.scheduleTypeChunk(), delay);
  }

  private clearTypingTimer(): void {
    if (this.typingTimer) {
      clearTimeout(this.typingTimer);
      this.typingTimer = undefined;
    }
  }
}
