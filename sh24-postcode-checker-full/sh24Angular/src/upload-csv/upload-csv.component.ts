import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
    imports:[CommonModule,FormsModule,HttpClientModule],
  selector: 'app-upload-csv',
  templateUrl: './upload-csv.component.html',
  styleUrls: ['./upload-csv.component.scss'],
})
export class UploadCsvComponent {
  selectedType: string = 'manually_allowed';
  types: string[] = ['manually_allowed', 'allowed_lsoa_prefixes'];

  constructor(private http: HttpClient) {}

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file && file.name.endsWith('.csv')) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', this.selectedType);

      this.http.post('http://localhost:3000/api/upload-csv', formData,  { responseType: 'text' as 'text' }).subscribe({
        next: (res) => alert(res),
        error: (err) => alert('Upload failed: ' + err.message)
      });
    } else {
      alert('Please select a valid .csv file');
    }
  }
}
