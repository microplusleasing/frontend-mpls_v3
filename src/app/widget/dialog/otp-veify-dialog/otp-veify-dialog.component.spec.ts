import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtpVeifyDialogComponent } from './otp-veify-dialog.component';

describe('OtpVeifyDialogComponent', () => {
  let component: OtpVeifyDialogComponent;
  let fixture: ComponentFixture<OtpVeifyDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OtpVeifyDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OtpVeifyDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
