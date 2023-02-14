import { BreakpointObserver } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, combineLatest, forkJoin, lastValueFrom, map, Observable, Subject } from 'rxjs';
import SignaturePad from 'signature_pad';
import { IImageData } from 'src/app/interface/i-image';
import { IMartaPaymentInsurance } from 'src/app/interface/i-marta-payment-insurance';
import { IReqSaveQrMrta } from 'src/app/interface/i-req-save-qr-mrta';
import { IResInsurance } from 'src/app/interface/i-res-insurance';
import { IResQuotationDetail } from 'src/app/interface/i-res-quotation-detail';
import { IUserTokenData } from 'src/app/interface/i-user-token';
import { BaseService } from 'src/app/service/base/base.service';
import { ImageService } from 'src/app/service/image.service';
import { LoadingService } from 'src/app/service/loading.service';
import { MasterDataService } from 'src/app/service/master.service';
import { QuotationService } from 'src/app/service/quotation.service';
import { MainDialogComponent } from 'src/app/widget/dialog/main-dialog/main-dialog.component';
import { LoyaltyConsentComponent } from '../signature-tab/consent/loyalty-consent/loyalty-consent.component';

@Component({
  selector: 'app-send-car-tab',
  templateUrl: './send-car-tab.component.html',
  styleUrls: ['./send-car-tab.component.scss']
})
export class SendCarTabComponent extends BaseService implements OnInit {

  @Input() quotationReq = {} as Observable<IResQuotationDetail>;
  @Output() changeEvent = new EventEmitter<boolean>();

  // === variable for MRTA component (22/09/2022) ===
  @Input() gender: number = 0
  @Input() age: number = 0

  private signaturePad?: SignaturePad;

  @ViewChild('signaturePad', { static: true }) canvas?: ElementRef;
  @ViewChild(LoyaltyConsentComponent)
  loyaltychild: LoyaltyConsentComponent = new LoyaltyConsentComponent(
    this.fb
  );





  firstImage = new FormControl<string | undefined>('', Validators.required)
  dealerSign = new FormControl<string | undefined>('', Validators.required)
  dealerName = new FormControl('', Validators.required)
  // ==== for show living place data only  (23/08/2022) ====
  livingAddress_address = new FormControl<string>('')
  livingAddress_subDistrict = new FormControl<string>('')
  livingAddress_district = new FormControl<string>('')
  livingAddress_provinceName = new FormControl<string>('')
  livingAddress_postalCode = new FormControl<string>('')
  livingAddress_lalon = new FormControl<string>('')
  livingAddress_la = new FormControl<string>('', Validators.required)
  livingAddress_lon = new FormControl<string>('', Validators.required)

  sendcarForm = this.fb.group({
    firstImage: this.firstImage,
    dealerSign: this.dealerSign,
    dealerName: this.dealerName,
    livingAddress_address: this.livingAddress_address,
    livingAddress_subDistrict: this.livingAddress_subDistrict,
    livingAddress_district: this.livingAddress_district,
    livingAddress_provinceName: this.livingAddress_provinceName,
    livingAddress_postalCode: this.livingAddress_postalCode,
    livingAddress_lalon: this.livingAddress_lalon,
    livingAddress_la: this.livingAddress_la,
    livingAddress_lon: this.livingAddress_lon
  })

  // --- old ---

  fileToUpload: any;
  firstimageattach: Promise<string> | null = null;
  secondimageattach: Promise<string> | null = null;
  thirdimageattach: Promise<string> | null = null;
  forthimageattach: Promise<string> | null = null;
  dealerSigImage: Promise<string> | null = null;
  allowedit$ = new BehaviorSubject<boolean>(true)
  countload: number = 0;
  showpage$ = new BehaviorSubject<boolean>(true)

  quotationresultData = {} as IResQuotationDetail
  userSession: IUserTokenData = {} as IUserTokenData
  insurancedetailData = {} as IResInsurance
  MRTAdata = {} as IMartaPaymentInsurance
  _ireqsaveqrmrta = {} as IReqSaveQrMrta

