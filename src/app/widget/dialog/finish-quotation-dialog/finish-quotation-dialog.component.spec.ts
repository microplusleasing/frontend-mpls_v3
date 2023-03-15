import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinishQuotationDialogComponent } from './finish-quotation-dialog.component';

describe('FinishQuotationDialogComponent', () => {
  let component: FinishQuotationDialogComponent;
  let fixture: ComponentFixture<FinishQuotationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinishQuotationDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinishQuotationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
