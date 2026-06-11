import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function dateRangeValidator(startKey: string, endKey: string): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const start = group.get(startKey)?.value;
    const end = group.get(endKey)?.value;
    if (!start || !end) {
      return null;
    }
    return new Date(end) >= new Date(start) ? null : { dateRange: true };
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