  insureData$: BehaviorSubject<IResInsurance> = new BehaviorSubject<IResInsurance>({} as IResInsurance)

  chKformloyaltyvalid$ = new Subject<boolean>();
  chekisWidRes$: Observable<boolean>;
  consentTabIndex: number = 0;
  qrTabIndex: number = 0;
  consentTabLabel = ['attach image', 'Loyalty Consent', 'Living place location'];
  lockloyaltyconsentform$ = new BehaviorSubject<boolean>(false); // === change from true on 22/09/2022 ===
  locklivingplacelocation$ = new BehaviorSubject<boolean>(false); // === change from true on 22/09/2022 ===
  chklivingplacelocation$ = new BehaviorSubject<boolean>(false);


  out_stand: number = 0
  insurance_code: string = ''
  insurance_year: number = 0
  insurance_seller: string = ''
  active_status: number = 0
  pay_status: number = 0

  lockqrpage: boolean = true

  application_num_qr: string = ''

  constructor(
    private fb: FormBuilder,
    private cd: ChangeDetectorRef,
    private router: Router,
    private cdRef: ChangeDetectorRef,
    private quotationService: QuotationService,
    private masterDataService: MasterDataService,
    private imageService: ImageService,
    private loadingService: LoadingService,
    public override dialog: MatDialog,
    public override _snackBar: MatSnackBar,
    private breakpointObserver: BreakpointObserver
  ) {
    super(dialog, _snackBar)

    this.chekisWidRes$ = breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(map(({ matches }) => (matches ? true : false)));
  }


  ngOnInit(): void {
    this.firstimageattach = new Promise((resolve) => {
      resolve('/assets/image/placeholder-image.png')
    })
    this.secondimageattach = new Promise((resolve) => {
      resolve('/assets/image/placeholder-image.png')
    })
    this.thirdimageattach = new Promise((resolve) => {
      resolve('/assets/image/placeholder-image.png')
    })
    this.forthimageattach = new Promise((resolve) => {
      resolve('/assets/image/placeholder-image.png')
    })
    this.dealerSigImage = new Promise((resolve) => {
      resolve('/assets/image/placeholder-image.png')
    })

    this.chklivingplacelocation$.next(false)
    this.chKformloyaltyvalid$.next(false)

    forkJoin([
      this.getUserSessionQuotation(),
      this.quotationReq
    ]).subscribe({
      next: async ([resSession, resQuo]) => {
        if (resSession) {
          this.userSession = resSession
        }

        if (resQuo) {
          this.quotationresultData = resQuo
          if (this.quotationresultData.status == 200) {
            // this.setquotationDatatoForm();
  
            // === set living address data record to form ==== 
            this.sendcarForm.controls.livingAddress_address.setValue(this.quotationresultData.data[0].lvp_address ?? '')
            this.sendcarForm.controls.livingAddress_subDistrict.setValue(this.quotationresultData.data[0].lvp_sub_district ?? '')
            this.sendcarForm.controls.livingAddress_district.setValue(this.quotationresultData.data[0].lvp_district ?? '')
            this.sendcarForm.controls.livingAddress_provinceName.setValue(this.quotationresultData.data[0].lvp_province_name ?? '')
            this.sendcarForm.controls.livingAddress_postalCode.setValue(this.quotationresultData.data[0].lvp_postal_code ?? '')
            this.sendcarForm.controls.livingAddress_lalon.setValue(this.quotationresultData.data[0].lvp_lalon ?? '')
            this.sendcarForm.controls.livingAddress_la.setValue(this.quotationresultData.data[0].lvp_latitude ?? '')
            this.sendcarForm.controls.livingAddress_lon.setValue(this.quotationresultData.data[0].lvp_londtiude ?? '')
  
            this.sendcarForm.controls.livingAddress_address.disable()
            this.sendcarForm.controls.livingAddress_subDistrict.disable()
            this.sendcarForm.controls.livingAddress_district.disable()
            this.sendcarForm.controls.livingAddress_provinceName.disable()
            this.sendcarForm.controls.livingAddress_postalCode.disable()
  
  
            if (this.quotationresultData.data[0].application_num) {
              this.quotationService.getinsurancedetailbyid(this.quotationresultData.data[0].application_num).subscribe({
                next: (result) => {
                  if (result.status == 200) {
                    this.insurancedetailData = result
  
                    // === set parameter loyalty consent value === 
  
                    this.insureData$.next(result)
                  } else {
                    console.log(`getinsurancedetailbyid return : ${result.message ? result.message : 'No return message'}`)
                  }
  
                }, error: (e) => {
                  // ==== not found insurance detail ==== 
                  this.insureData$.next({} as IResInsurance)
                }
              })
  
              // === get out stand value (22/09/2022) ===
  
              const checkmrtarecent = await lastValueFrom(this.masterDataService.checkmrtarecent(this.quotationresultData.data[0].quo_key_app_id))
  
              if (checkmrtarecent.status == 200) {
                if (checkmrtarecent.data.length !== 0) {
                  const recentmrtavalue = checkmrtarecent.data[0]
                  this.pay_status = recentmrtavalue.pay_status
                  this.active_status = recentmrtavalue.active_status
                  this.insurance_seller = recentmrtavalue.seller_id
                  this.insurance_code = recentmrtavalue.insurance_code
                  this.insurance_year = recentmrtavalue.insurance_year
                  this.out_stand = recentmrtavalue.out_stand
                } else {
                  this.masterDataService.getoracleoutstand(this.quotationresultData.data[0].application_num).subscribe((value) => {
                    if (value.data.length !== 0) {
                      // === set out stand return value from oracle (api) ===
                      this.out_stand = value.data[0].out_stand
                    }
                  })
                }
              } else {
                this.masterDataService.getoracleoutstand(this.quotationresultData.data[0].application_num).subscribe((value) => {
                  if (value.data.length !== 0) {
                    // === set out stand return value from oracle (api) ===
                    this.out_stand = value.data[0].out_stand
                  }
                })
              }
            }
          }
        }
      }, error: (e) => {
        console.error(e)
        console.log(e.message ? e.message : 'no return message')
      }, complete: () => {
        console.log(`trigger complete forkjoin : (session , quotation)`)
      }
    })

  }


