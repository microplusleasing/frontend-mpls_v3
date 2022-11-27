import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IDialog } from 'src/app/interface/i-dialog';

@Component({
  selector: 'app-main-dialog',
  templateUrl: './main-dialog.component.html',
  styleUrls: ['./main-dialog.component.scss']
})
export class MainDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<MainDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IDialog,
  ) { }

  ngOnInit(): void {
    // console.log(`this is Data : ${JSON.stringify(this.data)}`)
  }

  closeDialog() {
    this.dialogRef.close(true)
  }



}
