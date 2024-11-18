import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-permission-upload-facecompare-dialog',
  templateUrl: './permission-upload-facecompare-dialog.component.html',
  styleUrl: './permission-upload-facecompare-dialog.component.scss'
})
export class PermissionUploadFacecompareDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<PermissionUploadFacecompareDialogComponent>
  ) { }

  closeDialog() {
    this.dialogRef.close()
  }
}
