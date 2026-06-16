import { Component, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ChatPanelComponent } from '../chat-panel/chat-panel.component';

@Component({
  selector: 'app-chat-widget',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatTooltipModule, ChatPanelComponent],
  templateUrl: './chat-widget.component.html',
  styleUrl: './chat-widget.component.scss',
})
export class ChatWidgetComponent {
  readonly isOpen = signal(false);

  toggle(): void {
    this.isOpen.update((open) => !open);
  }

  close(): void {
    this.isOpen.set(false);
  }
}
