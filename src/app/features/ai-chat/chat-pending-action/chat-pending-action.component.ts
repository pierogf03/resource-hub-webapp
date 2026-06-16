import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AiPendingAction } from '../../../core/models/ai-chat.model';

@Component({
  selector: 'app-chat-pending-action',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './chat-pending-action.component.html',
  styleUrl: './chat-pending-action.component.scss',
})
export class ChatPendingActionComponent {
  @Input({ required: true }) pendingAction!: AiPendingAction;
  @Input() disabled = false;
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  get payloadSummary(): string {
    if (!this.pendingAction.payload) {
      return '';
    }
    try {
      return JSON.stringify(this.pendingAction.payload, null, 2);
    } catch {
      return String(this.pendingAction.payload);
    }
  }
}
