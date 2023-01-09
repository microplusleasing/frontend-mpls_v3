import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaceValidDialogComponent } from './face-valid-dialog.component';

describe('FaceValidDialogComponent', () => {
  let component: FaceValidDialogComponent;
  let fixture: ComponentFixture<FaceValidDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FaceValidDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FaceValidDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
