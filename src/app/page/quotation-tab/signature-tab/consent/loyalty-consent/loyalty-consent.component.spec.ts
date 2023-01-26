import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoyaltyConsentComponent } from './loyalty-consent.component';

describe('LoyaltyConsentComponent', () => {
  let component: LoyaltyConsentComponent;
  let fixture: ComponentFixture<LoyaltyConsentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoyaltyConsentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoyaltyConsentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
