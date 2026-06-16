import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-file-upload-box',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './file-upload-box.component.html',
  styleUrl: './file-upload-box.component.scss',
})
export class FileUploadBoxComponent {
  @Input() accept = '.xlsx';
  @Input() label = 'Seleccionar archivo';
  @Output() fileSelected = new EventEmitter<File>();

  selectedFile: File | null = null;
  error = '';

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    this.error = '';

    if (!file) {
      return;
    }

    if (!file.name.toLowerCase().endsWith('.xlsx')) {
      this.error = 'Solo se permiten archivos .xlsx';
      this.selectedFile = null;
      return;
    }

    this.selectedFile = file;
    this.fileSelected.emit(file);
  }
}
