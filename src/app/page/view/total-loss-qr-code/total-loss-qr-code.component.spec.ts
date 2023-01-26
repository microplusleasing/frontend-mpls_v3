import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalLossQrCodeComponent } from './total-loss-qr-code.component';

describe('TotalLossQrCodeComponent', () => {
  let component: TotalLossQrCodeComponent;
  let fixture: ComponentFixture<TotalLossQrCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TotalLossQrCodeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TotalLossQrCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
