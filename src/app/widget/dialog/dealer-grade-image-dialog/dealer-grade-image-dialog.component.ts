import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-dealer-grade-image-dialog',
  templateUrl: './dealer-grade-image-dialog.component.html',
  styleUrls: ['./dealer-grade-image-dialog.component.scss']
})
export class DealerGradeImageDialogComponent implements OnInit {

  imagesrc = new BehaviorSubject<string>('')

  constructor(
    public dialogRef: MatDialogRef<DealerGradeImageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.imagesrc.next(data.imageurl ? data.imageurl : '/assets/image/placeholder-image.png')
  }

  ngOnInit(): void {
  }

  closeDialog() {
    this.dialogRef.close(true)
  }

}
