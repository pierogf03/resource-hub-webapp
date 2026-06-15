import { Component, EventEmitter, Input, Output, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  formatApiMonth,
  formatMonthYear,
  parseApiMonth,
} from '../../utils/date-format.util';

@Component({
  selector: 'app-month-picker-field',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatDatepickerModule],
  templateUrl: './month-picker-field.component.html',
  styleUrl: './month-picker-field.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MonthPickerFieldComponent),
      multi: true,
    },
  ],
})
export class MonthPickerFieldComponent implements ControlValueAccessor {
  @Input() label = 'Periodo';
  @Output() valueChange = new EventEmitter<string>();

  selectedDate: Date | null = null;
  displayValue = '';
  disabled = false;

  private onChange: (value: string) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  writeValue(value: string | null): void {
    this.selectedDate = parseApiMonth(value);
    this.displayValue = formatMonthYear(this.selectedDate);
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onMonthSelected(date: Date, picker: MatDatepicker<Date>): void {
    this.selectedDate = date;
    this.displayValue = formatMonthYear(date);
    const formatted = formatApiMonth(date);
    this.onChange(formatted);
    this.onTouched();
    this.valueChange.emit(formatted);
    picker.close();
  }

  onBlur(): void {
    this.onTouched();
  }
}
