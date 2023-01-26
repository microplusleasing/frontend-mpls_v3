import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendCarTabComponent } from './send-car-tab.component';

describe('SendCarTabComponent', () => {
  let component: SendCarTabComponent;
  let fixture: ComponentFixture<SendCarTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SendCarTabComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SendCarTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
