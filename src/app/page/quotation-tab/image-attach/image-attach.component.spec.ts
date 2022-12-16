import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageAttachComponent } from './image-attach.component';

describe('ImageAttachComponent', () => {
  let component: ImageAttachComponent;
  let fixture: ComponentFixture<ImageAttachComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImageAttachComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImageAttachComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
