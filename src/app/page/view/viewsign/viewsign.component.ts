import { QuotationService } from 'src/app/service/quotation.service';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest, filter, map } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { IConsentdata } from 'src/app/interface/i-consent';
import { ViewsignService } from 'src/app/service/viewsign.service';
import { MainDialogComponent } from 'src/app/widget/dialog/main-dialog/main-dialog.component';
import { BreakpointObserver } from '@angular/cdk/layout';
import { LoadingService } from 'src/app/service/loading.service';
import { environment } from 'src/environments/environment';
import { EConsentImageDialogComponent } from 'src/app/widget/dialog/e-consent-image-dialog/e-consent-image-dialog.component';
import { IResGeteconsentimagebyidData } from 'src/app/interface/i-res-geteconsentimagebyid';

@Component({
  selector: 'app-viewsign',
  templateUrl: './viewsign.component.html',
  styleUrls: ['./viewsign.component.scss']
})
export class ViewsignComponent implements OnInit {

  // image src subject
  customersignatureimg$ = new BehaviorSubject<string>('')
  witnesssignatureimg$ = new BehaviorSubject<string>('')
  econsentimage$ = new BehaviorSubject<string>('')

  // === add image customer cizcard (dipchip) and face customer compare (add on 09/02/2023) ===
  customerdipchipimg$ = new BehaviorSubject<string>('')
  facecustomerimg$ = new BehaviorSubject<string>('')
  resultFaceCompare: string = ''
  reasonFaceCompare: string = ''


  // === chk API get image work
  letverify$ = new BehaviorSubject<boolean>(false)
  iserr$ = new BehaviorSubject<boolean>(false)
  errmsg$ = new BehaviorSubject<string>('')
  alreadyverify$ = new BehaviorSubject<boolean>(false)
  verifyby$ = new BehaviorSubject<string>('')

  // === set user and quotation === 
  userid = new BehaviorSubject<string>('')
  quotationid = new BehaviorSubject<string>('')


  selectverify = new FormControl('', Validators.requiredTrue)

