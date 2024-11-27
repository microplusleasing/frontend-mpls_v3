import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaceValidEditComponent } from './face-valid-edit.component';

describe('FaceValidEditComponent', () => {
  let component: FaceValidEditComponent;
  let fixture: ComponentFixture<FaceValidEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FaceValidEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FaceValidEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