  ngAfterViewInit(): void {
    this.cd.detectChanges();
    this.signaturePad = new SignaturePad(this.canvas?.nativeElement);

    this.signaturePad?.addEventListener("endStroke", () => {
      this.sendcarForm.controls.dealerSign.setValue(this.signaturePad?.toDataURL())
    })

    // === value Change ===
    this.sendcarForm.controls.livingAddress_lalon.valueChanges.subscribe((value) => {
      const lalonStr = value
      // const newString = '16.441073,100.351270'
      if (lalonStr !== '' && lalonStr !== null) {
        let rpString = lalonStr.replace(/[\(\)|\s]/g, "");
        let spitStr = rpString.split(",");
        if (spitStr.length > 1) {
          this.sendcarForm.controls.livingAddress_la.setValue(spitStr[0])
          this.sendcarForm.controls.livingAddress_lon.setValue(spitStr[1])
        }
      }
    })
  }

  onStageChageFormStepper() {

    if (this.quotationresultData.data[0].quo_key_app_id) {
      if (this.countload == 0) {
        const quotationid = this.quotationresultData.data[0].quo_key_app_id
        if (quotationid) {
          // === get deliver approve record === (api สำหรับแสดงรูปลายเซ็นคนที่ร้านและภาพรับรถลูกค้า)
          // ==== ถ้ามีรูป จะ lock field เพราะว่าเคยมีการส่งมอบรถไปแล้ว ===
          this.quotationService.getsendcardeliverbyid(quotationid).subscribe(({
            //
            next: (results) => {
              // console.log(`success check immage 14 , 15 `)

              if (results.status == 200) {
                this.allowedit$.next(false)
                this.setImagetodisplay(results.data)
                this.sendcarForm.controls.dealerName.setValue(this.quotationresultData.data[0].dealer_signature_owner)
                this.sendcarForm.controls.dealerName.disable();

                // === set la lon living place value ===
                this.sendcarForm.controls.livingAddress_address.setValue(this.quotationresultData.data[0].lvp_address ?? '')
                this.sendcarForm.controls.livingAddress_subDistrict.setValue(this.quotationresultData.data[0].lvp_sub_district ?? '')
                this.sendcarForm.controls.livingAddress_district.setValue(this.quotationresultData.data[0].lvp_district ?? '')
                this.sendcarForm.controls.livingAddress_provinceName.setValue(this.quotationresultData.data[0].lvp_province_name ?? '')
                this.sendcarForm.controls.livingAddress_postalCode.setValue(this.quotationresultData.data[0].lvp_postal_code ?? '')
                this.sendcarForm.controls.livingAddress_lalon.setValue(this.quotationresultData.data[0].lvp_lalon ?? '')
                this.sendcarForm.controls.livingAddress_la.setValue(this.quotationresultData.data[0].lvp_latitude)
                this.sendcarForm.controls.livingAddress_lon.setValue(this.quotationresultData.data[0].lvp_londtiude)

                this.sendcarForm.controls.livingAddress_address.disable()
                this.sendcarForm.controls.livingAddress_subDistrict.disable()
                this.sendcarForm.controls.livingAddress_district.disable()
                this.sendcarForm.controls.livingAddress_provinceName.disable()
                this.sendcarForm.controls.livingAddress_postalCode.disable()

                this.sendcarForm.controls.livingAddress_lalon.disable()
                this.sendcarForm.controls.livingAddress_la.disable()
                this.sendcarForm.controls.livingAddress_lon.disable()

                // === set data to loyalty consent form (19/08/2022) === 
                this.loyaltychild.loyaltyform.controls.is_check_sale_sheet_explain_value.setValue(this.quotationresultData.data[0].is_check_sale_sheet_explain)
                this.loyaltychild.loyaltyform.controls.is_check_product_detail_value.setValue(this.quotationresultData.data[0].is_check_product_detail)
                this.loyaltychild.loyaltyform.controls.is_check_payment_rule_value.setValue(this.quotationresultData.data[0].is_check_payment_rule)
                this.loyaltychild.loyaltyform.controls.is_check_contract_explain_value.setValue(this.quotationresultData.data[0].is_check_contract_explain)
                this.loyaltychild.loyaltyform.controls.is_check_total_loss_explain_value.setValue(this.quotationresultData.data[0].is_check_total_loss_explain)
                this.loyaltychild.loyaltyform.controls.is_check_total_loss_company_value.setValue(this.quotationresultData.data[0].is_check_total_loss_company)
                this.loyaltychild.loyaltyform.controls.is_check_life_insurance_value.setValue(this.quotationresultData.data[0].is_check_life_insurance)
                this.loyaltychild.loyaltyform.controls.is_check_l_insur_detail_value.setValue(this.quotationresultData.data[0].is_check_l_insur_detail)
                this.loyaltychild.loyaltyform.controls.is_check_l_insur_plan_value.setValue(this.quotationresultData.data[0].is_check_l_insur_plan)
                this.loyaltychild.loyaltyform.controls.is_check_l_insur_company_value.setValue(this.quotationresultData.data[0].is_check_l_insur_company)
                this.loyaltychild.loyaltyform.controls.is_check_l_insur_refund_value.setValue(this.quotationresultData.data[0].is_check_l_insur_refund)
                this.loyaltychild.loyaltyform.controls.is_check_l_insur_cancle_d_value.setValue(this.quotationresultData.data[0].is_check_l_insur_cancle_d)

                // === loyalty consent (23/08/2022) ===
                this.chKformloyaltyvalid$.next(true)
                this.locklivingplacelocation$.next(false)
                this.lockloyaltyconsentform$.next(false)
                this.chklivingplacelocation$.next(true)
              } else {

                console.log(`no have data`)
                if (this.userSession.RADMIN == 'Y') {
                  this.showpage$.next(false)
                }
              }
            }, error: (e) => {
              console.log(`error with Exception : ${e}`)
            }
          }))



          this.countload++
        }
      }
    }
  }

