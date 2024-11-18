import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IDialogBasicConfirm } from 'src/app/interface/i-dialog-basic-confirm';

@Component({
  selector: 'app-basic-confirm-dialog',
  templateUrl: './basic-confirm-dialog.component.html',
  styleUrl: './basic-confirm-dialog.component.scss'
})
export class BasicConfirmDialogComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<BasicConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IDialogBasicConfirm
  ) { }

  ngOnInit(): void {
  }

  closeDialog() {
    this.dialogRef.close(true)
  }
}
