import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamineSendCarImageComponent } from './examine-send-car-image.component';

describe('ExamineSendCarImageComponent', () => {
  let component: ExamineSendCarImageComponent;
  let fixture: ComponentFixture<ExamineSendCarImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExamineSendCarImageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExamineSendCarImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
