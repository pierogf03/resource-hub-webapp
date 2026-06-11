import { Pipe, PipeTransform } from '@angular/core';
import { formatUsd } from '../utils/money-format.util';

@Pipe({ name: 'usdCurrency', standalone: true })
export class UsdCurrencyPipe implements PipeTransform {
  transform(value: number | null | undefined): string {
    return formatUsd(value);
  }
}
