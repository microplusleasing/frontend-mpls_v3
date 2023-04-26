import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IImageAttachUploadMultiple } from 'src/app/interface/i-image-attach-upload-multiple';
import { LoadingService } from 'src/app/service/loading.service';
import { MasterDataService } from 'src/app/service/master.service';
import { QuotationService } from 'src/app/service/quotation.service';
import { lastValueFrom } from 'rxjs';
import { BaseService } from 'src/app/service/base/base.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IResImageAttachMultipleData } from 'src/app/interface/i-res-image-attach-multiple';
import { IResImageTypeAttachMultipleData } from 'src/app/interface/i-res-image-type-attach-multiple';
import { DomSanitizer } from '@angular/platform-browser';
import { ImageDialogComponent } from 'src/app/widget/dialog/image-dialog/image-dialog.component';

@Component({
  selector: 'app-view-car-attach',
  templateUrl: './view-car-attach.component.html',
  styleUrls: ['./view-car-attach.component.scss']
})
export class ViewCarAttachComponent extends BaseService implements OnInit {

  appid: string = ''
  txtsecondhandcarheader: string = 'รูปภาพรถมือสอง'
  uploadedImagesMultiple: IImageAttachUploadMultiple[] = [];
  recent_image_multiple_data: IResImageAttachMultipleData[] = [];
  temp_master_categories_multiple: IResImageTypeAttachMultipleData[] = [];

  constructor(
    private loadingService: LoadingService,
    public override dialog: MatDialog,
    public override _snackBar: MatSnackBar,
    private actRoute: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private quotationService: QuotationService
  ) {
    super(dialog, _snackBar)
    this.actRoute.queryParams.subscribe(params => {
      this.appid = params['application_num']
    });
  }

  async ngOnInit(): Promise<void> {
    try {
      this.loadingService.showLoader()
      this.uploadedImagesMultiple = []
      const recent_multiple_image = await lastValueFrom(this.quotationService.MPLS_getimage_multiple_filebyappid(this.appid))
      // === set exist image data to variable === 
      this.loadingService.hideLoader()
      this.recent_image_multiple_data = recent_multiple_image.data

      // === create uploadImage photo ===
      if (recent_multiple_image.data && recent_multiple_image.data.length !== 0) {
        const lastIndex = recent_multiple_image.data.length;
        recent_multiple_image.data.forEach(async (item, i) => {
          const imageStr = this._arrayBufferToJpeg(item.image_file.data)
          const sequence = i === 0 ? lastIndex : lastIndex - (i);
          this.uploadedImagesMultiple.push({
            name: item.image_name ?? '',
            image_code: item.image_code ?? '',
            image_id: item.image_id ?? '',
            image_header: `รูปภาพรถมือสอง (รูปที่ ${sequence})` ?? '',
            image_field_name: item.image_name ?? '',
            urlsanitizer: this.sanitizer.bypassSecurityTrustUrl(imageStr),
            src: imageStr
          })
        })
      }

    } catch (e: any) {
      this.loadingService.hideLoader()
      this.snackbarfail(`Error: ทำการอัพโหลดภาพไม่สำเร็จ : ${e.message ? e.message : 'No return Msg'}`)
    }
  }

  openimageMultipledialog(image: any) {
    const imageselect = this.uploadedImagesMultiple.filter(img => img == image)

    if (imageselect) {
      this.dialog.open(ImageDialogComponent, {
        data: {
          header: '',
          message: '',
          imageurl: imageselect[0].src,
          button_name: 'Ok'
        }
      }).afterClosed().subscribe(result => {
        // === do nothing ==
      });
    }
  }

}
