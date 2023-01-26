import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewsignComponent } from './viewsign.component';

describe('ViewsignComponent', () => {
  let component: ViewsignComponent;
  let fixture: ComponentFixture<ViewsignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewsignComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewsignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
