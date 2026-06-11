import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'daysLeft', standalone: true })
export class DaysLeftPipe implements PipeTransform {
  transform(days: number | null | undefined): string {
    if (days === null || days === undefined) {
      return '-';
    }
    if (days < 0) {
      return `Vencido (${Math.abs(days)} días)`;
    }
    if (days === 0) {
      return 'Vence hoy';
    }
    return `${days} días`;
  }
}
