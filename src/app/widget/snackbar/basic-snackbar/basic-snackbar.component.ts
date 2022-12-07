import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { IReqSnackbarBasic } from 'src/app/interface/i-req-snackbar-basic';

@Component({
  selector: 'app-basic-snackbar',
  templateUrl: './basic-snackbar.component.html',
  styleUrls: ['./basic-snackbar.component.scss']
})
export class BasicSnackbarComponent  {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: IReqSnackbarBasic) { }
}
