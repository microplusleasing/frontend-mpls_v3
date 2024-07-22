import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurposeChangeDialogComponent } from './purpose-change-dialog.component';

describe('PurposeChangeDialogComponent', () => {
  let component: PurposeChangeDialogComponent;
  let fixture: ComponentFixture<PurposeChangeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurposeChangeDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurposeChangeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
