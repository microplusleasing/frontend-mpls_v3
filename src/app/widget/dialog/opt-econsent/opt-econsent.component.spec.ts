import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OptEconsentComponent } from './opt-econsent.component';

describe('OptEconsentComponent', () => {
  let component: OptEconsentComponent;
  let fixture: ComponentFixture<OptEconsentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OptEconsentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OptEconsentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
