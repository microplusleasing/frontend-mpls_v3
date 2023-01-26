import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'; 
import { lastValueFrom, Observable, of } from 'rxjs';
import { LoadingService } from 'src/app/service/loading.service';
;
import { QuotationService } from 'src/app/service/quotation.service';

@Component({
  selector: 'app-otp-verify-dialog',
  templateUrl: './otp-verify-dialog.component.html',
  styleUrls: ['./otp-verify-dialog.component.scss']
})
export class OtpVerifyDialogComponent implements OnInit {

  _tabindex: number = 0
  _editabletab1: boolean = true;
  _editabletab2: boolean = true;
  _editabletab3: boolean = true;
  _createotpResMsg: string = ''
  _validationResMsg: string = ''
  otp_validation: boolean = false;

  // === variable send data back via close dialog ===
  validsuccess: boolean = false


  // *** step 1 ***
  phone_number = new FormControl('', Validators.required)
  confirm_btn_click = new FormControl<boolean>(false, Validators.requiredTrue)

  otp_value = new FormControl('', Validators.required)
  otp_valid = new FormControl(false, Validators.required)

  confirmForm = this.fb.group({
    phone_number: this.phone_number,
    confirm_btn_click: this.confirm_btn_click
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
    public dialogRef: MatDialogRef<OtpVerifyDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    dialogRef.backdropClick().subscribe(() => {
      // Close the dialog
      dialogRef.close({phone_number: this.confirmForm.controls.phone_number.value, otp_status: this.validsuccess});
    })
  }

  async ngOnInit() {
    this.mainOTPForm.controls.confirmPhone.controls.phone_number.setValue(this.data.phone_number)

    this.loadingService.showLoader()

    await lastValueFrom(this.quotationService.MPLS_check_phonevalid(this.data.quotationid)).then((res) => {
      if (res.validation) {

        // *** set step 1 and step 2 valid ***
        // *** set flag confirm button click ***
        this.mainOTPForm.controls.confirmPhone.controls.confirm_btn_click.setValue(true)
        // *** set step 2 valid with mock OTP value ***
        this.mainOTPForm.controls.otpactivate.controls.otp_value.setValue('xxxx')

        setTimeout(() => {
          this.loadingService.hideLoader()
          this._editabletab1 = false
          this._editabletab2 = false
          // this.mainOTPForm.controls.otpactivate.controls.otp_value.setValue('temp');
          this._tabindex = 2
        },500);
      } else {
        this.loadingService.hideLoader()
      }
    }).catch((e) => {
      this.loadingService.hideLoader()
      console.log(`Error : ${e.message}`)
    })

  }

  createoptphonevalid() {

    const quotationid = this.data.quotationid
    const currentPhonenumber = this.mainOTPForm.controls.confirmPhone.controls.phone_number.value
    const refid = this.data.refid

    // *** set flag confirm button click ***
    this.mainOTPForm.controls.confirmPhone.controls.confirm_btn_click.setValue(true)

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

  async activateotpphone() {
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
          this.validsuccess = true
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
    this.dialogRef.close({
      phone_number: this.confirmForm.controls.phone_number.value,
      otp_status: this.validsuccess
    })
  }

}
