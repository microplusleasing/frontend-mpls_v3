import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateLivingNegoDialogComponent } from './create-living-nego-dialog.component';

describe('CreateLivingNegoDialogComponent', () => {
  let component: CreateLivingNegoDialogComponent;
  let fixture: ComponentFixture<CreateLivingNegoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateLivingNegoDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateLivingNegoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
