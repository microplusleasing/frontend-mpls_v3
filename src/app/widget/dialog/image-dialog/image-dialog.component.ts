import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-image-dialog',
  templateUrl: './image-dialog.component.html',
  styleUrls: ['./image-dialog.component.scss']
})
export class ImageDialogComponent implements OnInit {

  imagesrc = new BehaviorSubject<string>('')

  slide = 50;
  max = 150;
  min = 50;

  constructor(
    public dialogRef: MatDialogRef<ImageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { 
    this.imagesrc.next(data.imageurl ? data.imageurl : '/assets/image/placeholder-image.png')

  }

  ngOnInit(): void {
    // console.log(`this is Data : ${JSON.stringify(this.data)}`)
  }

  closeDialog() {
    this.dialogRef.close(true)
  }

}
