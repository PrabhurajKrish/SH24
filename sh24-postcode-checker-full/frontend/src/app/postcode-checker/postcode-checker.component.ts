import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-postcode-checker',
  templateUrl: './postcode-checker.component.html',
  styleUrls: ['./postcode-checker.component.css']
})
export class PostcodeCheckerComponent {
  postcode: string = '';
  result: string = '';

  constructor(private http: HttpClient) {}

  checkPostcode() {
    this.http.post<any>('http://localhost:3000/check-postcode', { postcode: this.postcode })
      .subscribe({
        next: res => this.result = res.allowed ? '✅ Allowed: ' + res.reason : '❌ Not allowed: ' + res.reason,
        error: () => this.result = 'Error checking postcode'
      });
  }
}