  async setImagetodisplay(items: IImageData[]) {
    for (let i = 0; i < items.length; i++) {
      switch (items[i].image_name) {
        case 'firstImage': {
          const imagebase64 = await this.getUrlImage(items[i].image_file)
          this.firstimageattach = new Promise((resolve) => {
            resolve(imagebase64)
          })
        }
          break;
        case 'dealerSign': {
          const imagebase64 = await this.getUrlImage(items[i].image_file)
          this.dealerSigImage = new Promise((resolve) => {
            resolve(imagebase64)
          })
        }
          break;
      }
    }
  }


  setquotationDatatoForm() {
    console.log(`this is quotation data from parent (sendCar): ${this.quotationresultData.data[0].first_name}`);

    // === check status of quotaion (if loan_result == 'Y' send true back) === 
    if (this.quotationresultData.data[0].loan_result !== 'Y') {
      this.changeEvent.emit(false);
    }
  }

  handleFileInput(file: any, formcontrolname: string) {
    this.fileToUpload = <File>file.target.files[0];
    this.setImagetoform(this.fileToUpload, formcontrolname)
    //Show image preview
    let reader = new FileReader();
    reader.onload = (event: any) => {
      switch (formcontrolname) {
        case 'firstImage': {
          this.firstimageattach = new Promise((resolve) => {
            resolve(event.target.result)
          })
        }
          break;
        case 'secondImage': {
          this.secondimageattach = new Promise((resolve) => {
            resolve(event.target.result)
          })
        }
          break;
        case 'thirdImage': {
          this.thirdimageattach = new Promise((resolve) => {
            resolve(event.target.result)
          })
        }
          break;
        case 'forthImage': {
          this.forthimageattach = new Promise((resolve) => {
            resolve(event.target.result)
          })
        }
          break;
      }
    }
    reader.readAsDataURL(this.fileToUpload);
  }

