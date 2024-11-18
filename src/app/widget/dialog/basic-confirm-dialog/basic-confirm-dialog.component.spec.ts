import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicConfirmDialogComponent } from './basic-confirm-dialog.component';

describe('BasicConfirmDialogComponent', () => {
  let component: BasicConfirmDialogComponent;
  let fixture: ComponentFixture<BasicConfirmDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BasicConfirmDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BasicConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
