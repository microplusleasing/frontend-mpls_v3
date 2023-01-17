import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogContent, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { lastValueFrom, Observable, of } from 'rxjs';
import { IDialogEconsentOtpOpen } from 'src/app/interface/i-dialog-econsent-otp-open';
import { LoadingService } from 'src/app/service/loading.service';
import { QuotationService } from 'src/app/service/quotation.service';
import * as htmlToImage from 'html-to-image';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface econsentValue {
  value: boolean;
  label: string;
}

@Component({
  selector: 'app-otp-econsent',
  templateUrl: './otp-econsent.component.html',
  styleUrls: ['./otp-econsent.component.scss']
})
export class OtpEconsentComponent implements OnInit {

  _countconfirmask: number = 0
  _countscrollbottom: number = 0
  _tabindex: number = 0
  _editabletab1: boolean = true;
  _editabletab2: boolean = true;
  _editabletab3: boolean = true;
  _createotpResMsg: string = ''
  _validationResMsg: string = ''
  otp_validation: boolean = false;

  econsent_valid_status: boolean = false

  econsentimageblob: (Blob | null) = null;



  // === variable send data back via close dialog ===
  validsuccess: boolean = false


  econsentvalueList: econsentValue[] = [
    {
      value: true,
      label: 'ยินยอมให้เปิดเผยข้อมูล'
    },
    {
      value: false,
      label: 'ไม่ยินยอมให้เปิดเผยข้อมูล'
    }
  ];

  econsentvalue = new FormControl<boolean | null>(null, Validators.required)
  confirm_btn_click = new FormControl<boolean>(false, Validators.requiredTrue)
  otp_value = new FormControl('', Validators.required)
  otp_valid = new FormControl(false, Validators.required)


  confirmEconsentForm = this.fb.group({
    econsentvalue: this.econsentvalue,
    confirm_btn_click: this.confirm_btn_click
  })


  otpactivate = this.fb.group({
    otp_value: this.otp_value
  })

  otpvalidation = this.fb.group({
    otp_valid: this.otp_valid
  })

  mainOTPForm = this.fb.group({
    confirmEconsentForm: this.confirmEconsentForm,
    otpactivate: this.otpactivate,
    otpvalidation: this.otpvalidation
  })





  constructor(
    private fb: FormBuilder,
    private quotationService: QuotationService,
    private loadingService: LoadingService,
    public dialogRef: MatDialogRef<OtpEconsentComponent>,
    public dialog: MatDialog,
    public _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: IDialogEconsentOtpOpen
  ) {

    this.econsentvalue.valueChanges.subscribe((res) => {
      console.log(`this is value of radio btn : ${res}`)
    })

    dialogRef.backdropClick().subscribe(() => {
      // Close the dialog
      dialogRef.close({ status: this.econsent_valid_status, data: '' });
    })

  }

