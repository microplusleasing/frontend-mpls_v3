import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IDialogFinishQuotation } from 'src/app/interface/i-dialog-finish-quotation';

@Component({
  selector: 'app-finish-quotation-dialog',
  templateUrl: './finish-quotation-dialog.component.html',
  styleUrls: ['./finish-quotation-dialog.component.scss']
})
export class FinishQuotationDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<FinishQuotationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IDialogFinishQuotation
  ) { }

  ngOnInit(): void {
  }

}
