import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectorViewComponent } from './collector-view.component';

describe('CollectorViewComponent', () => {
  let component: CollectorViewComponent;
  let fixture: ComponentFixture<CollectorViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CollectorViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CollectorViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
