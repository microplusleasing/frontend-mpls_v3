import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-waring-econsent-dialog',
    templateUrl: './waring-econsent-dialog.component.html',
    styleUrls: ['./waring-econsent-dialog.component.scss'],
    standalone: false
})
export class WaringEconsentDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<WaringEconsentDialogComponent>
  ) { }

  ngOnInit(): void {
    // console.log(`this is Data : ${JSON.stringify(this.data)}`)
  }

  closeDialog() {
    this.dialogRef.close(true)
  }
}