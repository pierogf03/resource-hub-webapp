import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

const MAX_MESSAGE_LENGTH = 4000;

@Component({
  selector: 'app-chat-input',
  standalone: true,
  imports: [FormsModule, MatButtonModule, MatIconModule],
  templateUrl: './chat-input.component.html',
  styleUrl: './chat-input.component.scss',
})
export class ChatInputComponent {
  @Input() disabled = false;
  @Output() send = new EventEmitter<string>();
  @ViewChild('textareaRef') textareaRef?: ElementRef<HTMLTextAreaElement>;

  message = '';
  readonly maxLength = MAX_MESSAGE_LENGTH;

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.submit();
    }
  }

  submit(): void {
    const trimmed = this.message.trim();
    if (!trimmed || this.disabled) {
      return;
    }
    this.send.emit(trimmed);
    this.message = '';
    this.resetTextareaHeight();
  }

  autoResize(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
  }

  private resetTextareaHeight(): void {
    const textarea = this.textareaRef?.nativeElement;
    if (textarea) {
      textarea.style.height = 'auto';
    }
  }

  get charCount(): number {
    return this.message.length;
  }

  get isOverLimit(): boolean {
    return this.message.length > MAX_MESSAGE_LENGTH;
  }

  get canSend(): boolean {
    return !!this.message.trim() && !this.disabled && !this.isOverLimit;
  }
}
