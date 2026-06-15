import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { toDate } from './date-format.util';

export function dateRangeValidator(startKey: string, endKey: string): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const start = toDate(group.get(startKey)?.value);
    const end = toDate(group.get(endKey)?.value);
    if (!start || !end) {
      return null;
    }
    return end >= start ? null : { dateRange: true };
  };
}

export function exchangeRateRequiredWhenPen(currencyKey: string, rateKey: string): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const currency = group.get(currencyKey)?.value;
    const rate = group.get(rateKey)?.value;
    if (currency === 'PEN' && (!rate || rate <= 0)) {
      return { exchangeRateRequired: true };
    }
    return null;
  };
}