  setImagetoform(fielimg: File, formcontrolname: string) {
    this.sendcarForm.get(formcontrolname)?.setValue(fielimg)
  }

  clearCanvas() {
    this.signaturePad?.clear();
    this.sendcarForm.controls.dealerSign.setValue('')
  }

  openimagedialog() {
    this.dialog.open(MainDialogComponent, {
      panelClass: 'custom-dialog-container',
      data: {
        header: 'ไม่พบรายการ',
        message: 'ไม่พบรายการใบคำขอ',
        button_name: 'Ok'
      }
    }).afterClosed().subscribe(result => {
      // === clear token and go to login page === 
    });
  }

  async uploaddeliverapproveimg() {

    this.loadingService.showLoader()
    let loyaltyconsnetdata = {
      is_check_sale_sheet_explain: this.loyaltychild.loyaltyform.controls.is_check_sale_sheet_explain_value.value,
      is_check_product_detail: this.loyaltychild.loyaltyform.controls.is_check_product_detail_value.value,
      is_check_payment_rule: this.loyaltychild.loyaltyform.controls.is_check_payment_rule_value.value,
      is_check_contract_explain: this.loyaltychild.loyaltyform.controls.is_check_contract_explain_value.value,
      is_check_total_loss_explain: this.loyaltychild.loyaltyform.controls.is_check_total_loss_explain_value.value,
      is_check_total_loss_company: this.loyaltychild.loyaltyform.controls.is_check_total_loss_company_value.value,
      lalon: this.sendcarForm.controls.livingAddress_lalon.value,
      latitude: this.sendcarForm.controls.livingAddress_la.value,
      londtiude: this.sendcarForm.controls.livingAddress_lon.value,

    }

    const loyaltyitem = JSON.stringify(loyaltyconsnetdata)
    let fd = new FormData();
    fd.append('loyaltyitem', loyaltyitem)
    fd.append('quotationid', this.quotationresultData.data[0].quo_key_app_id)
    fd.append('dealername', this.sendcarForm.controls.dealerName.value ?? '')
    if (this.sendcarForm.controls.firstImage.value) { fd.append('firstImage', this.sendcarForm.controls.firstImage.value) };
    if (this.sendcarForm.controls.dealerSign.value) { fd.append('dealerSign', await this._base64toblob(this.sendcarForm.controls.dealerSign.value)) };


    this.quotationService.MPLS_create_send_car_deliver_and_loyalty_consent(fd).subscribe({
      next: (results) => {
        this.loadingService.hideLoader();
        if (results.status == 200) {

          this.snackbarsuccess(`ทำรายการสำเร็จ`);
          // === set stage to finish ==== 
          this.setvalueaftersuccess()

        } else {
          this.snackbarfail(`แนบไฟล์ภาพส่งมอบรถไม่สำเร็จ : ${results.message ? results.message : 'No return Message'}`)
        }

      }, error: (error) => {
        console.log(`error when create send car : ${error.message ? error.message : 'No return message'}`);
        this.loadingService.hideLoader();
      }, complete: () => {
        this.loadingService.hideLoader();
      }
    })
  }

