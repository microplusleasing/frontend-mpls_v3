import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackwardBarComponent } from './backward-bar.component';

describe('BackwardBarComponent', () => {
  let component: BackwardBarComponent;
  let fixture: ComponentFixture<BackwardBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BackwardBarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BackwardBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