  async ngOnInit() {

    this.loadingService.showLoader()

    this.confirmEconsentForm.controls.econsentvalue.disable()
    await lastValueFrom(this.quotationService.MPLS_check_econsent(this.data.quotationid)).then((res) => {
      if (res.validation) {

        this.mainOTPForm.controls.confirmEconsentForm.controls.confirm_btn_click.setValue(true)
        this.mainOTPForm.controls.otpactivate.controls.otp_value.setValue('xxxx')

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

  onScroll(event: any) {
    if (this._countscrollbottom == 0) {
      if (event.target.scrollTop + event.target.offsetHeight === event.target.scrollHeight) {
        // The user has scrolled to the end of the dialog content
        this.confirmEconsentForm.controls.econsentvalue.enable()
        this._countscrollbottom++
      }
    }
  }

  async onClickAcceptEconsent() {

    // === check accept or not accept (เช็ค ยินยอม หรือ ไม่ยินยอม) ====
    const acceptvalue = this.confirmEconsentForm.controls.econsentvalue.value

    if (acceptvalue) {
      // === accept ===
      const quotationid = this.data.quotationid
      const quophoneno = this.data.phone_number
      const refid = this.data.refid

      this.mainOTPForm.controls.confirmEconsentForm.controls.confirm_btn_click.setValue(true)

      this.quotationService.MPLS_create_otp_econsent({
        quotationid: quotationid,
        refid: refid,
        phone_no: quophoneno
      }).subscribe(async (res) => {
        console.log(`res otp Data : ${JSON.stringify(res)}`)
        if (res.status == 200) {
          const divfortest = document.getElementById('econsentelement');

          if (divfortest) {
            const imageblob = await htmlToImage.toBlob(divfortest, {
              quality: 1,
              style: {
                background: 'white'
              },
            })

            this.econsentimageblob = imageblob
            this._tabindex = 1
          } else {
            this.loadingService.hideLoader()
            console.log('imageblob is null')
          }

        } else {
          this._createotpResMsg = res.message
        }
      })
    } else {
      // === not accept ===
      const quotationid = this.data.quotationid

      if (this._countconfirmask == 0) {
        // === ask agiant (ถ้าชัว skip to หน้า อาชีพและรายได้ (flag case non-econsent), if ไม่ชัวปิดหน้าต่างให้เลือกใหม่) ===
        this.dialog.open(ConfirmDialogComponent, {
          width: 'auto',
          height: 'auto',
          data: {
            firstname: `${this.data.firstname}`,
            lastname: `${this.data.lastname}`
          }
        }).afterClosed().subscribe((value) => {
          if (value) {
            // === ไม่แน่ใจ : ให้กรอกแล้วกดใหม่ ====
            this._countconfirmask++
          } else {
            // === ไม่ยืนยอมแน่นอน : ปิด dialog แล้วทำการ flag data (non-econsent) ===
            // this.dialogRef.close({ status: this.econsent_valid_status, data: '' });
            this.quotationService.MPLS_validation_otp_econsent_non(quotationid).subscribe((res_non) => {
              if (res_non.status) {
                // === success update flag econsent ====
                this.econsent_valid_status = true
                this.dialogRef.close({ status: this.econsent_valid_status, data: '' });
              } else {
                // === fail to update flag econsent ==== 
                this.snackbarfail(`ไม่สามารถทำรายการได้ : ${res_non.message}`)
              }
            })
          }
        })
      } else {
        // ==== ไม่ยินยอม -> ไม่แน่ใจ -> ไม่ยินยอม ===
        // *** ปิดหน้า OTP แล้วทำการ flag data (non-econsent) ===
        // this.dialogRef.close({ status: this.econsent_valid_status, data: '' });
        this.quotationService.MPLS_validation_otp_econsent_non(quotationid).subscribe((res_non) => {
          if (res_non.status) {
            // === success update flag econsent ====
            this.econsent_valid_status = true
            this.dialogRef.close({ status: this.econsent_valid_status, data: '' });
          } else {
            // === fail to update flag econsent ==== 
            this.snackbarfail(`ไม่สามารถทำรายการได้ : ${res_non.message}`)
          }
        })
      }
    }

  }


  async activateotpeconsent($event: any) {

    const otpfield = this.mainOTPForm.controls.otpactivate.controls.otp_value.value

    if (otpfield) {
      console.log(`this is otpfield value : ${otpfield}`)

      this.loadingService.showLoader()


      let fd = new FormData();

      let itemobj = {
        quotationid: this.data.quotationid,
        otp_value: otpfield,
        phone_no: this.data.phone_number
      }

      const itemString = JSON.stringify(itemobj)

      if (this.econsentimageblob) {
        fd.append('item', itemString)
        fd.append("econsentimage", this.econsentimageblob);

        await lastValueFrom(this.quotationService.MPLS_validation_otp_econsent(fd)).then((res) => {
          this.loadingService.hideLoader()
          if (res.status) {
            // *** save econst image to db (oracle) ***
            this.econsent_valid_status = true
            this.validsuccess = true
            this._editabletab1 = false
            this._editabletab2 = false
            // this._tabindex = 2
            this.dialogRef.close({
              status: this.econsent_valid_status,
              data: this.econsent_valid_status ? 'success' : 'fail'
            })
          } else {
            this._validationResMsg = res.message
          }
        }).catch((e) => {
          this.loadingService.hideLoader()
          console.log(`Error when Validation Phone.NO : ${e.message}`)
        })
      } else {
        this.loadingService.hideLoader()
        console.log('imageblob is null')
      }


    }
  }

  closeDialog() {
    this.dialogRef.close({
      status: this.econsent_valid_status,
      data: this.econsent_valid_status ? 'success' : 'fail'
    })
  }

  snackbarsuccess(message: string) {
    this._snackBar.open(message, '', {
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
      duration: 3000,
      panelClass: 'custom-snackbar-container'
    });
  }

  snackbarfail(message: string) {
    this._snackBar.open(message, '', {
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
      duration: 3000,
      panelClass: 'fail-snackbar-container'
    });
  }

}
