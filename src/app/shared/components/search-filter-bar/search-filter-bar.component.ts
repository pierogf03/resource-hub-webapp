import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-search-filter-bar',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatIconModule],
  templateUrl: './search-filter-bar.component.html',
  styleUrl: './search-filter-bar.component.scss',
})
export class SearchFilterBarComponent implements OnInit {
  @Input() placeholder = 'Buscar...';
  @Output() searchChange = new EventEmitter<string>();

  searchControl = new FormControl('');

  ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((value) => this.searchChange.emit(value ?? ''));
  }
}
