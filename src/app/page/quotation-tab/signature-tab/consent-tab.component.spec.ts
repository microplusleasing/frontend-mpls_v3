import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignatureTabComponent } from './consent-tab.component';

describe('SignatureTabComponent', () => {
  let component: SignatureTabComponent;
  let fixture: ComponentFixture<SignatureTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SignatureTabComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignatureTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