  viewsignForm = this.fb.group({
    selectverify: this.selectverify
  });

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
    private fb: FormBuilder,
    private loadingService: LoadingService,
    private route: ActivatedRoute,
    private viewsignService: ViewsignService,
    private dialog: MatDialog,
    public quotationService: QuotationService,
    private breakpointObserver: BreakpointObserver
  ) {
    this.customersignatureimg$.next('/assets/image/placeholder-image.png')
    this.witnesssignatureimg$.next('/assets/image/placeholder-image.png')
    this.customerdipchipimg$.next('/assets/image/placeholder-image.png')
    this.facecustomerimg$.next('/assets/image/placeholder-image.png')
    this.econsentimage$.next('/assets/image/placeholder-image.png')
  }

  ngOnInit(): void {

    // === clear dopa status (11/11/2022) ===
    this.loadingService.showLoader()

    this.quotationService.cleardopastatus()
    // get query param 

    this.route.queryParams.subscribe({
      next: (res) => {
        // keep userid and quotation id from query param
        this.quotationid.next(res['quotationid'])
        this.userid.next(res['userid'])

        //== set dopa text status (11/11/2022) ===
        this.quotationService.setstatusdopa_unlock(res['quotationid'])

        const combinedd$ = combineLatest([
          this.viewsignService.getviewsignimage(this.quotationid.value),
          this.quotationService.MPLS_getimagetocompareiapp_unlock(this.quotationid.value),
          this.quotationService.MPLS_geteconsentimagebyid(this.quotationid.value)
        ]).subscribe({
          next: async ([res_viewsign, res_face_compare, res_econsent_image]) => {
            this.loadingService.hideLoader()
            // === handle viesign ===
            if (res_viewsign.status == 200) {
              this.letverify$.next(true)
              const cussigimagebase64 = await this.getUrlImage(res_viewsign.data[0])
              this.customersignatureimg$.next(cussigimagebase64)

              const witnesssigimagebase64 = await this.getUrlImagWitness(res_viewsign.data[0])
              this.witnesssignatureimg$.next(witnesssigimagebase64)

              // == check if aleady verify (verify_status)
              if (res_viewsign.data[0].verify_status == 1) {
                this.alreadyverify$.next(true)
                this.verifyby$.next(res_viewsign.data[0].verify_by)
              }
            }
            //== set dopa text status (11/11/2022) ===
            // this.quotationService.setstatusdopa(results.data[0].cons_quo_key_app_id)

            // === handle face compare ===

            if (res_face_compare.status == 200) {
              this.customerdipchipimg$.next((res_face_compare.data.file1 == null || res_face_compare.data.file1 == '') ? `${environment.citizen_card_img_preload}` : `data:image/jpeg;base64,${res_face_compare.data.file1}`)
              this.facecustomerimg$.next((res_face_compare.data.file2 == null || res_face_compare.data.file2 == '') ? `${environment.citizen_card_img_preload}` : `data:image/jpeg;base64,${res_face_compare.data.file2}`)

              this.quotationService.MPLS_is_check_face_valid_unlock(this.quotationid.value).subscribe({
                next: (res_check_face) => {
                  this.resultFaceCompare = res_check_face.data.status == 'Y' ? 'ตรงกัน' : 'ไม่ตรงกัน'
                  this.reasonFaceCompare = res_check_face.data.reason ? res_check_face.data.reason : '-'
                }, error: (e) => {
                  console.log(`Error : ${e.message ? e.message : 'No return message'}`)
                }, complete: () => {
                  console.log(`complete trigger on get check face compare (MPLS_is_check_face_valid_unlock)`)
                }
              })
            } else {
              console.log('res_face_compare status !== 200')
            }

            if (res_econsent_image.status == 200) {
              const econsentimagebase64 = await this.getUrlEconsentImage(res_econsent_image.data[0])
              this.econsentimage$.next(econsentimagebase64)
            } else {
              console.log('res_econsent_image !== 200')
            }


          }, error: (e) => {

            // === handle of viewsign ====
            this.loadingService.hideLoader()
            // === handle error status return ===
            console.log(JSON.stringify(e))
            this.iserr$.next(true)
            this.errmsg$.next(`ไม่สามารถเรียกดูลายเซ็นต์ได้`)
          }, complete: () => {
            this.loadingService.hideLoader()
            console.log(`complete combindeLasted face compare and viewsign image`)
          }
        })

      }, error: (e) => {
        this.loadingService.hideLoader()
        // === handle error status return ===
        console.log(JSON.stringify(e))
        this.iserr$.next(true)
        this.errmsg$.next(`ไม่สามารถเรียกดูลายเซ็นต์ได้`)
      }, complete: () => {
        this.loadingService.hideLoader()
        console.log(`trigger complete queryParams`)
      }
    })
  }

  onselectcheckbox(event: any) {
    const value = event.checked
    this.viewsignForm.controls.selectverify.setValue(value)
  }

  onclickbtn() {

    this.loadingService.showLoader()

    this.viewsignService.verifyviewsignimage(this.quotationid.value, this.userid.value).subscribe({
      next: (res) => {
        // return fail or success status 
        // done ====
        this.viewsignService.getviewsignimage(this.quotationid.value).subscribe({
          next: async (resultsreload) => {
            // map customer imgae and witness image from return data
            this.loadingService.hideLoader()
            if (resultsreload.status == 200) {
              this.letverify$.next(true)
              const cussigimagebase64 = await this.getUrlImage(resultsreload.data[0])
              this.customersignatureimg$.next(cussigimagebase64)

              const witnesssigimagebase64 = await this.getUrlImagWitness(resultsreload.data[0])
              this.witnesssignatureimg$.next(witnesssigimagebase64)

              // == check if aleady verify (verify_status)
              if (resultsreload.data[0].verify_status == 1) {
                this.alreadyverify$.next(true)
                this.verifyby$.next(resultsreload.data[0].verify_by)
              }
            }
          }, error: (e) => {
            // === handle error status return ===
            this.loadingService.hideLoader()
            console.log(JSON.stringify(e))
            this.iserr$.next(true)
            this.errmsg$.next(`ไม่สามารถเรียกดูลายเซ็นต์ได้`)
          }, complete: () => {
            this.loadingService.hideLoader()
          }
        })
      }, error: (e) => {
        this.loadingService.hideLoader()
        this.dialog.open(MainDialogComponent, {
          panelClass: 'custom-dialog-container',
          data: {
            header: 'Fail',
            message: 'ไม่สามารถยืนยีนได้',
            button_name: 'Ok'
          }
        }).afterClosed().subscribe(result => {
          // === clear token and go to login page === 
        });
      }, complete: () => {
        this.loadingService.hideLoader()
        console.log(`trigger complete (verifyviewsignimage)`)
      }
    })
  }


  getUrlImage(data: IConsentdata): Promise<string> {
    return new Promise((resolve, reject) => {
      const buf = data.signature_image.data;
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

  getUrlEconsentImage(data: IResGeteconsentimagebyidData): Promise<string> {
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

  getUrlImagWitness(data: IConsentdata): Promise<string> {
    return new Promise((resolve, reject) => {
      const buf = data.witness_image.data;
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
