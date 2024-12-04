import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermissionUploadFacecompareDialogComponent } from './permission-upload-facecompare-dialog.component';

describe('PermissionUploadFacecompareDialogComponent', () => {
  let component: PermissionUploadFacecompareDialogComponent;
  let fixture: ComponentFixture<PermissionUploadFacecompareDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PermissionUploadFacecompareDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PermissionUploadFacecompareDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
