import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { forkJoin, lastValueFrom, Observable, of } from 'rxjs';
import { IDialogFaceValid } from 'src/app/interface/i-dialog-face-valid';
import { IResIappFacevalid } from 'src/app/interface/i-res-iapp-facevalid';
import { LoadingService } from 'src/app/service/loading.service';
import { QuotationService } from 'src/app/service/quotation.service';
import { environment } from 'src/environments/environment';
import imageCompression from 'browser-image-compression';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IappService } from 'src/app/service/iapp.service';
import { ImageUtilService } from 'src/app/service/image-util.service';
import { BaseService } from 'src/app/service/base/base.service';
import { IStampFaceVerificationLog } from 'src/app/interface/i-stamp-face-verification-log';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-face-valid-dialog',
  templateUrl: './face-valid-dialog.component.html',
  styleUrls: ['./face-valid-dialog.component.scss']
})
export class FaceValidDialogComponent extends BaseService implements OnInit {

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
  isfaceconsent: boolean = false ;// === use value from ismaual but use other variable for handle render dom data ===

  firstName: string = ''
  lastName: string = ''
  idcard_num: string = ''
  consentDate: Date | null = null


  isfacevalid: boolean = false;
  settextstatus: boolean = false;

  citizenface = new FormControl<string | ''>('', Validators.required)
  customerface = new FormControl<string | ''>('', Validators.required)
  // score = new FormControl<string | ''>('', Validators.required)
  result = new FormControl<string | ''>('', Validators.required)
  consent = new FormControl<string | ''>('', Validators.required)
  reason = new FormControl<string | ''>({ value: '', disabled: false })
  verifymanual = new FormControl<boolean>(false)

  facevalidform = this.fb.group({
    citizenface: this.citizenface,
    customerface: this.customerface,
    // score: this.score,
    consent: this.consent,
    result: this.result,
    reason: this.reason,
    verifymanual: this.verifymanual
  })

