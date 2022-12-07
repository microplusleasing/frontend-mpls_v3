import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CizCardTabComponent } from './ciz-card-tab.component';

describe('CizCardTabComponent', () => {
  let component: CizCardTabComponent;
  let fixture: ComponentFixture<CizCardTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CizCardTabComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CizCardTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
