import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OracleBackwardComponent } from './oracle-backward.component';

describe('OracleBackwardComponent', () => {
  let component: OracleBackwardComponent;
  let fixture: ComponentFixture<OracleBackwardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OracleBackwardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OracleBackwardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
