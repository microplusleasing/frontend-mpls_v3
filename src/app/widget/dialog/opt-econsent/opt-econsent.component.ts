import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { lastValueFrom, Observable, of } from 'rxjs';
import { IDialogEconsentOtpOpen } from 'src/app/interface/i-dialog-econsent-otp-open';
import { LoadingService } from 'src/app/service/loading.service';
import { QuotationService } from 'src/app/service/quotation.service';
import * as htmlToImage from 'html-to-image';

export interface econsentValue {
  value: boolean;
  label: string;
}

@Component({
  selector: 'app-opt-econsent',
  templateUrl: './opt-econsent.component.html',
  styleUrls: ['./opt-econsent.component.scss']
})
export class OptEconsentComponent implements OnInit {

  _tabindex: number = 0
  _editabletab1: boolean = true;
  _editabletab2: boolean = true;
  _editabletab3: boolean = true;
  _createotpResMsg: string = ''
  _validationResMsg: string = ''
  otp_validation: boolean = false;

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

  econsentvalue = new FormControl<boolean | null>(null, Validators.requiredTrue)
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
    public dialogRef: MatDialogRef<OptEconsentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IDialogEconsentOtpOpen
  ) {

    this.econsentvalue.valueChanges.subscribe((res) => {
      console.log(`this is value of radio btn : ${res}`)
    })

    dialogRef.backdropClick().subscribe(() => {
      // Close the dialog
      dialogRef.close({ status: 'xxxxx', data: 'xxxx' });
    })

  }

  async ngOnInit() {

    this.loadingService.showLoader()

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

  async onClickAcceptEconsent() {
    const quotationid = this.data.quotationid
    const quophoneno = this.data.phone_number
    const refid = this.data.refid

    this.mainOTPForm.controls.confirmEconsentForm.controls.confirm_btn_click.setValue(true)

    this.quotationService.MPLS_create_otp_econsent({
      quotationid: quotationid,
      refid: refid,
      phone_no: quophoneno
    }).subscribe((res) => {
      console.log(`res otp Data : ${JSON.stringify(res)}`)
      if (res.status == 200) {
        this._tabindex = 1
      } else {
        this._createotpResMsg = res.message
      }
    })
  }


  async activateotpeconsent($event: any) {
    const otpfield = this.mainOTPForm.controls.otpactivate.controls.otp_value.value

    if (otpfield) {
      console.log(`this is otpfield value : ${otpfield}`)

      this.loadingService.showLoader()
      const divfortest = document.getElementById('econsentelement');

      if (divfortest) {
        const imageblob = await htmlToImage.toBlob(divfortest, {
          quality: 1,
          style: { background: 'white' },
        })

        let fd = new FormData();

        let itemobj = {
          quotationid: '',
          otp_value: '',
          phone_no: '',
        }

        const itemString = JSON.stringify(itemobj)

        if (imageblob) {
          fd.append('item', itemString)
          fd.append("blob", imageblob, 'econsentblob');

          await lastValueFrom(this.quotationService.MPLS_validation_otp_econsent(fd)).then((res) => {
            this.loadingService.hideLoader()
            if (res.status) {
              // *** save econst image to db (oracle) ***
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
        } else {
          console.log('imageblob is null')
        }

      } else {
        console.log(`ไม่พบ element ในการบันทึกรูป jpeg`)
      }
    }
  }

  testja() {

    const divfortest = document.getElementById('econsentelement');
    if (divfortest) {
      htmlToImage.toJpeg(divfortest, {
        quality: 1,
        style: { background: "white" },
      })
        .then(function (dataUrl) {
          var link = document.createElement('a');
          link.download = 'my-image-name.jpeg';
          link.href = dataUrl;
          link.click();
        });
    }

    // const divfortest = document.getElementById('testimg');

    // if (divfortest) {
    //   htmlToImage.toBlob(divfortest)
    //     .then(function (blob) {
    //       console.log(`this is blob image of econsent : ${blob}`)
    //     });
    // }
  }

  closeDialog() {
    this.dialogRef.close({
      status: 'xxx',
      data: 'xxx'
    })
  }

}