  async setvalueaftersuccess() {
    this.allowedit$.next(false)

    // === lock lalon field (24/08/2022) === 
    this.sendcarForm.controls.livingAddress_la.disable()
    this.sendcarForm.controls.livingAddress_lon.disable()
    this.sendcarForm.controls.livingAddress_lalon.disable()

    const sig64 = await this.loadimageformsig(this.sendcarForm.controls.dealerSign.value)
    const resultsDealerImage = await lastValueFrom(this.imageService.getdealersignimage(this.quotationresultData.data[0].quo_key_app_id))

    if (resultsDealerImage) {
      const imagebase64 = await this.getUrlImage(resultsDealerImage.data[0].image_file)
      this.dealerSigImage = new Promise((resolve) => {
        resolve(imagebase64)
      })
    }
    this.sendcarForm.controls.dealerName.setValue(this.sendcarForm.controls.dealerName.value)
    this.sendcarForm.controls.dealerName.disable();

  }

  loadimageformsig(data: any): Promise<string> {
    return new Promise((resolve, reject) => {
      const base64format = `data:image/jpeg;base64,`
      const base64data = this._arrayBufferToBase64(data)
      const strurl = `${base64format}${base64data}`
      if (strurl) {
        resolve(strurl);
      } else {
        reject(`/assets/image/placeholder-image.png`);
      }
    })
  }

  setimagereference() {
    // === manage and handler reference image deliver car ====

  }

  onNextStep() {
    const countConsent = this.consentTabLabel.length;
    // === unlock next consent ==== 
    switch (this.consentTabIndex) {
      case (0): {
        this.lockloyaltyconsentform$.next(false)
      }
        break;
      case (1): {
        this.locklivingplacelocation$.next(false)
      }
        break;
    }

    this.consentTabIndex = (this.consentTabIndex + 1) % countConsent;
    this.setMatTabGroup();
  }

  tabChange($event: any) {
    if ($event.index == 1) {
      // === loyalty tab ===
    } else if ($event.index == 3) {
      // === payment mrta select ===
      // *** trigger applicatin_num_qr value to gen advance-payment and total-loss-payment ****
      this.application_num_qr = this.quotationresultData.data[0].application_num
    }
  }

  setMatTabGroup() {
    this.router.events.subscribe((ev: any) => {
      if (ev instanceof NavigationEnd) {
        window.scrollTo(0, 0);
      }
    });
    this.scrollTo();
  }

  scrollTo(): void {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }

  opengooglemap() {
    const addressValue = this.sendcarForm.controls.livingAddress_address.value;
    const subdistrictValue = this.sendcarForm.controls.livingAddress_subDistrict.value;
    const districtValue = this.sendcarForm.controls.livingAddress_district.value;
    const postalCodeValue = this.sendcarForm.controls.livingAddress_postalCode.value;
    const provinceValue = this.sendcarForm.controls.livingAddress_provinceName.value;
    const url = `https://www.google.co.th/maps/search/${addressValue}+${subdistrictValue}+${districtValue}+${provinceValue}+${postalCodeValue}`
    window.open(url, "_blank");
  }

