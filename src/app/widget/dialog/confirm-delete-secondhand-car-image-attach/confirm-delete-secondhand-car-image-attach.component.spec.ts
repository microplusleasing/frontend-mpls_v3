import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmDeleteSecondhandCarImageAttachComponent } from './confirm-delete-secondhand-car-image-attach.component';

describe('ConfirmDeleteSecondhandCarImageAttachComponent', () => {
  let component: ConfirmDeleteSecondhandCarImageAttachComponent;
  let fixture: ComponentFixture<ConfirmDeleteSecondhandCarImageAttachComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmDeleteSecondhandCarImageAttachComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmDeleteSecondhandCarImageAttachComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
