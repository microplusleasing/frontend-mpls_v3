import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';
import imageCompression from 'browser-image-compression';
import { lastValueFrom } from 'rxjs';
import { IResDialog2ndhandCarImageAttach } from 'src/app/interface/dialog-return/i-res-dialog-2ndhand-car-image-attach';
import { IDialogSecondhandCarImageAttach } from 'src/app/interface/i-dialog-secondhand-car-image-attach';
import { IImageAttachUploadMultiple } from 'src/app/interface/i-image-attach-upload-multiple';
import { IImageAttachUploadMultipleList } from 'src/app/interface/i-image-attach-upload-multiple-list';
import { IResImageAttachMultipleData } from 'src/app/interface/i-res-image-attach-multiple';
import { IResImageTypeAttachMultipleData } from 'src/app/interface/i-res-image-type-attach-multiple';
import { LoadingService } from 'src/app/service/loading.service';
import { MasterDataService } from 'src/app/service/master.service';
import { QuotationService } from 'src/app/service/quotation.service';

@Component({
  selector: 'app-secondhand-car-attach-image-dialog',
  templateUrl: './secondhand-car-attach-image-dialog.component.html',
  styleUrls: ['./secondhand-car-attach-image-dialog.component.scss']
})
export class SecondhandCarAttachImageDialogComponent implements OnInit {

  @ViewChild('hiddenInput') hiddenInput: ElementRef;
  @ViewChild('fileInput') fileInput: ElementRef;
  uploadedImages: IImageAttachUploadMultipleList[] = [];
  txtsecondhandcarheader: string = 'รูปภาพแนบสำหรับรถมือสอง (ขั้นต่ำ 2 ภาพ)'
  txtsecondhandcarheaderstatus: string = `รูปภาพแนบสำหรับรถมือสอง (ขั้นต่ำ 2 ภาพ) (จำนวนภาพที่แนบ: ${this.uploadedImages.length} ภาพ)`
  categories: IResImageTypeAttachMultipleData[] = [];
  recent_image_data: IResImageAttachMultipleData[] = [];
  temp_master_categories: IResImageTypeAttachMultipleData[] = [];
  currentimageeditcode: string = ''
  disableUploadBtn: boolean = true
  selectImage: string = ''
  imageindex: number = 0
  quoid: string = ''

  image = new FormControl('', Validators.required)

  uploadForm = this.fb.group({
    image: this.image
  });

  imageAttachForm = this.fb.group({
    uploadForm: this.uploadForm,
  })

  constructor(
    private fb: FormBuilder,
    private loadingService: LoadingService,
    private quotationService: QuotationService,
    public _snackBar: MatSnackBar,
    private sanitizer: DomSanitizer,
    public dialogRef: MatDialogRef<SecondhandCarAttachImageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IDialogSecondhandCarImageAttach
  ) {
    this.hiddenInput = new ElementRef(null);
    this.fileInput = new ElementRef(null);

    // === value Change ===

    this.uploadForm.valueChanges.subscribe((value) => {
      if (this.uploadForm.valid) {
        this.disableUploadBtn = false
      } else {
        this.disableUploadBtn = true
      }
    })
  }

  // *** this is mod from image-attach file that remove some feature (zoom, edit, check form valid of image attach file) ***

  ngOnInit(): void {
  }


  async onFileChange(event: any) {
    const imageFile = event.target.files[0];
    const options = {
      maxSizeMB: 2,
      maxWidthOrHeight: 1920,
      useWebWorker: true
    }

    try {
      this.loadingService.showLoader()
      const compressedFile = await imageCompression(imageFile, options);
      const reader = new FileReader();

      reader.readAsDataURL(compressedFile);

      reader.onload = async () => {
        if (typeof reader.result === 'string') {
          this.selectImage = reader.result;
          this.uploadedImages.push({
            name: '12',
            image_id: ``,
            image_code: ``,
            image_header: `รูปภาพรถมือสอง (รูปที่ ${this.imageindex + 1})`,
            image_field_name: ``,
            urlsanitizer: this.sanitizer.bypassSecurityTrustUrl(this.selectImage),
            arrayBlob: await this._base64toblob(this.selectImage),
            src: this.selectImage
          })

          this.loadingService.hideLoader()

          if (this.uploadedImages.length >= 2) {
            this.txtsecondhandcarheaderstatus = `จำนวนไฟล์แนบผ่านขั้นต่ำแล้ว (จำนวนภาพที่แนบ: ${this.uploadedImages.length} ภาพ)`
          } else {
            this.txtsecondhandcarheaderstatus = `รูปภาพแนบสำหรับรถมือสอง (ขั้นต่ำ 2 ภาพ) (จำนวนภาพที่แนบ: ${this.uploadedImages.length} ภาพ)`
          }

          this.imageindex++
        }
      };
    } catch (e: any) {
      this.loadingService.hideLoader()
      console.log(`Error when compress image : ${e.message ? e.message : 'No message return'}`)
    }
  }


