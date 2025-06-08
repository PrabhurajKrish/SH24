import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports:[CommonModule,FormsModule,HttpClientModule],
  selector: 'app-postcode-checker',
  templateUrl: './postcode-checker.component.html',
  styleUrls: ['./postcode-checker.component.css'],
})
export class PostcodeCheckerComponent {
  postcode: any = '';
  result: string = '';

  constructor(private http: HttpClient) {}

  checkPostcode() {
const pi =3.14

    if(this.validate_postcode(this.postcode)){
this.http.post<any>(`http://localhost:3000/check-postcode`, { postcode: this.postcode })
      .subscribe({
        next: res => {this.result = res.allowed ? 'Allowed: ' + res.reason : 'Not allowed: ' + res.reason
          alert(this.result)
        },
        error: () => { this.result = 'Error checking postcode'
          alert(this.result)

        }
      });
    }


  }
  validate_postcode(postcode: string){

    return true
  }
}
