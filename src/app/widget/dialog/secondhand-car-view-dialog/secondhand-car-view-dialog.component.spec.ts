import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecondhandCarViewDialogComponent } from './secondhand-car-view-dialog.component';

describe('SecondhandCarViewDialogComponent', () => {
  let component: SecondhandCarViewDialogComponent;
  let fixture: ComponentFixture<SecondhandCarViewDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SecondhandCarViewDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SecondhandCarViewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
