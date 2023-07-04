import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DealerGradeImageDialogComponent } from './dealer-grade-image-dialog.component';

describe('DealerGradeImageDialogComponent', () => {
  let component: DealerGradeImageDialogComponent;
  let fixture: ComponentFixture<DealerGradeImageDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DealerGradeImageDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DealerGradeImageDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
