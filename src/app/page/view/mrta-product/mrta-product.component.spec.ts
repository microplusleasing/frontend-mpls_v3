import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MrtaProductComponent } from './mrta-product.component';

describe('MrtaProductComponent', () => {
  let component: MrtaProductComponent;
  let fixture: ComponentFixture<MrtaProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MrtaProductComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MrtaProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
