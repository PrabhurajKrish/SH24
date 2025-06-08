import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PostcodeCheckerComponent } from 'src/postcode-checker/postcode-checker.component';
import { UploadCsvComponent } from 'src/upload-csv/upload-csv.component';

const routes: Routes = [
  { path: '', component: PostcodeCheckerComponent },
  { path: 'upload', component: UploadCsvComponent }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
