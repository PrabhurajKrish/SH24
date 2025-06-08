import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PostcodeCheckerComponent } from './postcode-checker.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

describe('PostcodeCheckerComponent', () => {
  let component: PostcodeCheckerComponent;
  let fixture: ComponentFixture<PostcodeCheckerComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, FormsModule],
      declarations: [PostcodeCheckerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PostcodeCheckerComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call API and show allowed message on success', () => {
    spyOn(window, 'alert');
    component.postcode = 'SW1A1AA';
    component.checkPostcode();

    const req = httpMock.expectOne('http://localhost:3000/check-postcode');
    expect(req.request.method).toBe('POST');
    expect(req.request.body.postcode).toBe('SW1A1AA');

    req.flush({ allowed: true, reason: 'Mock reason' });

    expect(component.result).toBe('Allowed: Mock reason');
    expect(window.alert).toHaveBeenCalledWith('Allowed: Mock reason');
  });

  it('should call API and show not allowed message on success with false', () => {
    spyOn(window, 'alert');
    component.postcode = 'INVALID123';
    component.checkPostcode();

    const req = httpMock.expectOne('http://localhost:3000/check-postcode');
    req.flush({ allowed: false, reason: 'Not in allowed list' });

    expect(component.result).toBe('Not allowed: Not in allowed list');
    expect(window.alert).toHaveBeenCalledWith('Not allowed: Not in allowed list');
  });

  // it('should handle API error and show error message', () => {
  //   spyOn(window, 'alert');
  //   component.postcode = 'ERROR123';
  //   component.checkPostcode();

  //   const req = httpMock.expectOne('http://localhost:3000/check-postcode');
  //   req.error(new ErrorEvent('Network error'));

  //   expect(component.result).toBe('Error checking postcode');
  //   expect(window.alert).toHaveBeenCalledWith('Error checking postcode');
  // });
});
