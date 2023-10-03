import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MrtaProductNewComponent } from './mrta-product-new.component';

describe('MrtaProductNewComponent', () => {
  let component: MrtaProductNewComponent;
  let fixture: ComponentFixture<MrtaProductNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MrtaProductNewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MrtaProductNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
