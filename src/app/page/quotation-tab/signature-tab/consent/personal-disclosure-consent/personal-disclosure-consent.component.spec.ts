import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalDisclosureConsentComponent } from './personal-disclosure-consent.component';

describe('PersonalDisclosureConsentComponent', () => {
  let component: PersonalDisclosureConsentComponent;
  let fixture: ComponentFixture<PersonalDisclosureConsentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PersonalDisclosureConsentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonalDisclosureConsentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
