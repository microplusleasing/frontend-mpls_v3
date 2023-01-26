import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EPaperConsentComponent } from './e-paper-consent.component';

describe('EPaperConsentComponent', () => {
  let component: EPaperConsentComponent;
  let fixture: ComponentFixture<EPaperConsentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EPaperConsentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EPaperConsentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
