import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecondhandCarAttachImageDialogComponent } from './secondhand-car-attach-image-dialog.component';

describe('SecondhandCarAttachImageDialogComponent', () => {
  let component: SecondhandCarAttachImageDialogComponent;
  let fixture: ComponentFixture<SecondhandCarAttachImageDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SecondhandCarAttachImageDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SecondhandCarAttachImageDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
