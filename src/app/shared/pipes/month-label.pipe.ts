import { Pipe, PipeTransform } from '@angular/core';
import { formatMonthYear } from '../utils/date-format.util';

@Pipe({ name: 'monthLabel', standalone: true })
export class MonthLabelPipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    return formatMonthYear(value);
  }
}
