import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvancePaymentQrCodeComponent } from './advance-payment-qr-code.component';

describe('AdvancePaymentQrCodeComponent', () => {
  let component: AdvancePaymentQrCodeComponent;
  let fixture: ComponentFixture<AdvancePaymentQrCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdvancePaymentQrCodeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdvancePaymentQrCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
