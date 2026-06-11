import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'monthLabel', standalone: true })
export class MonthLabelPipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value) {
      return '-';
    }
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      return value;
    }
    return date.toLocaleDateString('es-PE', { year: 'numeric', month: 'long' });
  }
}
