import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicSnackbarComponent } from './basic-snackbar.component';

describe('BasicSnackbarComponent', () => {
  let component: BasicSnackbarComponent;
  let fixture: ComponentFixture<BasicSnackbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BasicSnackbarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BasicSnackbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
