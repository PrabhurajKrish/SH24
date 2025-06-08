import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UploadCsvComponent } from './upload-csv.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';

describe('UploadCsvComponent', () => {
  let component: UploadCsvComponent;
  let fixture: ComponentFixture<UploadCsvComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, FormsModule],
      declarations: [UploadCsvComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(UploadCsvComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should upload CSV file successfully', () => {
    const mockFile = new File(['a,b\n1,2'], 'test.csv', { type: 'text/csv' });
    const mockEvent = {
      target: {
        files: [mockFile]
      }
    };

    spyOn(window, 'alert');
    component.onFileSelected(mockEvent as any);

    const req = httpMock.expectOne('http://localhost:3000/api/upload-csv');
    expect(req.request.method).toBe('POST');
    expect(req.request.body instanceof FormData).toBeTrue();
    req.flush('Successfully replaced manually_allowed.csv');

    expect(window.alert).toHaveBeenCalledWith('Upload successful');
  });

  it('should show error on upload failure', () => {
    const mockFile = new File(['a,b\n1,2'], 'test.csv', { type: 'text/csv' });
    const mockEvent = {
      target: {
        files: [mockFile]
      }
    };

    spyOn(window, 'alert');
    component.onFileSelected(mockEvent as any);

    const req = httpMock.expectOne('http://localhost:3000/api/upload-csv');
    req.error(new ErrorEvent('Upload failed'));

    expect(window.alert).toHaveBeenCalledWith(jasmine.stringMatching(/^Upload failed:/));
  });

  it('should reject non-CSV files', () => {
    const mockFile = new File(['x'], 'test.txt', { type: 'text/plain' });
    const mockEvent = {
      target: {
        files: [mockFile]
      }
    };

    spyOn(window, 'alert');
    component.onFileSelected(mockEvent as any);

    httpMock.expectNone('http://localhost:3000/api/upload-csv');
    expect(window.alert).toHaveBeenCalledWith('Please select a valid .csv file');
  });
});
