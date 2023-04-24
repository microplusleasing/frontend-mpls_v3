import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BehaviorSubject, map } from 'rxjs';
import { IDialogEConsentImage } from 'src/app/interface/i-dialog-e-consent-image';
import { IResGeteconsentimagebyidData } from 'src/app/interface/i-res-geteconsentimagebyid';
import { LoadingService } from 'src/app/service/loading.service';
import { QuotationService } from 'src/app/service/quotation.service';

@Component({
  selector: 'app-e-consent-image-dialog',
  templateUrl: './e-consent-image-dialog.component.html',
  styleUrls: ['./e-consent-image-dialog.component.scss']
})
export class EConsentImageDialogComponent implements OnInit {

  nullquotation_txt: string = ''
  econsentimage$ = new BehaviorSubject<string>('')

  cardLayout = this.breakpointObserver
    .observe('(min-width: 800px)')
    .pipe(
      map(({ matches }) => {
        if (matches) {
          return {
            columns: 12,
            list: { maxcols: 12, cols6: 6, cols4: 4, cols3: 3, cols2: 2, col: 1 }
          };
        }

        return {
          columns: 1,
          list: { maxcols: 1, cols6: 1, cols4: 1, cols3: 1, cols2: 1, col: 1 }
        };
      })
    );

  constructor(
    private loadingService: LoadingService,
    public quotationService: QuotationService,
    private breakpointObserver: BreakpointObserver,
    public dialogRef: MatDialogRef<EConsentImageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IDialogEConsentImage,
  ) {
    this.econsentimage$.next('/assets/image/placeholder-image.png')
  }

  ngOnInit(): void {

    // **** check quotation param ****

    if (
      this.data.quotationid == null ||
      this.data.quotationid == '' ||
      this.data.quotationid == undefined
    ) {
      this.nullquotation_txt = `ไม่พบเลข quotationid`
    } else {

      // *** call api return e-consent image ****
      this.loadingService.showLoader()
      this.quotationService.MPLS_geteconsentimagebyid(this.data.quotationid).subscribe({
        next: async (res_image) => {


          // *** success load e-consent image ***
          if (res_image.status == 200) {
            const econsentimagebase64 = await this.getUrlImage(res_image.data[0])
            this.econsentimage$.next(econsentimagebase64)
          } else {
            this.dialogRef.close(true)
          }
        }, error: (e) => {
          this.loadingService.hideLoader()
        }, complete: () => {
          this.loadingService.hideLoader()
        }
      })
    }
  }

  getUrlImage(data: IResGeteconsentimagebyidData): Promise<string> {
    return new Promise((resolve, reject) => {
      const buf = data.econsent_image.data;
      const base64format = `data:image/jpeg;base64,`
      const base64data = this._arrayBufferToBase64(buf)
      const strurl = `${base64format}${base64data}`
      if (strurl) {
        resolve(strurl);
      } else {
        reject(`/assets/image/placeholder-image.png`);
      }
    })
  }

  _arrayBufferToBase64(buffer: any) {
    var binary = '';
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

}
