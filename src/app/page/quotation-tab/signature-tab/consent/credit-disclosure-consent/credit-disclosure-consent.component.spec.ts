import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditDisclosureConsentComponent } from './credit-disclosure-consent.component';

describe('CreditDisclosureConsentComponent', () => {
  let component: CreditDisclosureConsentComponent;
  let fixture: ComponentFixture<CreditDisclosureConsentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreditDisclosureConsentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreditDisclosureConsentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