  constructor(
    private fb: FormBuilder,
    private quotationService: QuotationService,
    private iappService: IappService,
    private loadingService: LoadingService,
    private ImageUtilService: ImageUtilService,
    public override _snackBar: MatSnackBar,
    public override dialog: MatDialog,
    public dialogRef: MatDialogRef<FaceValidDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IDialogFaceValid
  ) {
    super(dialog, _snackBar)
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

        forkJoin([
          this.quotationService.MPLS_getinfofacecompare(this.data.quotationid),
          this.quotationService.MPLS_getimagetocompareiapp(this.data.quotationid)
        ]).subscribe({
          next: ([resinfo, resimage]) => {
            this.loadingService.hideLoader()
            // ============ resinfo =============
            if (resinfo.status === 200) {
              this.firstName = resinfo.data.first_name
              this.lastName = resinfo.data.last_name
              this.idcard_num = resinfo.data.idcard_num

              if (resinfo.data.quo_consent_face_compare_date) {
                this.consentDate = resinfo.data.quo_consent_face_compare_date
              } else {
                this.consentDate = new Date()
              }
            }

            // ============ resimage =============
            this.loadingService.hideLoader()
            this.file1 = resimage.data.file1
            this.file2 = resimage.data.file2

            this.facevalidform.controls.citizenface.setValue(this.file1 ? this.file1 : '')
            this.facevalidform.controls.customerface.setValue(this.file2 ? this.file2 : '')


            this.imageurl1 = (this.file1 === null || this.file1 === '') ? `${environment.citizen_card_img_preload}` : `data:image/jpeg;base64,${this.file1}`
            this.imageurl2 = (this.file2 === null || this.file2 === '') ? `${environment.citizen_card_img_preload}` : `data:image/jpeg;base64,${this.file2}`

            // === check channal , If no dipccip channal hide list field  ====
            if (resimage.data.is_dipchip_channal === 'N') {
              this.ismanual = true
              this.isfaceconsent = false 
            } else {
              this.isfaceconsent = true
            }


            if (resultdchkvalid.data.isvalid) {
              if (resultdchkvalid.data.isdipchip) {
                this.isfacevalid = true;
                this.facevalidform.controls.reason.setValue(resultdchkvalid.data.reason)
                this.facevalidform.controls.result.setValue(resultdchkvalid.data.status === 'Y' ? 'Y' : 'N')
                this.facevalidform.controls.consent.setValue(resultdchkvalid.data.face_compare_consent === 'Y' ? 'Y' : 'N')
                this.facevalidform.disable()
                this.facevalidform.controls.reason.disable()
              } else {
                this.isfacevalid = true;
                this.facevalidform.controls.verifymanual.setValue(true);
                this.facevalidform.disable()
                this.facevalidform.controls.reason.disable()
                this.facevalidform.controls.consent.disable()
              }
            } else {

              this.isfacevalid = false
            }

            if (this.file2 === null || this.file2 === '') {
              this.showuploadfaceimage = true
            }
          }, error: (e) => {
            this.loadingService.hideLoader()

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
          if (res.status === 200) {
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
    this.loadingService.showLoader()

    let dataForm = {
      quotationid: this.data.quotationid,
      reason: this.facevalidform.controls.reason.value ? this.facevalidform.controls.reason.value : '',
      result: this.facevalidform.controls.result.value ? this.facevalidform.controls.result.value : '',
      is_dipchip: this.facevalidform.controls.verifymanual.value ? 'N' : 'Y',
      consent: this.facevalidform.controls.consent.value ? this.facevalidform.controls.consent.value : '',
      consentDate: this.consentDate ? this.consentDate : null
    }

    const dataitems = JSON.stringify(dataForm)
    // ==== fd (res of MPLS_stamp_check_face_valid), fd_iapp (getfacevalidation) ====
    let fd = new FormData();
    fd.append('items', dataitems)

    let fd_iapp = new FormData();
    // ===== iapp face verification v2 (addon 28/02/2023) ====
    // *** check file2 is less than 2mb ***

    const _file1 = (this.file1) ? `data:image/jpeg;base64,${this.file1}` : `data:image/jpeg;base64,${this.facevalidform.controls.citizenface.value}`
    fd_iapp.append('file1', _file1)

    // === check file2 size (11/11/2022) === 
    const bytearrayimagefile2 = this.ImageUtilService._base64sizemb(this.file2)

    if (bytearrayimagefile2 > 2) {

      const imgfile = (this.file2) ? await imageCompression.getFilefromDataUrl(`data:image/jpeg;base64,${this.file2}`, 'file2') : await imageCompression.getFilefromDataUrl(`data:image/jpeg;base64,${this.facevalidform.controls.customerface.value}`, 'file2')

      const compressedFile = await imageCompression(imgfile, { maxSizeMB: 1 });

      if (compressedFile) {
        const fileimagecompreessBase64 = await this.ImageUtilService.blobToBase64(compressedFile)

        fd_iapp.append('file2', `${fileimagecompreessBase64}`)

      }
    } else {
      const _file2 = (this.file2) ? `data:image/jpeg;base64,${this.file2}` : `data:image/jpeg;base64,${this.facevalidform.controls.customerface.value}`
      fd_iapp.append('file2', _file2)
    }


    // forkJoin([
    //   this.iappService.getfacevalidation(fd_iapp),
    //   this.quotationService.MPLS_stamp_check_face_valid(fd)
    // ]).subscribe({
    //   next: async ([res_iapp, res_stamp_check_face_valid]) => {

    //     if (res_iapp.message) {
    //       let fd = new FormData;
    //       const datasend: IStampFaceVerificationLog = {
    //         quotationid: this.data.quotationid,
    //         duration: res_iapp.duration,
    //         matched: res_iapp.matched,
    //         message: res_iapp.message,
    //         score: res_iapp.score,
    //         threshold: res_iapp.threshold
    //       }
    //       const dataString = JSON.stringify(datasend)

    //       fd.append('items', dataString)

    //       const resultcreatelog = await lastValueFrom(this.quotationService.MPLS_stamp_face_verification_log_iapp(fd))

    //       if (resultcreatelog.status === 200) {
    //         // *** อาจปรับเปลี่ยนเป็นแสดง snackbar  พร้อมกับจังหวะที่ MPLS_stamp_check_face_valid สำเร็จได้ (res_stamp_check_face_valid === 200) ***
    //         console.log(`บันทึกรายการ mpls_iapp_face_verification_log สำเร็จ !`)
    //       } else {
    //         console.log(`บันทึกรายการ mpls_iapp_face_verification_log ไม่สำเร็จ !`)
    //       }
    //     }

    //     if (res_stamp_check_face_valid.status === 200) {
    //       // === success ===
    //       this.loadingService.hideLoader()
    //       this.snackbarsuccess(`บันทึกข้อมูลยืนยันตัวบุคคลสำเร็จ`)
    //       if (res_stamp_check_face_valid.data.isvalid === 'Y') {
    //         this.isfacevalid = true
    //         this.settextstatus = true
    //       } else {
    //         this.isfacevalid = false
    //         this.settextstatus = true
    //       }
    //       this.facevalidform.disable()
    //       this.facevalidform.controls.reason.disable()
    //       // === clode dialog (requirement on 07/01/2023) ===
    //       this.dialogRef.close({ status: this.isfacevalid, settextstatus: this.settextstatus });
    //     } else {
    //       this.snackbarfail(`ไม่สามารถบันทึกข้อมูลยืนยันตนบุคคลได้ : ${res_stamp_check_face_valid.message}`)
    //     }
    //   }, error: (e: any) => {
    //     this.snackbarfail(`Error forkjoin : ${e.message ? e.message : 'No Message'}`)
    //   }, complete: () => {
    //     console.log(`trigger forkjoin (getfacevalidation, MPLS_stamp_check_face_valid) complete!`)
    //   }
    // })

    this.quotationService.MPLS_stamp_check_face_valid(fd).subscribe({
      next: (result) => {
        this.loadingService.showLoader()
        if (result.status === 200) {
          // === success ===
          // this.loadingService.hideLoader()
          // this.snackbarsuccess(`บันทึกข้อมูลยืนยันตัวบุคคลสำเร็จ`)
          if (result.data.isvalid === 'Y') {
            this.isfacevalid = true
            this.settextstatus = true
          } else {
            this.isfacevalid = false
            this.settextstatus = true
          }
          this.facevalidform.disable()
          this.facevalidform.controls.reason.disable()
          // === clode dialog (requirement on 07/01/2023) ===
          // this.dialogRef.close({ status: this.isfacevalid, settextstatus: this.settextstatus });
          // === stamp log to mpls_iapp_face_verify_log ==== 

          this.iappService.getfacevalidation(fd_iapp).subscribe({
            next: async (res_iapp) => {
              // this.loadingService.hideLoader()
              if (res_iapp.message) {
                let fd_log = new FormData;
                const datasend: IStampFaceVerificationLog = {
                  quotationid: this.data.quotationid,
                  duration: res_iapp.duration,
                  matched: res_iapp.matched,
                  message: res_iapp.message,
                  score: res_iapp.score,
                  threshold: res_iapp.threshold
                }
                const dataString = JSON.stringify(datasend)

                fd_log.append('items', dataString)

                const resultcreatelog = await lastValueFrom(this.quotationService.MPLS_stamp_face_verification_log_iapp(fd_log))

                if (resultcreatelog.status === 200) {
                  this.loadingService.hideLoader()
                  this.snackbarsuccess(`
                  สถานะบันทึกข้อมูล : สำเร็จ ✅\n 
                  สถานะการตรวจใบหน้าผ่าน api :สำเร็จ ✅\n
                  สถานะบันทึก log : สำเร็จ ✅`)
                  this.dialogRef.close({ status: this.isfacevalid, settextstatus: this.settextstatus });
                } else {
                  this.loadingService.hideLoader()
                  this.snackbarsuccess(`
                  สถานะบันทึกข้อมูล : สำเร็จ ✅\n 
                  สถานะการตรวจใบหน้าผ่าน api : สำเร็จ ✅\n
                  สถานะบันทึก log : ไม่สำเร็จ ❌ (Error: ${resultcreatelog.message ? resultcreatelog.message : 'No return message'})`)
                  this.dialogRef.close({ status: this.isfacevalid, settextstatus: this.settextstatus });
                }
              }
            }, error: async (e: HttpErrorResponse) => {
              // this.loadingService.hideLoader()
              // this.snackbarfail(`
              // สถานะบันทึกข้อมูล : สำเร็จ \n 
              // สถานะการตรวจใบหน้าผ่าน api : ไม่สำเร็จ (Error: ${e.message ? e.message : 'No return message'}) \n  F
              // สถานะบันทึก log : ไม่สำเร็จ`)
              // this.dialogRef.close({ status: this.isfacevalid, settextstatus: this.settextstatus });
              if (e.message) {
                let fd_log = new FormData;
                const datasend: IStampFaceVerificationLog = {
                  quotationid: this.data.quotationid,
                  duration: e.error.duration,
                  message: e.error.message
                }
                const dataString = JSON.stringify(datasend)

                fd_log.append('items', dataString)

                const resultcreatelog = await lastValueFrom(this.quotationService.MPLS_stamp_face_verification_log_iapp(fd_log))

                if (resultcreatelog.status === 200) {
                  this.loadingService.hideLoader()
                  this.snackbarsuccess(`
                  สถานะบันทึกข้อมูล : สำเร็จ ✅ \n 
                  สถานะการตรวจใบหน้าผ่าน api : ไม่สำเร็จ ❌ \n
                  สถานะบันทึก log : สำเร็จ ✅`)
                  this.dialogRef.close({ status: this.isfacevalid, settextstatus: this.settextstatus });
                } else {
                  this.loadingService.hideLoader()
                  this.snackbarsuccess(`
                  สถานะบันทึกข้อมูล : ✅ สำเร็จ \n 
                  สถานะการตรวจใบหน้าผ่าน api : ❌ไม่สำเร็จ \n
                  สถานะบันทึก log : ไม่สำเร็จ ❌(Error: ${resultcreatelog.message ? resultcreatelog.message : 'No return message'})`)
                  this.dialogRef.close({ status: this.isfacevalid, settextstatus: this.settextstatus });
                }
              }
            }, complete: () => {
              // this.loadingService.hideLoader()
            }
          })

        } else {
          this.loadingService.hideLoader()
          this.snackbarfail(`ไม่สามารถบันทึกข้อมูลยืนยันตนบุคคลได้ : ${result.message}`)
        }
      }, error: (e) => {
        console.log(`Error during update face valid status and result : ${e.message ? e.message : 'no return message'}`)
        this.loadingService.hideLoader()
      }, complete: () => {
        // this.loadingService.hideLoader()
      }
    })



    // =======================================================

    // this.quotationService.MPLS_stamp_check_face_valid(fd).subscribe({
    //   next: (result) => {

    //     if (result.status === 200) {
    //       // === success ===
    //       this.loadingService.hideLoader()
    //       this.snackbarsuccess(`บันทึกข้อมูลยืนยันตัวบุคคลสำเร็จ`)
    //       if (result.data.isvalid === 'Y') {
    //         this.isfacevalid = true
    //         this.settextstatus = true
    //       } else {
    //         this.isfacevalid = false
    //         this.settextstatus = true
    //       }
    //       this.facevalidform.disable()
    //       this.facevalidform.controls.reason.disable()
    //       // === clode dialog (requirement on 07/01/2023) ===
    //       this.dialogRef.close({ status: this.isfacevalid, settextstatus: this.settextstatus });
    //     } else {
    //       this.snackbarfail(`ไม่สามารถบันทึกข้อมูลยืนยันตนบุคคลได้ : ${result.message}`)
    //     }
    //   }, error: (e) => {
    //     console.log(`Error during update face valid status and result : ${e.message ? e.message : 'no return message'}`)
    //     this.loadingService.hideLoader()
    //   }, complete: () => {
    //     this.loadingService.hideLoader()
    //   }
    // })

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

}
