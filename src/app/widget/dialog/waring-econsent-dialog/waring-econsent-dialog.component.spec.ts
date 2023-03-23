import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WaringEconsentDialogComponent } from './waring-econsent-dialog.component';

describe('WaringEconsentDialogComponent', () => {
  let component: WaringEconsentDialogComponent;
  let fixture: ComponentFixture<WaringEconsentDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WaringEconsentDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WaringEconsentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
