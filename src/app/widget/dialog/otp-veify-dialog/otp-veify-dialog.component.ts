import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'; import { lastValueFrom, Observable, of } from 'rxjs';
import { LoadingService } from 'src/app/service/loading.service';
;
import { QuotationService } from 'src/app/service/quotation.service';

@Component({
  selector: 'app-otp-veify-dialog',
  templateUrl: './otp-veify-dialog.component.html',
  styleUrls: ['./otp-veify-dialog.component.scss']
})
export class OtpVeifyDialogComponent implements OnInit {

  _tabindex: number = 0
  _editabletab1: boolean = true;
  _editabletab2: boolean = true;
  _editabletab3: boolean = true;
  _createotpResMsg: string = ''
  _validationResMsg: string = ''
  otp_validation: boolean = false;


  phone_number = new FormControl('', Validators.required)
  otp_value = new FormControl('', Validators.required)
  otp_valid = new FormControl(false, Validators.required)

  confirmForm = new FormGroup({
    phone_number: this.phone_number
  })

  otpactivate = this.fb.group({
    otp_value: this.otp_value
  })

  otpvalidation = this.fb.group({
    otp_valid: this.otp_valid
  })

  mainOTPForm = this.fb.group({
    confirmPhone: this.confirmForm,
    otpactivate: this.otpactivate,
    otpvalidation: this.otpvalidation
  })



  constructor(
    private fb: FormBuilder,
    private quotationService: QuotationService,
    private loadingService: LoadingService,
    public dialogRef: MatDialogRef<OtpVeifyDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {

  }

  async ngOnInit() {
    this.mainOTPForm.controls.confirmPhone.controls.phone_number.setValue(this.data.phone_number)

    this.loadingService.showLoader()

    await lastValueFrom(this.quotationService.MPLS_check_phonevalid(this.data.quotationid)).then((res) => {
      if (res.validation) {
        setTimeout(() => {
          this.loadingService.hideLoader()
          this._editabletab1 = false
          this._editabletab2 = false
          this._tabindex = 2
        });
      } else {
        this.loadingService.hideLoader()
      }
    }).catch((e) => {
      this.loadingService.hideLoader()
      console.log(`Error : ${e.message}`)
    })


  }

  verifyphoneno() {
    const quotationid = this.data.quotationid
    const currentPhonenumber = this.mainOTPForm.controls.confirmPhone.controls.phone_number.value
    const refid = this.data.refid

    this.quotationService.MPLS_create_otp_phoneno({
      quotationid: quotationid,
      refid: refid,
      phone_no: currentPhonenumber ? currentPhonenumber : ''
    }).subscribe((res) => {
      console.log(`res otp Data : ${JSON.stringify(res)}`)
      if(res.status == 200) {
        this._tabindex = 1
      } else {
        this._createotpResMsg = res.message
      }
    })

  }

  async activateotpphone($event: any) {
    const otpfield = this.mainOTPForm.controls.otpactivate.controls.otp_value.value

    if (otpfield) {
      console.log(`this is otpfield value : ${otpfield}`)

      this.loadingService.showLoader()
      await lastValueFrom(this.quotationService.MPLS_validation_otp_phonenumber({
        quotationid: this.data.quotationid,
        otp_value: otpfield,
        phone_no: this.data.phone_number
      })).then((res) => {
        this.loadingService.hideLoader()
        if (res.status) {
          this._editabletab1 = false
          this._editabletab2 = false
          this._tabindex = 2
        } else {
          this._validationResMsg = res.message
        }
      }).catch((e) => {
        this.loadingService.hideLoader()
        console.log(`Error when Validation Phone.NO : ${e.message}`)
      })
    }
  }

  closeDialog() {
    this.dialogRef.close(true)
  }

}
