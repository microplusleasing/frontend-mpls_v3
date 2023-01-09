import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { lastValueFrom, Observable, of } from 'rxjs';
import { IDialogFaceValid } from 'src/app/interface/i-dialog-face-valid';
import { IResIappFacevalid } from 'src/app/interface/i-res-iapp-facevalid';
import { LoadingService } from 'src/app/service/loading.service';
import { QuotationService } from 'src/app/service/quotation.service';
import { environment } from 'src/environments/environment';
import imageCompression from 'browser-image-compression';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-face-valid-dialog',
  templateUrl: './face-valid-dialog.component.html',
  styleUrls: ['./face-valid-dialog.component.scss']
})
export class FaceValidDialogComponent implements OnInit {

  file1: string;
  file2: string;
  imageurl1: string;
  imageurl2: string;
  errmsg: string;
  resultcompareimage: IResIappFacevalid = {} as IResIappFacevalid
  facecomparefail: boolean = true;
  resultfacecompareError: string;
  showuploadfaceimage: boolean = true;
  ismanual: boolean = false

  isfacevalid: boolean = false;
  settextstatus: boolean = false;

  citizenface = new FormControl<string | ''>('', Validators.required)
  customerface = new FormControl<string | ''>('', Validators.required)
  // score = new FormControl<string | ''>('', Validators.required)
  result = new FormControl<string | ''>('', Validators.required)
  reason = new FormControl<string | ''>({ value: '', disabled: false })
  verifymanual = new FormControl<boolean>(false)

  facevalidform = this.fb.group({
    citizenface: this.citizenface,
    customerface: this.customerface,
    // score: this.score,
    result: this.result,
    reason: this.reason,
    verifymanual: this.verifymanual
  })

  constructor(
    private fb: FormBuilder,
    private quotationService: QuotationService,
    private loadingService: LoadingService,
    private _snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<FaceValidDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IDialogFaceValid
  ) {
    this.file1 = ''
    this.file2 = ''
    this.imageurl1 = ''
    this.imageurl2 = ''
    this.errmsg = ''
    this.resultfacecompareError = ''

    dialogRef.backdropClick().subscribe(() => {
      // Close the dialog
      dialogRef.close({ status: this.isfacevalid, settextstatus: this.settextstatus });
    })

    this.facevalidform.controls.result.valueChanges.subscribe((value) => {
      const textInput = this.facevalidform.controls.reason
      if (value === 'N') {
        textInput.setValidators(Validators.required);
        textInput.enable();
        textInput.markAsTouched();
      } else {
        // textInput.reset();
        textInput.clearValidators();
        // textInput.disable();
      }
      textInput.updateValueAndValidity();
    })

    this.facevalidform.controls.verifymanual.valueChanges.subscribe((value) => {
      const citizenfaceinput = this.facevalidform.controls.citizenface
      const customerfaceinput = this.facevalidform.controls.customerface
      const reasoninput = this.facevalidform.controls.reason
      const resultinput = this.facevalidform.controls.result

      if (value) {
        // ==== manual quotation ===
        citizenfaceinput.reset();
        customerfaceinput.reset();
        reasoninput.reset();
        resultinput.reset();
        citizenfaceinput.clearValidators();
        customerfaceinput.clearValidators();
        reasoninput.clearValidators();
        resultinput.clearValidators();
      } else {
        citizenfaceinput.setValidators(Validators.required)
        customerfaceinput.setValidators(Validators.required)
        reasoninput.setValidators(Validators.required)
        resultinput.setValidators(Validators.required)
      }
      citizenfaceinput.updateValueAndValidity();
      customerfaceinput.updateValueAndValidity();
      reasoninput.updateValueAndValidity();
      resultinput.updateValueAndValidity();
    })
  }

  async ngOnInit() {
    this.loadingService.showLoader()
    this.quotationService.MPLS_is_check_face_valid(this.data.quotationid).subscribe({
      next: (resultdchkvalid) => {
        // === mange return data ===
        this.quotationService.MPLS_getimagetocompareiapp(this.data.quotationid).subscribe({
          next: (value) => {

            this.loadingService.hideLoader()
            this.file1 = value.data.file1
            this.file2 = value.data.file2

            this.facevalidform.controls.citizenface.setValue(this.file1 ? this.file1 : '')
            this.facevalidform.controls.customerface.setValue(this.file2 ? this.file2 : '')


            this.imageurl1 = (this.file1 == null || this.file1 == '') ? `${environment.citizen_card_img_preload}` : `data:image/jpeg;base64,${this.file1}`
            this.imageurl2 = (this.file2 == null || this.file2 == '') ? `${environment.citizen_card_img_preload}` : `data:image/jpeg;base64,${this.file2}`

            // === check channal , If no dipccip channal hide list field  ====
            if (value.data.is_dipchip_channal == 'N') {
              this.ismanual = true
            }


            if (resultdchkvalid.data.isvalid) {
              if (resultdchkvalid.data.isdipchip) {
                this.isfacevalid = true;
                this.facevalidform.controls.reason.setValue(resultdchkvalid.data.reason)
                this.facevalidform.controls.result.setValue(resultdchkvalid.data.status == 'Y' ? 'Y' : 'N')
                this.facevalidform.disable()
                this.facevalidform.controls.reason.disable()
              } else {
                this.isfacevalid = true;
                this.facevalidform.controls.verifymanual.setValue(true);
                this.facevalidform.disable()
                this.facevalidform.controls.reason.disable()
              }
            } else {

              this.isfacevalid = false
            }

            if (this.file2 == null || this.file2 == '') {
              this.showuploadfaceimage = true
            }
          }, error: (e) => {

          }, complete: () => {
            this.loadingService.hideLoader()
          }
        })
      }, error: (e) => {
        this.loadingService.hideLoader()
        console.log(`error during check is face valid`)
      }, complete: () => {
        this.loadingService.hideLoader()
      }
    })

  }

