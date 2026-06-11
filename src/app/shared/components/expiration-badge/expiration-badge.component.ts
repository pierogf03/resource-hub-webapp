import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  EXPIRATION_ALERT_CONFIG,
  ExpirationAlert,
} from '../../../core/constants/status.constants';
import { DaysLeftPipe } from '../../pipes/days-left.pipe';

@Component({
  selector: 'app-expiration-badge',
  standalone: true,
  imports: [CommonModule, DaysLeftPipe],
  templateUrl: './expiration-badge.component.html',
  styleUrl: './expiration-badge.component.scss',
})
export class ExpirationBadgeComponent {
  @Input() alert: ExpirationAlert = 'GREEN';
  @Input() daysToEnd?: number;

  get config() {
    return EXPIRATION_ALERT_CONFIG[this.alert];
  }
}
