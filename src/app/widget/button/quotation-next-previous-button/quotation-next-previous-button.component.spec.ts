import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotationNextPreviousButtonComponent } from './quotation-next-previous-button.component';

describe('QuotationNextPreviousButtonComponent', () => {
  let component: QuotationNextPreviousButtonComponent;
  let fixture: ComponentFixture<QuotationNextPreviousButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuotationNextPreviousButtonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuotationNextPreviousButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
