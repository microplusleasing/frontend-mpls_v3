import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BypassSignatureComponent } from './bypass-signature.component';

describe('BypassSignatureComponent', () => {
  let component: BypassSignatureComponent;
  let fixture: ComponentFixture<BypassSignatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BypassSignatureComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BypassSignatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
