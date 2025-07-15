import { BehaviorSubject, map } from 'rxjs';
import { IConsentdata } from './../../interface/i-consent';
import { ImageService } from 'src/app/service/image.service';
import { IResQuotationDetailData } from 'src/app/interface/i-res-quotation-detail';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IUserToken, IUserTokenData } from 'src/app/interface/i-user-token';
import { MatDialog } from '@angular/material/dialog';
import { MainDialogComponent } from 'src/app/widget/dialog/main-dialog/main-dialog.component';
import { QuotationService } from 'src/app/service/quotation.service';
import { BreakpointObserver } from '@angular/cdk/layout';

@Component({
    selector: 'app-bypass-signature',
    templateUrl: './bypass-signature.component.html',
    styleUrls: ['./bypass-signature.component.scss'],
    standalone: false
})
export class BypassSignatureComponent implements OnInit {

  quotationkeyid: string = '';
  userSessionQuotation = {} as IUserTokenData;
  quoitem = {} as IResQuotationDetailData

  name = 'Angular';
  fileToUpload: any;
  customerSig: Promise<string> | null = null;
  witnessSIg: Promise<string> | null = null;
  editstage$ = new BehaviorSubject<boolean>(true)

  quotaionId = new FormControl('', Validators.required)
  customerSigField = new FormControl<string | File | undefined>('', Validators.required)
  witnessSigField = new FormControl<string | File | undefined>('', Validators.required)

