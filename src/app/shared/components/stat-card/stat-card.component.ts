import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './stat-card.component.html',
  styleUrl: './stat-card.component.scss',
})
export class StatCardComponent {
  @Input() title = '';
  @Input() value: string | number = '';
  @Input() subtitle = '';
  @Input() icon = 'insights';
  @Input() variant: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral' = 'primary';
}
