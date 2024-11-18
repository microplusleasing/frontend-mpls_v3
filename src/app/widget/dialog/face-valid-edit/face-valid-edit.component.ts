import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IDialogFacevalidEdit } from 'src/app/interface/i-dialog-face-valid-edit';
import { BaseService } from 'src/app/service/base/base.service';
import { ControlService } from 'src/app/service/control.service';
import { LoadingService } from 'src/app/service/loading.service';
import { environment } from 'src/environments/environment';
import imageCompression from 'browser-image-compression';

@Component({
  selector: 'app-face-valid-edit',
  templateUrl: './face-valid-edit.component.html',
  styleUrl: './face-valid-edit.component.scss'
})
export class FaceValidEditComponent extends BaseService implements OnInit {

  /* ... file image & url image ... */
  customerfullname: string = ''
  citizenimagefile: string = ''
  photofaceimagefile: string = ''

  citizenimageurl: string = '';
  photofaceimageurl: string = '';

  /* ... form ... */
  quotationid = new FormControl<string>('', Validators.required)
  citizenface = new FormControl<string | ''>('', Validators.required)
  photoface = new FormControl<string | ''>('', Validators.required)

  editfacecompareimageform = this.fb.group({
    quotationid: this.quotationid,
    citizenface: this.citizenface,
    photoface: this.photoface
  })

  constructor(
    private fb: FormBuilder,
    private controlService: ControlService,
    private loadingService: LoadingService,
    public override _snackBar: MatSnackBar,
    public override dialog: MatDialog,
    public dialogRef: MatDialogRef<FaceValidEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IDialogFacevalidEdit
  ) {
    super(dialog, _snackBar)
  }

  async ngOnInit() {
    this.loadingService.showLoader()
    this.editfacecompareimageform.controls.quotationid.setValue(this.data.quotationid)
    this.controlService.getcustomerfaceimage(this.data.quotationid).subscribe({
      next: async (res_customer_face_image) => {

        this.loadingService.hideLoader()

        /* ... set value to image url ... */
        this.customerfullname = `${res_customer_face_image.data.citizen_file.title_name} ${res_customer_face_image.data.citizen_file.first_name} ${res_customer_face_image.data.citizen_file.last_name}`

        this.citizenimagefile = this._arrayBufferToBase64(res_customer_face_image.data.citizen_file.cizcard_image.data)
        this.citizenimageurl = (this.citizenimagefile == null || this.citizenimagefile == '') ? `${environment.citizen_card_img_preload}` : `data:image/jpeg;base64,${this.citizenimagefile}`

        if (res_customer_face_image.data.facecompare_file) {
          this.photofaceimagefile = this._arrayBufferToBase64(res_customer_face_image.data.facecompare_file.image_file.data)
          this.photofaceimageurl = (this.photofaceimagefile == null || this.photofaceimagefile == '') ? `${environment.citizen_card_img_preload}` : `data:image/jpeg;base64, ${this.photofaceimagefile}`
        } else {
          this.photofaceimageurl = `${environment.citizen_card_img_preload}`
        }

        this.editfacecompareimageform.controls.citizenface.setValue(this.photofaceimageurl)


      }, error: (error) => {

      }, complete: () => {

      }
    })
  }

  async attachphotofaceimage($event: any) {
    const imageFile = $event.target.files[0];

    const options = {
      maxSizeMB: 1.5,
      maxWidthOrHeight: 1920,
      useWebWorker: true
    }

    try {
      const compressedFile = await imageCompression(imageFile, options)

      const reader = new FileReader();

      reader.readAsDataURL(compressedFile);

      // Once the conversion is complete, you can use the resulting URL
      reader.onload = () => {
        let base64ImageUrl = reader.result;
        if (base64ImageUrl instanceof ArrayBuffer) {
          const arrayBuffer = new Uint8Array([72, 101, 108, 108, 111]).buffer;
          const decoder = new TextDecoder();
          base64ImageUrl = decoder.decode(arrayBuffer);
        }
        this.photofaceimageurl = base64ImageUrl ? base64ImageUrl : ''

        // === convert here ===
        const imagephotofaceurl = this.removeDataUrlPrefix(this.photofaceimageurl)

        this.editfacecompareimageform.controls.photoface.setValue(imagephotofaceurl)
        this.editfacecompareimageform.controls.photoface.updateValueAndValidity();

      }

      // You can now use the base64ImageUrl as the source for an image element, etc.

    } catch (error) {
      console.log(error);
    }
  }

  OnClickUploadfacecompareimage = async () => {
    console.log(`trigger click button upload facecompare image !`)
    this.loadingService.showLoader()

    let itemdata = {
      quotationid: this.data.quotationid ? this.data.quotationid : '',
      facecompare_image: this.editfacecompareimageform.controls.photoface.value
    }

    const itemString = JSON.stringify(itemdata)
    let fd = new FormData();
    fd.append('item', itemString)

    this.controlService.uploadfacecompareeditimage(fd).subscribe({
      next: (res_upload_facecompare) => {
        this.loadingService.hideLoader()

        if (res_upload_facecompare.status == 200) {
          this.snackbarsuccess('Upload ภาพสำเร็จ ! ✅')
        } else {
          this.snackbarfail(`Upload ไฟล์ภาพไม่สำเร็จ ! ❌ : ${res_upload_facecompare.message ? res_upload_facecompare.message : `No error message`}`)
        }

      }, error: (e) => {
        /* ... waiting implement ... */
        this.snackbarfail(`Faile to call service upload facecompare image : ${e.message ? e.message : `No error message !`}`)
      }, complete: () => {
        /* ... waiting implement ... */
      }
    }).add(() => {
      this.loadingService.hideLoader()
    })
  }

  removeDataUrlPrefix(imageString: string): string {
    const parts = imageString.split(';base64,');
    return parts[1];
  }

}