  async attachfaceimage($event: any) {
    const imageFile = $event.target.files[0];
    console.log('originalFile instanceof Blob', imageFile instanceof Blob); // true
    console.log(`originalFile size ${imageFile.size / 1024 / 1024} MB`);

    const options = {
      maxSizeMB: 2,
      maxWidthOrHeight: 1920,
      useWebWorker: true
    }

    try {
      const compressedFile = await imageCompression(imageFile, options);
      console.log('compressedFile instanceof Blob', compressedFile instanceof Blob); // true
      console.log(`compressedFile size ${compressedFile.size / 1024 / 1024} MB`); // smaller than maxSizeMB

      // await uploadToServer(compressedFile); // write your own logic

      // Create a new FileReader
      const reader = new FileReader();

      // Convert the Blob to a base64-encoded image URL
      reader.readAsDataURL(compressedFile);

      // Once the conversion is complete, you can use the resulting URL
      reader.onload = () => {
        let base64ImageUrl = reader.result;
        if (base64ImageUrl instanceof ArrayBuffer) {
          const arrayBuffer = new Uint8Array([72, 101, 108, 108, 111]).buffer;
          const decoder = new TextDecoder();
          base64ImageUrl = decoder.decode(arrayBuffer);
        }
        this.imageurl2 = base64ImageUrl ? base64ImageUrl : ''

        // === convert here ===
        const imageurl2string = this.removeDataUrlPrefix(this.imageurl2)

        this.facevalidform.controls.customerface.setValue(imageurl2string)

        // === save image customerface if this.imageurl2 is not null === 

        let itemdata = {
          quotationid: this.data.quotationid ? this.data.quotationid : '',
          cizcardImage: this.facevalidform.controls.citizenface.value,
          customerImage: this.facevalidform.controls.customerface.value
        }

        const itemString = JSON.stringify(itemdata)
        let fd = new FormData();
        fd.append('item', itemString)

        this.quotationService.MPLS_upload_customer_face(fd).subscribe((res) => {
          if (res.status == 200) {
            this.snackbarsuccess(`Upload ภาพสำเร็จ`)
          } else {
            this.snackbarfail(`Upload ไฟล์ภาพไม่สำเร็จ : ${res.message ? res.message : 'No return message'}`)
          }
        })
      }

      // You can now use the base64ImageUrl as the source for an image element, etc.

    } catch (error) {
      console.log(error);
    }
  }

  async onfacevalid() {

  }

  async onfacevalidmanual() {
    // === creat log face compare and update MPLS_QUOTATION (QUO_FACE_COMPARE_VERIFY) ====

    const is_dipchip = this.facevalidform.controls.verifymanual.value ? 'N' : 'Y'
    this.loadingService.showLoader()
    this.quotationService.MPLS_stamp_check_face_valid(
      this.data.quotationid,
      this.facevalidform.controls.reason.value ? this.facevalidform.controls.reason.value : '',
      this.facevalidform.controls.result.value ? this.facevalidform.controls.result.value : '',
      is_dipchip
    ).subscribe({
      next: (result) => {

        if (result.status == 200) {
          // === success ===
          this.loadingService.hideLoader()
          this.snackbarsuccess(`บันทึกข้อมูลยืนยันตัวบุคคลสำเร็จ`)
          if (result.data.isvalid == 'Y') {
            this.isfacevalid = true
            this.settextstatus = true
          } else {
            this.isfacevalid = false
            this.settextstatus = true
          }
          this.facevalidform.disable()
          this.facevalidform.controls.reason.disable()
          // === clode dialog (requirement on 07/01/2023) ===
          this.dialogRef.close({ status: this.isfacevalid, settextstatus: this.settextstatus });
        } else {
          this.snackbarfail(`ไม่สามารถบันทึกข้อมูลยืนยันตนบุคคลได้ : ${result.message}`)
        }
      }, error: (e) => {
        console.log(`Error during update face valid status and result : ${e.message ? e.message : 'no return message'}`)
        this.loadingService.hideLoader()
      }, complete: () => {
        this.loadingService.hideLoader()
      }
    })

  }

  // === self utility ===

  removeDataUrlPrefix(imageString: string): string {
    // Split the base64 string on commas
    // 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDA...' => [ 'data:image/jpeg;base64', '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDA...' ]
    const parts = imageString.split(';base64,');

    // Get the base64 string
    const base64 = parts[1];

    return base64;
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
