import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MrtaInfoComponent } from './mrta-info.component';

describe('MrtaInfoComponent', () => {
  let component: MrtaInfoComponent;
  let fixture: ComponentFixture<MrtaInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MrtaInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MrtaInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
