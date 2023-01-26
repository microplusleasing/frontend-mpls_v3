import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignatureConsentComponent } from './signature-consent.component';

describe('SignatureConsentComponent', () => {
  let component: SignatureConsentComponent;
  let fixture: ComponentFixture<SignatureConsentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SignatureConsentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignatureConsentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
