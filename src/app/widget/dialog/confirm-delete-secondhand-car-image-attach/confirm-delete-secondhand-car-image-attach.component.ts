import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-delete-secondhand-car-image-attach',
  templateUrl: './confirm-delete-secondhand-car-image-attach.component.html',
  styleUrls: ['./confirm-delete-secondhand-car-image-attach.component.scss']
})
export class ConfirmDeleteSecondhandCarImageAttachComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ConfirmDeleteSecondhandCarImageAttachComponent>,
  ) { }

  ngOnInit(): void {
  }

}
