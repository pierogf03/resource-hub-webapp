import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

export const DEFAULT_CHAT_SUGGESTIONS = [
  'Dame un resumen del área',
  '¿Qué recursos están por vencer?',
  '¿Qué recursos están en rojo?',
  '¿Cuántas OCs están pendientes?',
  'Muéstrame las OCs de este mes',
  '¿Cuál es el presupuesto comprometido?',
  '¿Cómo salió la última importación?',
] as const;

@Component({
  selector: 'app-chat-suggestions',
  standalone: true,
  imports: [MatChipsModule, MatIconModule],
  templateUrl: './chat-suggestions.component.html',
  styleUrl: './chat-suggestions.component.scss',
})
export class ChatSuggestionsComponent {
  @Input() suggestions: string[] = [...DEFAULT_CHAT_SUGGESTIONS];
  @Input() disabled = false;
  @Output() selectSuggestion = new EventEmitter<string>();

  onSelect(suggestion: string): void {
    if (!this.disabled) {
      this.selectSuggestion.emit(suggestion);
    }
  }
}
