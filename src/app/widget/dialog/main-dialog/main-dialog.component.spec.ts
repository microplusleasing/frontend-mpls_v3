import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainDialogComponent } from './main-dialog.component';

describe('MainDialogComponent', () => {
  let component: MainDialogComponent;
  let fixture: ComponentFixture<MainDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MainDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
