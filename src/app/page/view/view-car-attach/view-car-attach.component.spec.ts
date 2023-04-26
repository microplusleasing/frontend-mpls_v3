import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCarAttachComponent } from './view-car-attach.component';

describe('ViewCarAttachComponent', () => {
  let component: ViewCarAttachComponent;
  let fixture: ComponentFixture<ViewCarAttachComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewCarAttachComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewCarAttachComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