  savesecondhandcarimagelist() {
    this.loadingService.showLoader()
    let imagedatasend = this.uploadedImages
    imagedatasend.map(x => {
      return x.src = '', x.urlsanitizer = ''
    })
    let itemDataList = JSON.stringify(imagedatasend)

    let itemData = JSON.stringify({
      quotationid: this.data.quotationid,
      contract_ref: this.data.contract_ref,
      bussiness_code: this.data.bussiness_code
    })

    console.log(`log data in secondhand car image attach dialog !!`)
    console.log(`quotationid : ${this.data.quotationid}`)
    console.log(`contract_ref : ${this.data.contract_ref}`)
    console.log(`bussiness_code : ${this.data.bussiness_code}`)

    let fd = new FormData()
    fd.append('id', itemData)
    fd.append('item_list', itemDataList)
    for (let i = 0; i < this.uploadedImages.length; i++) {
      fd.append(`image_${i + 1}`, this.uploadedImages[i].arrayBlob,)
    }
    this.quotationService.MPLS_create_image_attach_file_multiple_list(fd).subscribe({
      next: async (res_create_image_list) => {
        this.loadingService.hideLoader()
        if (res_create_image_list.status) {
          // *** success insert secondhand car image attach (2 image at lease) ****
          try {
            await this.checksecondhandcarimageattachtype()
          } catch (e: any) {
            this.snackbarfail(`Eror update Flag : ${e.message ? e.message : 'No return msg'}`)
          }
          console.log(`trigger IResDialog2ndhandCarImageAttach onclose`)
          const iresdialog_2ndhandcar: IResDialog2ndhandCarImageAttach = {
            upload_status: true,
            state: `success`
          }
          this.dialogRef.close(iresdialog_2ndhandcar)
        } else {
          this.snackbarfail(`Error : ${res_create_image_list.message ? res_create_image_list.message : 'No return msg'}`)
        }
      }, error: (e) => {
        this.loadingService.hideLoader()
        this.snackbarfail(`Error : ${e.message ? e.message : 'No return msg'}`)
      }, complete: () => {
        this.loadingService.hideLoader()
        console.log(`trigger complete insert image secondhand car attach !!`)
      }
    })
  }

  async checksecondhandcarimageattachtype() {


    const checkverifysecondhandcarimagelist = this.uploadedImages.filter((item) => { return (item.name == '12') })

    if (checkverifysecondhandcarimagelist.length >= 2) {
      this.quotationService.MPLS_update_flag_image_attach_file_multiple(this.data.quotationid ?? '').subscribe({
        next: (res_update_second_hand_verify) => {
          if (res_update_second_hand_verify.status === 200) {
            const iresdialog_2ndhandcar: IResDialog2ndhandCarImageAttach = {
              upload_status: true,
              state: `success`
            }
            this.dialogRef.close(iresdialog_2ndhandcar)
          }
        }, error: (e) => {
          this.snackbarfail(`Error flag status : ${e.message ? e.message : 'No return msg'}`)
        }, complete: () => {

        }
      })
    }
  }

  async _base64toblob(base64image: string) {
    const base64Data = base64image;
    // const base64 = await fetch(base64Data);
    const base64Response = await fetch(`${base64Data}`);
    const blob = await base64Response.blob();
    return blob
  }

  _arrayBufferToJpeg(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return 'data:image/jpeg;base64,' + btoa(binary);
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
