import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QrBarcodeMrtaComponent } from './qr-barcode-mrta.component';

describe('QrBarcodeMrtaComponent', () => {
  let component: QrBarcodeMrtaComponent;
  let fixture: ComponentFixture<QrBarcodeMrtaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QrBarcodeMrtaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QrBarcodeMrtaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
