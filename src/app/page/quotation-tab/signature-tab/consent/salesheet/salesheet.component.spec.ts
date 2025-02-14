import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesheetComponent } from './salesheet.component';

describe('SalesheetComponent', () => {
  let component: SalesheetComponent;
  let fixture: ComponentFixture<SalesheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SalesheetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
