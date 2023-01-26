import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MrtaListComponent } from './mrta-list.component';

describe('MrtaListComponent', () => {
  let component: MrtaListComponent;
  let fixture: ComponentFixture<MrtaListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MrtaListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MrtaListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
