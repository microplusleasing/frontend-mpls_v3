import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EConsentImageDialogComponent } from './e-consent-image-dialog.component';

describe('EConsentImageDialogComponent', () => {
  let component: EConsentImageDialogComponent;
  let fixture: ComponentFixture<EConsentImageDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EConsentImageDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EConsentImageDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
