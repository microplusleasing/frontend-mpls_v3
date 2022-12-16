import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CareerAndPurposeComponent } from './career-and-purpose.component';

describe('CareerAndPurposeComponent', () => {
  let component: CareerAndPurposeComponent;
  let fixture: ComponentFixture<CareerAndPurposeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CareerAndPurposeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CareerAndPurposeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