  receiveEmitChildClickBtn($event: IMartaPaymentInsurance) {

    // === get return MRTA value from child (mrta-product.component.ts) ===
    let mrtadataincludeapp = $event
    mrtadataincludeapp.application_num = this.quotationresultData.data[0].application_num
    mrtadataincludeapp.first_name = this.quotationresultData.data[0].first_name
    mrtadataincludeapp.last_name = this.quotationresultData.data[0].last_name
    mrtadataincludeapp.phone_number = this.quotationresultData.data[0].phone_number
    mrtadataincludeapp.contract_no = this.quotationresultData.data[0].contract_no


    // === save qr mrta gen ===

    this._ireqsaveqrmrta.age = $event.age
    this._ireqsaveqrmrta.application_num = this.quotationresultData.data[0].application_num
    this._ireqsaveqrmrta.gender = $event.gender
    this._ireqsaveqrmrta.insurance_code = $event.insurance_code
    this._ireqsaveqrmrta.insurance_seller = $event.insurance_seller
    this._ireqsaveqrmrta.insurance_year = $event.insurance_year
    this._ireqsaveqrmrta.insurer_code = $event.insurer_code
    this._ireqsaveqrmrta.out_stand = $event.out_stand
    this._ireqsaveqrmrta.premium_mrta = $event.premium_insur
    this._ireqsaveqrmrta.quotationid = this.quotationresultData.data[0].quo_key_app_id
    this._ireqsaveqrmrta.phone_number = this.quotationresultData.data[0].phone_number

    this.quotationService.saveqrpayment(this._ireqsaveqrmrta).subscribe((results) => {
      if (results.status == 200) {
        this.MRTAdata = mrtadataincludeapp
      }
    })

  }

  receiveEmitChildShowQR($event: IMartaPaymentInsurance) {
    // === get return MRTA value from child (mrta-product.component.ts) ===
    let mrtadataincludeapp = $event
    mrtadataincludeapp.application_num = this.quotationresultData.data[0].application_num
    mrtadataincludeapp.first_name = this.quotationresultData.data[0].first_name
    mrtadataincludeapp.last_name = this.quotationresultData.data[0].last_name
    mrtadataincludeapp.phone_number = this.quotationresultData.data[0].phone_number
    mrtadataincludeapp.contract_no = this.quotationresultData.data[0].contract_no

    // === save qr mrta gen ===
    this._ireqsaveqrmrta.pay_status = $event.pay_status
    this._ireqsaveqrmrta.age = $event.age
    this._ireqsaveqrmrta.application_num = this.quotationresultData.data[0].application_num
    this._ireqsaveqrmrta.gender = $event.gender
    this._ireqsaveqrmrta.insurance_code = $event.insurance_code
    this._ireqsaveqrmrta.insurance_seller = $event.insurance_seller
    this._ireqsaveqrmrta.insurance_year = $event.insurance_year
    this._ireqsaveqrmrta.insurer_code = $event.insurer_code
    this._ireqsaveqrmrta.out_stand = $event.out_stand
    this._ireqsaveqrmrta.premium_mrta = $event.premium_insur
    this._ireqsaveqrmrta.quotationid = this.quotationresultData.data[0].quo_key_app_id
    this._ireqsaveqrmrta.phone_number = this.quotationresultData.data[0].phone_number


    this.MRTAdata = mrtadataincludeapp

  }

  checkqrgenfinish($event: boolean) {

    if ($event) {
      // === go to page gen qr ===
      this.lockqrpage = false
      this.qrTabIndex = 1;
    } else {
      // === do nothing ===
    }
  }

  updatepaymentStatus($event: boolean) {
    if ($event) {
      this.pay_status = 1
    }
  }

}
