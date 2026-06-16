import { Pipe, PipeTransform } from '@angular/core';
import { formatPen } from '../utils/money-format.util';

@Pipe({ name: 'penCurrency', standalone: true })
export class PenCurrencyPipe implements PipeTransform {
  transform(value: number | null | undefined): string {
    return formatPen(value);
  }
}