  bypassSigForm = this.fb.group({
    quotaionId: this.quotaionId,
    customerSigField: this.customerSigField,
    witnessSigField: this.witnessSigField
  })

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
    private actRoute: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
    private quotationService: QuotationService,
    private imageService: ImageService,
    private breakpointObserver: BreakpointObserver
  ) {

    this.customerSig = new Promise((resolve) => {
      resolve(`/assets/image/placeholder-image.png`)
    })
    this.witnessSIg = new Promise((resolve) => {
      resolve(`/assets/image/placeholder-image.png`)
    })
  }



  ngOnInit(): void {
    const queryParams = this.actRoute.snapshot.queryParamMap;
    this.quotationkeyid = queryParams.get('id') ?? '';
    if (this.quotationkeyid !== '') {
      // === get user session === 
      const userdata = localStorage.getItem('currentUser')
      if (userdata) {
        const userdataObj = (JSON.parse(userdata) as IUserToken).data;
        this.userSessionQuotation = userdataObj
        if (userdataObj.channal) {
          if (userdataObj.channal == 'checker') {

            // === reject if not admin role === 
            if (userdataObj.RADMIN == 'Y') {
              this.donext();
            } else {
              // === not admin ===
              // === route to home page === 
              this.dialog.open(MainDialogComponent, {
                panelClass: 'custom-dialog-container',
                data: {
                  header: 'Permission Check',
                  message: 'No permission',
                  button_name: 'Ok'
                }
              }).afterClosed().subscribe(result => {
                // === clear token and go to login page === 
                this.router.navigate(['/'])
              });
            }
          } else {
            this.dialog.open(MainDialogComponent, {
              panelClass: 'custom-dialog-container',
              data: {
                header: 'Permission invalid',
                message: 'ไม่มีสิทธิ์ในการเข้าถึงหน้านี้',
                button_name: 'Ok'
              }
            }).afterClosed().subscribe(result => {
              // === clear token and go to login page === 
              this.router.navigate(['/'])
            });
          }
        }
      }
    } else {
      // === quotaion id is null ===
      this.dialog.open(MainDialogComponent, {
        panelClass: 'custom-dialog-container',
        data: {
          header: 'No Quotation ID',
          message: 'ใบพบเลขใบคำขอนี้',
          button_name: 'Ok'
        }
      }).afterClosed().subscribe(result => {
        // === clear token and go to login page === 
        this.router.navigate(['/'])
      });
    }

  }

  async donext() {
    // === check quotation record found with condition === 
    // *** for condition that can bypass signature  
    // is 'QUO_KEY_APP_ID' === 'APPLICATION_NUM' and 'CONTRACT_NO IS NOT NULL ***

    this.quotationService.getquotationbyid(this.quotationkeyid).subscribe((results) => {
      if (results.data.length === 1) {
        // === check conditon ('QUO_KEY_APP_ID' == 'APPLICATION_NUM') and 'CONTRACT_NO IS NOT NULL
        this.quoitem = results.data[0];
        if (
          (this.quoitem.application_num == this.quoitem.quo_key_app_id) &&
          this.quoitem.loan_result === 'Y' &&
          (this.quoitem.contract_no === '' || this.quoitem.contract_no === null)
        ) {
          // === set quoid form return check validate === 
          this.bypassSigForm.controls.quotaionId.setValue(this.quoitem.quo_key_app_id);

          this.imageService.getsignimage(this.quotationkeyid).subscribe(async (results) => {
            if (results.status === 200) {
              const cussigimagebase64 = await this.getUrlImage(results.data[0])
              this.customerSig = new Promise((resolve) => {
                resolve(cussigimagebase64)
              })

              const witnesssigimagebase64 = await this.getUrlImagWitness(results.data[0])
              this.witnessSIg = new Promise((resolve) => {
                resolve(witnesssigimagebase64)
              })

              // === disable upload sign when already have data === 
              this.editstage$.next(false)
            }
          })

        } else {
          // === out condition === 
          this.dialog.open(MainDialogComponent, {
            panelClass: 'custom-dialog-container',
            data: {
              header: '',
              message: 'เงื่อนไขรายการใบคำขอไม่ถูกต้อง',
              button_name: 'Ok'
            }
          }).afterClosed().subscribe(result => {
            // === clear token and go to login page === 
            this.router.navigate(['/'])
          });
        }
      } else if (results.data.length > 1) {
        console.log(`Duplicate ID`)
        // === handle Duplicate ID here ===
      } else {
        console.log(`Not found Record`)
        // === not found record ===
        this.dialog.open(MainDialogComponent, {
          panelClass: 'custom-dialog-container',
          data: {
            header: 'ไม่พบรายการ',
            message: 'ไม่พบรายการใบคำขอ',
            button_name: 'Ok'
          }
        }).afterClosed().subscribe(result => {
          // === clear token and go to login page === 
          this.router.navigate(['/'])
        });
      }

    })
  }

  handleFileInput(file: any, type: string) {
    // this.fileToUpload = file.item(0);
    this.fileToUpload = <File>file.target.files[0];
    this.setImagetoform(this.fileToUpload, type)

    //Show image preview
    let reader = new FileReader();
    reader.onload = (event: any) => {
      if (type === 'customer') {
        this.customerSig = new Promise((resolve) => {
          resolve(event.target.result)
        })
      } else if (type === 'witness') {
        this.witnessSIg = new Promise((resolve) => {
          resolve(event.target.result)
        })
      }
    }
    reader.readAsDataURL(this.fileToUpload);
  }


  setImagetoform(fielimg: File, type: string) {
    if (type === 'customer') {
      this.bypassSigForm.controls.customerSigField.setValue(fielimg)
    } else if (type === 'witness') {
      this.bypassSigForm.controls.witnessSigField.setValue(fielimg)
    }
  }

  uploadbypassimage() {
    // console.log(`quotation ID : ${this.bypassSigForm.controls.quotaionId.value}`)

    const idquoation = this.bypassSigForm.controls.quotaionId.value

    const itemString = JSON.stringify(idquoation)

    let fd = new FormData();
    fd.append('quotationid', itemString)
    if (this.bypassSigForm.controls.customerSigField.value) { fd.append('customersig_image', this.bypassSigForm.controls.customerSigField.value ?? '') };
    if (this.bypassSigForm.controls.witnessSigField.value) { fd.append('witnesssig_image', this.bypassSigForm.controls.witnessSigField.value ?? '') };

    this.quotationService.bypasssignature(fd).subscribe({
      next: (results) => {
        if (results.status === 200) {
          this.dialog.open(MainDialogComponent, {
            panelClass: 'custom-dialog-container',
            data: {
              header: 'Success',
              message: 'แนบไฟล์ภาพสำเร็จ',
              button_name: 'Ok'
            }
          }).afterClosed().subscribe(result => {
            // === clear token and go to login page === 
            this.router.navigate(['/'])
          });
        } else {
          this.dialog.open(MainDialogComponent, {
            panelClass: 'custom-dialog-container',
            data: {
              header: 'Duplicate',
              message: 'มีการสร้างไฟล์ภาพแล้ว ไม่สามารถทำรายการได้',
              button_name: 'Ok'
            }
          }).afterClosed().subscribe(result => {
            // === clear token and go to login page === 
            this.router.navigate(['/'])
          });
        }
      },
      error: (err) => {
        console.log(`throw error: ${JSON.stringify(err)}`)
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
