import { ChangeDetectorRef, Component, ErrorHandler, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BehaviorSubject, lastValueFrom, map, Observable, of } from 'rxjs';
import { BreakpointObserver } from '@angular/cdk/layout';
import { StepperOrientation, StepperSelectionEvent, STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { CizCardTabComponent } from '../quotation-tab/ciz-card-tab/ciz-card-tab.component';
import { LoadingService } from 'src/app/service/loading.service';
import { MasterDataService } from 'src/app/service/master.service';
import { DipchipService } from 'src/app/service/dipchip.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, ParamMap, Params, Router } from '@angular/router';
import { QuotationService } from 'src/app/service/quotation.service';
import { IResQuotationDetail } from 'src/app/interface/i-res-quotation-detail';
import { IReqFlagDipchip } from 'src/app/interface/i-req-flag-dipchip';
import { BaseService } from 'src/app/service/base/base.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MainDialogComponent } from 'src/app/widget/dialog/main-dialog/main-dialog.component';
import { ProductDetailTabComponent } from '../quotation-tab/product-detail-tab/product-detail-tab.component';
import { MatStepper } from '@angular/material/stepper';
import { OtpEconsentComponent } from 'src/app/widget/dialog/otp-econsent/otp-econsent.component';
import { OtpVerifyDialogComponent } from 'src/app/widget/dialog/otp-verify-dialog/otp-verify-dialog.component';
import { IResBasic } from 'src/app/interface/i-res-basic';
import { IResPhoneUpdate } from 'src/app/interface/i-res-phone-update';
import { IDialogPhoneValidClose } from 'src/app/interface/i-dialog-phone-valid-close';
import { IDialogEconsentOtpOpen } from 'src/app/interface/i-dialog-econsent-otp-open';
import { IReqCreateCredit } from 'src/app/interface/i-req-create-credit';
import { IDialogEconsentValidClose } from 'src/app/interface/i-dialog-econsent-valid-close';
import { CareerAndPurposeComponent } from '../quotation-tab/career-and-purpose/career-and-purpose.component';
import { environment } from 'src/environments/environment';
import { FaceValidDialogComponent } from 'src/app/widget/dialog/face-valid-dialog/face-valid-dialog.component';
import { IDialogFaceValidClose } from 'src/app/interface/i-dialog-face-valid-close';
import { ScrollStrategyOptions } from '@angular/cdk/overlay';
import { ImageAttachComponent } from '../quotation-tab/image-attach/image-attach.component';
import { DomSanitizer } from '@angular/platform-browser';
import { ConsentTabComponent } from '../quotation-tab/signature-tab/consent-tab.component';
import { SendCarTabComponent } from '../quotation-tab/send-car-tab/send-car-tab.component';
import { ImageService } from 'src/app/service/image.service';

@Component({
  selector: 'app-quotation-detail',
  templateUrl: './quotation-detail.component.html',
  styleUrls: ['./quotation-detail.component.scss'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false },
    },
  ],
})
export class QuotationDetailComponent extends BaseService implements OnInit {


  @ViewChild('stepper') stepper!: MatStepper
  // === lay out ===
  // ** stepper **
  stepperOrientation: Observable<StepperOrientation>;
  isLinear: boolean = false;

  quoForm: FormGroup;
  quotationkeyid: string;
  queryParams: ParamMap;
  quotationResult$: BehaviorSubject<IResQuotationDetail> = new BehaviorSubject<IResQuotationDetail>({} as IResQuotationDetail)
  quoid: string = ''
  visiblePhoneValid: boolean = true
  disablePhoneValidbtn: boolean = true
  verifyeconsent: boolean = false
  verifyimageattach: boolean = false
  verifycareerandpurpose: boolean = false
  verifysignature: boolean = false
  createorupdatecitizendataDisable: boolean = true
  createorupdatecreditbtnDisable: boolean = true
  createorupdatecareerandPurposebtnDisable: boolean = true
  econsentbtnDisable: boolean = true // === use with buttn econsent btn disable (step 2)
  sendcarActive$ = new BehaviorSubject<boolean>(true);

  lockallbtn: boolean = false

  canclequest: boolean = false // === case cancle (quo_status = "3") ====



  // === variable from citizenpage (age, gender) (22/09/2022) ===
  cusage: number = 0;
  gender: number = 0;


  @Output() age_send = new EventEmitter<number>();
  @Output() gender_send = new EventEmitter<number>();



  @ViewChild(CizCardTabComponent) cizcardtab: CizCardTabComponent = new CizCardTabComponent(
    this.fb,
    this.cd,
    this.router,
    this.actRoute,
    this.quotationService,
    this.loadingService,
    this.masterDataService,
    this.dipchipService,
    this.dialog,
    this._snackBar
  )

  @ViewChild(ProductDetailTabComponent) productdetailtab: ProductDetailTabComponent = new ProductDetailTabComponent(
    this.fb,
    this.cd,
    this.masterDataService,
    this.loadingService,
    this.dialog,
    this._snackBar,
    this.breakpointObserver
  )

  @ViewChild(CareerAndPurposeComponent) careerandpurposetab: CareerAndPurposeComponent = new CareerAndPurposeComponent(
    this.fb,
    this.masterDataService,
    this.loadingService,
    this.dialog,
    this._snackBar,
    this.breakpointObserver
  )

  @ViewChild(ImageAttachComponent) imageattachtab: ImageAttachComponent = new ImageAttachComponent(
    this.fb,
    this.masterDataService,
    this.quotationService,
    this.loadingService,
    this.dialog,
    this._snackBar,
    this.breakpointObserver,
    this.sanitizer
  )

  @ViewChild(ConsentTabComponent) consenttab: ConsentTabComponent = new ConsentTabComponent(
    this.router,
    this.cd,
    this.fb,
    this.loadingService,
    this.dialog,
    this._snackBar,
    this.breakpointObserver
  )


  @ViewChild(SendCarTabComponent) sendcartab: SendCarTabComponent = new SendCarTabComponent(
    this.fb,
    this.cd,
    this.router,
    this.cd,
    this.quotationService,
    this.masterDataService,
    this.imageService,
    this.loadingService,
    this.dialog,
    this._snackBar,
    this.breakpointObserver
  )




  constructor(
    private fb: FormBuilder,
    private cd: ChangeDetectorRef,
    private router: Router,
    private breakpointObserver: BreakpointObserver,
    private loadingService: LoadingService,
    private masterDataService: MasterDataService,
    private imageService: ImageService,
    private dipchipService: DipchipService,
    private actRoute: ActivatedRoute,
    private sanitizer: DomSanitizer,
    public quotationService: QuotationService,
    public override dialog: MatDialog,
    private readonly sso: ScrollStrategyOptions,
    public override _snackBar: MatSnackBar,
  ) {
    super(dialog, _snackBar)

    this.quoForm = this.fb.group({
      cizform: this.cizcardtab.cizForm,
      productForm: this.productdetailtab.productForm
    })

    this.stepperOrientation = this.breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));

    this.queryParams = this.actRoute.snapshot.queryParamMap;
    this.quotationkeyid = this.queryParams.get('id') ?? '';


    this.actRoute.queryParams.subscribe(params => {
      this.quoid = params['id']
    });

    // ***** form on viewchild sucscribe at ngAfterViewInit() fn ******

  }


  ngOnInit(): void {

    this.afteroninit()

    this.quotationResult$.subscribe((res) => {
      console.log(`can trigger this`)
      if (res.data) {
        if (res.data.length !== 0) {
          const quoitem = res.data[0]

          // === quo_status ===
          // *** set parent variable for use when quo_status is 1 here ***
          if (quoitem.quo_status == 1) {
            this.lockallbtn = true
          }

          // *** tab 2 ***
          if (quoitem.otp_consent_verify == 'Y' || quoitem.otp_consent_verify == 'N') {
            // === may be check 'N' too === 
            this.verifyeconsent = true
          }

          if (quoitem.cd_app_key_id !== '' && quoitem.cd_app_key_id !== null) {
            this.econsentbtnDisable = false
          }

          if (quoitem.quo_status == 3) {
            this.canclequest = true
          }

          if (quoitem.quo_key_app_id && quoitem.ciz_phone_valid_status !== 'Y' && this.cizcardtab.cizForm.controls.generalinfoForm.controls.phoneNumber.valid) {
            this.disablePhoneValidbtn = false
          } else {
            this.disablePhoneValidbtn = true
          }

          // *** tab 3 *** (career and purpose) 
          if (quoitem.cr_app_key_id !== '' && quoitem.cr_app_key_id !== null && quoitem.pp_app_key_id !== '' && quoitem.pp_app_key_id !== null) {
            this.careerandpurposetab.careerandpurposeForm.controls.verifyCareerandpurpose.setValue(true)
            this.verifycareerandpurpose = true
          }

          // *** tab 4 *** (image attach) 
          if (quoitem.otp_consent_verify == 'Y' || quoitem.quo_image_attach_verify) {
            this.imageattachtab.verifyImageAttach.setValue(true)
            this.verifyimageattach = true
          }

          // *** tab 5 **** (signature)
          if (quoitem.cs_app_key_id !== '' && quoitem.cs_app_key_id !== null) {
            // === set valid when record signature is already exits === 
            this.consenttab.signaturetab.signatureForm.controls.verifySignature.setValue(true)
            this.verifysignature = true
          }

          if (quoitem.quo_dopa_status == 'N') {
            if (!this.verifyimageattach) {
              this.imageattachtab.txtrequireimage = `*แนบไฟล์ "บัตรประชาชน" , "รูปหน้าลูกค้าพร้อมบัตรประชาชน" , "สำเนาบัตรประชาชนพร้อมลายเซ็นรับรองถูกต้อง"  และ "NCB Consent`
            }
          }

        }
      }
    })
  }


  // === subscribe on viewchild === 
  // *** etc subscribe form ****
  ngAfterViewInit() {

    this.stepper.selectedIndex = 0;

    this.cizcardtab.cizForm.valueChanges.subscribe((res) => {

      //  ==== เงื่อนไขแสดงปุ่มบันทึกใน tab 1 (ข้อมูลบัตรประชาชน) ===
      if (
        this.cizcardtab.cizForm.controls.generalinfoForm.valid &&
        this.cizcardtab.cizForm.controls.livingAddress.valid &&
        this.cizcardtab.cizForm.controls.contactAddress.valid &&
        this.cizcardtab.cizForm.controls.houseRegisAddress.valid &&
        this.cizcardtab.cizForm.controls.workAddress.valid
      ) {
        this.createorupdatecitizendataDisable = false
      } else {
        this.createorupdatecitizendataDisable = true
      }

    })


    this.productdetailtab.detailForm.valueChanges.subscribe(value => {

      //  ==== เงื่อนไขแสดงปุ่มบันทึกใน tab 2 (ข้อมูลผลืตภัณฑ์/วงเงินสินเชื่อ)

      if (this.productdetailtab.productForm.controls.detailForm.valid) {
        // this.econsentbtnDisable = false
        this.createorupdatecreditbtnDisable = false
        this.cd.detectChanges()
      } else {
        this.createorupdatecreditbtnDisable = true
        this.cd.detectChanges()
      }

    })

    this.careerandpurposetab.careerandpurposeForm.valueChanges.subscribe((careerandpurpose) => {

      //  ==== เงื่อนไขแสดงปุ่มบันทึกใน tab 2 (ข้อมูลผลืตภัณฑ์/วงเงินสินเชื่อ)
      if (this.careerandpurposetab.careerandpurposeForm.controls.careerForm.valid && this.careerandpurposetab.careerandpurposeForm.controls.purposeForm.valid) {
        this.createorupdatecareerandPurposebtnDisable = false
        this.cd.detectChanges()
      } else {
        this.createorupdatecareerandPurposebtnDisable = true
        this.cd.detectChanges()
      }
    })

  }

  async afteroninit() {
    // == clear dopa status ==
    this.loadingService.showLoader()
    this.quotationService.cleardopastatus()
    if (this.quoid) {
      // === set Observable quotation (quotationResult$) ===
      this.quotationResult$.next(await lastValueFrom(this.quotationService.getquotationbyid(this.quoid)))
      if (this.quotationResult$.value.data.length !== 0) {

        this.loadingService.hideLoader()
        this.quotationService.setstatusdopa(this.quotationResult$.value.data[0].quo_key_app_id)
        this.manageStatgequotation(this.quotationResult$.value)

        // === show tab 6 (send car) ===

        if (this.quotationResult$.value.data[0].loan_result !== 'Y') {
          this.sendcarActive$.next(false)
        }
      } else {

        this.loadingService.hideLoader()
        this.dialog.open(MainDialogComponent, {
          panelClass: 'custom-dialog-container',
          data: {
            header: 'ไม่พบข้อมูลใบคำขอ',
            message: `ไม่พบใบคำขอนี้`,
            button_name: 'ปิด'
          }
        }).afterClosed().subscribe(result => {
          // === redirect to home page === 
          this.router.navigate(['/quotation-view']);
        });

      }
    } else {
      /// === disable field if quoid is null === 
      // this.cizcardtab.cizForm.controls.maincitizenForm.disable()
    }

  }


  manageStatgequotation(quotationresult: IResQuotationDetail) {

    // === unlock tab when data verify === 

    const quodata = quotationresult.data[0]
    console.log(`set flag verify : ${quodata.otp_consent_verify}`)
    if (quodata.otp_consent_verify == 'Y') {
      this.productdetailtab.productForm.controls.consentVerify.setValue(true)
    }
  }



  async changeStage($event: StepperSelectionEvent) {

    const stage = $event.selectedIndex
    const previousStage = $event.previouslySelectedIndex

    if (this.quotationResult$.value.data) {
      const quo_status = this.quotationResult$.value.data[0].quo_status

      switch (stage) {
        case 0:
          // *** Citizencard ***
          break;
        case 1: {
          // *** Product deatail ***
          // this.cizcardtab.cizForm.valid ? this.productdetailtab.onStageChageFormStepper() : this.openDialogStep(`ไม่อนุญาติ`, `คุณยังไม่สามาถทำรายการในขั้นตอนนี้ได้`, `ปิด`, previousStage)
          if (this.cizcardtab.cizForm.valid) {
            if (previousStage == 0) {
              if (quo_status == 1) {
                this.productdetailtab.onStageChageFormStepper()
              } else {
                if (this.userSessionQuotation.RADMIN !== 'Y') {
                  const savecitizensuccess = await this.manualsaveonchangestep()
                  if (savecitizensuccess) {
                    this.productdetailtab.onStageChageFormStepper()
                  } else {
                    this.openDialogStep(`บันทึกข้อมูลไม่สำเร็จ`, `ไม่สามารถบันทึกข้อมูลในหน้า 'ข้อมูลบัตรประชาชนได้'`, `ปิด`, previousStage)
                  }
                } else {
                  this.productdetailtab.onStageChageFormStepper()
                }
              }
            } else {
              this.productdetailtab.onStageChageFormStepper()
            }
          } else {
            this.openDialogStep(`ไม่อนุญาติ`, `คุณยังไม่สามาถทำรายการในขั้นตอนนี้ได้`, `ปิด`, previousStage)
          }

        }
          break;
        case 2: {
          // *** career and purpose ***
          if (this.cizcardtab.cizForm.valid) {
            this.verifyeconsent ? this.careerandpurposetab.onStageChageFormStepper() : this.openDialogStep(`ไม่อนุญาติ`, `คุณยังไม่สามาถทำรายการในขั้นตอนนี้ได้`, `ปิด`, previousStage);
          } else {
            this.openDialogStep(`ไม่อนุญาติ`, `คุณยังไม่สามาถทำรายการในขั้นตอนนี้ได้`, `ปิด`, previousStage)
          }
        }
          break;

        case 3: {
          // *** attach image file ***
          // this.imageattachtab.onStageChageFormStepper()
          if (this.cizcardtab.cizForm.valid) {
            (this.verifyeconsent && this.verifycareerandpurpose) ? this.imageattachtab.onStageChageFormStepper() : this.openDialogStep(`ไม่อนุญาติ`, `คุณยังไม่สามาถทำรายการในขั้นตอนนี้ได้`, `ปิด`, previousStage);
          } else {
            this.openDialogStep(`ไม่อนุญาติ`, `คุณยังไม่สามาถทำรายการในขั้นตอนนี้ได้`, `ปิด`, previousStage)
          }
        }
          break;
        case 4: {
          // *** consent tab ***
          if (this.cizcardtab.cizForm.valid) {
            (this.verifyeconsent && this.verifycareerandpurpose && this.verifyimageattach) ? this.imageattachtab.onStageChageFormStepper() : this.openDialogStep(`ไม่อนุญาติ`, `คุณยังไม่สามาถทำรายการในขั้นตอนนี้ได้`, `ปิด`, previousStage);
          } else {
            this.openDialogStep(`ไม่อนุญาติ`, `คุณยังไม่สามาถทำรายการในขั้นตอนนี้ได้`, `ปิด`, previousStage)
          }
        }
          break;
        case 5: {
          // *** send car tab ***
          this.sendcartab.onStageChageFormStepper()
        }
          break;
        default:
          break;
      }
    } else {
      if (stage == 0) {

      } else {
        this.openDialogStep(`ไม่อนุญาติ`, `คุณยังไม่สามาถทำรายการในขั้นตอนนี้ได้`, `ปิด`, previousStage)
      }
    }

  }

  recieve_dipchipData($event: IReqFlagDipchip) {
    // === กดปุ่ม Dipchip ===
    if ($event.status) {

      this.createquotationdopa('1', $event.uuid).then((dchk) => {
        if (dchk.status) {
          this.dipchipService.updatedipchipflag({
            token: '',
            username: this.usernamefordipchip,
            fromBody: $event.uuid
          }).subscribe(async (value) => {
            this.loadingService.hideLoader()
            console.log(`flag success : ${JSON.stringify(value)}`)

            // === set router id ===
            if (value.number == 200) {
              this.snackbarsuccess(`บันทึกฉบับร่างสำเร็จ`);

              // ==== ปลดล๊อค form เมื่อ dipchip สำเร็จ ====
              this.cizcardtab.cizForm.enable()

              const queryParams: Params = { id: dchk.refId };

              await this.router.navigate(
                [],
                {
                  relativeTo: this.actRoute,
                  queryParams: queryParams,
                  queryParamsHandling: 'merge', // remove to replace all query params by provided
                }
              );
              // === add dopa status (11/11/2022) === 

              this.quotationService.setstatusdopa(dchk.refId)

              this.afteroninit();
            }
          })
        } else {
          // === handle error when STATUS_CODE dipchip is '500' or null ====
          this.dipchipService.updatedipchipflag({
            token: '',
            username: this.usernamefordipchip,
            fromBody: $event.uuid
          }).subscribe(async (value) => {
            this.loadingService.hideLoader()
            console.log(`flag success : ${JSON.stringify(value)}`)

            // === set router id ===
            if (value.number == 200) {
              this.snackbarsuccess(`บันทึกฉบับร่างสำเร็จ`);

              // === status false (STATUS_CODE from dopa is null or 500 ) ===
              this.snackbarfail(`ไม่พบข้อมูล DIPCHIP : ${dchk.message}`)
              this.cizcardtab.showdipchipbtn = false
              this.cizcardtab.cizForm.enable()
              // this.cizcardtab.cizCardImage_string = ''
              // this.cizcardtab.cizCardImage = `${environment.citizen_card_img_preload}`
              // this.cizcardtab.cizForm.reset()
              const returnCreateNoneconsent = await this.createquotationdopanoneconsent($event.uuid)
              if (returnCreateNoneconsent.status) {
                // ==== ปลดล๊อค form เมื่อ dipchip สำเร็จ ====
                this.cizcardtab.cizForm.enable()

                const queryParams: Params = { id: returnCreateNoneconsent.refId };

                await this.router.navigate(
                  [],
                  {
                    relativeTo: this.actRoute,
                    queryParams: queryParams,
                    queryParamsHandling: 'merge', // remove to replace all query params by provided
                  }
                );
                // === add dopa status (11/11/2022) === 

                this.quotationService.setstatusdopa(dchk.refId)

                this.afteroninit();
              } else {
                this.snackbarfail('สร้างรายการ quotation ไม่สำเร็จ (non-econsent)')
              }
            }
          })
        }
      })
    }
  }

  recieve_phonenumber() {
    if (this.quotationResult$.value && this.quotationResult$.value.data) {
      const quoitem = this.quotationResult$.value.data[0]
      if (quoitem.quo_key_app_id && quoitem.ciz_phone_valid_status !== 'Y' && this.cizcardtab.cizForm.controls.generalinfoForm.controls.phoneNumber.valid) {
        this.disablePhoneValidbtn = false
      } else {
        this.disablePhoneValidbtn = true
      }
    }
  }

  recieve_dialogfacevalid() {

    // === คลิกปุ่ม เปรียบเทียบใบหน้า ===

    if (!this.cizcardtab.cizForm.dirty) {
      if (this.quoid) {
        this.dialog.open(FaceValidDialogComponent, {
          width: `80%`,
          height: `90%`,
          data: {
            quotationid: `${this.quoid}`,
          }
        }).afterClosed().subscribe((resfacevaliddilaog: IDialogFaceValidClose) => {

          if (resfacevaliddilaog.settextstatus == true) {
            // this.cizcardtab.cizForm.controls.facevalid.setValue(true);
            this.cizcardtab.facevalidstatus = `✅ ได้รับการยืนยันใบหน้าบุคคลแล้ว`
            this.cizcardtab.cizForm.controls.facecompareValid.setValue(true);
            this.cizcardtab.cizForm.updateValueAndValidity();
          }
        })
      } else {
        this.snackbarfail(`ไม่พบเลข quotation id ที่จะทำรายการ`)
      }
    } else {
      this.snackbarfail(`มีการแก้ไขข้อมูลบนหน้ากรอกข้อมูล กรุณาบันทึกก่อน`)
    }
  }


  async createquotationdopa(type: string, dipchipuuid: string) {
    // == set default type ==
    // * 1: e-consent flow (verify dopa sucess)
    // * 2: offline (verify dopa fail)

    const ciz_form = this.cizcardtab.cizForm

    let quotationdata = {

      age: ciz_form.controls.maincitizenForm.controls.age.value ? ciz_form.controls.maincitizenForm.controls.age.value : '',
      titleCode: ciz_form.controls.maincitizenForm.controls.titleCode.value ? ciz_form.controls.maincitizenForm.controls.titleCode.value : '',
      titleName: ciz_form.controls.maincitizenForm.controls.titleName.value ? ciz_form.controls.maincitizenForm.controls.titleName.value : '',
      firstName: ciz_form.controls.maincitizenForm.controls.firstName.value ? ciz_form.controls.maincitizenForm.controls.firstName.value : '',
      lastName: ciz_form.controls.maincitizenForm.controls.lastName.value ? ciz_form.controls.maincitizenForm.controls.lastName.value : '',
      gender: ciz_form.controls.maincitizenForm.controls.gender.value ? ciz_form.controls.maincitizenForm.controls.gender.value : '',
      citizenId: ciz_form.controls.maincitizenForm.controls.citizenId.value ? ciz_form.controls.maincitizenForm.controls.citizenId.value : '',
      birthDate: ciz_form.controls.maincitizenForm.controls.birthDate.value ? ciz_form.controls.maincitizenForm.controls.birthDate.value : '',
      issueDate: ciz_form.controls.maincitizenForm.controls.issueDate.value ? ciz_form.controls.maincitizenForm.controls.issueDate.value : '',
      expireDate: ciz_form.controls.maincitizenForm.controls.expireDate.value ? ciz_form.controls.maincitizenForm.controls.expireDate.value : '',
      issuePlace: ciz_form.controls.maincitizenForm.controls.issuePlace.value ? ciz_form.controls.maincitizenForm.controls.issuePlace.value : '',

      address: ciz_form.controls.maincitizenForm.controls.address.value ? ciz_form.controls.maincitizenForm.controls.address.value : '',
      subDistrict: ciz_form.controls.maincitizenForm.controls.subDistrict.value ? ciz_form.controls.maincitizenForm.controls.subDistrict.value : '',
      district: ciz_form.controls.maincitizenForm.controls.district.value ? ciz_form.controls.maincitizenForm.controls.district.value : '',
      provinceName: ciz_form.controls.maincitizenForm.controls.provinceName.value ? ciz_form.controls.maincitizenForm.controls.provinceName.value : '',
      provinceCode: ciz_form.controls.maincitizenForm.controls.provinceCode.value ? ciz_form.controls.maincitizenForm.controls.provinceCode.value : '',
      postalCode: ciz_form.controls.maincitizenForm.controls.postalCode.value ? ciz_form.controls.maincitizenForm.controls.postalCode.value : '',
      cizcardImage: this.cizcardtab.cizCardImage_string ? this.cizcardtab.cizCardImage_string : '',
      dipchipuuid: dipchipuuid ? dipchipuuid : ''
    }

    const itemString = JSON.stringify(quotationdata)

    let fd = new FormData();
    fd.append('item', itemString)


    try {
      const resultCreateQEconsent = await lastValueFrom(this.quotationService.MPLS_dipchip(fd))

      return (resultCreateQEconsent.status == 200) ? { status: true, refId: resultCreateQEconsent.data[0].quo_key_app_id, message: '' } : { status: false, refId: '', message: resultCreateQEconsent.message }

    } catch (e: any) {
      console.log(`error create e-consent quotation : ${e.message}`)
      return { status: false, refid: '', message: '' }
    }

  }

  async createquotationdopanoneconsent(uuid: string) {

    // === *** API เส้นนี้จะถูกเรียกกรณี DIPCHIP แล้วมีข้อมูล DIPCHIP แต่ไม่มี record ของ DOPA หรือ สร้างข้อมูลในขั้นตอน MPLS_DIPCHIP ไม่สำเร็จ *** ===


    const ciz_form = this.cizcardtab.cizForm

    let quotationdata = {

      age: ciz_form.controls.maincitizenForm.controls.age.value ? ciz_form.controls.maincitizenForm.controls.age.value : '',
      titleCode: ciz_form.controls.maincitizenForm.controls.titleCode.value ? ciz_form.controls.maincitizenForm.controls.titleCode.value : '',
      titleName: ciz_form.controls.maincitizenForm.controls.titleName.value ? ciz_form.controls.maincitizenForm.controls.titleName.value : '',
      firstName: ciz_form.controls.maincitizenForm.controls.firstName.value ? ciz_form.controls.maincitizenForm.controls.firstName.value : '',
      lastName: ciz_form.controls.maincitizenForm.controls.lastName.value ? ciz_form.controls.maincitizenForm.controls.lastName.value : '',
      gender: ciz_form.controls.maincitizenForm.controls.gender.value ? ciz_form.controls.maincitizenForm.controls.gender.value : '',
      citizenId: ciz_form.controls.maincitizenForm.controls.citizenId.value ? ciz_form.controls.maincitizenForm.controls.citizenId.value : '',
      birthDate: ciz_form.controls.maincitizenForm.controls.birthDate.value ? ciz_form.controls.maincitizenForm.controls.birthDate.value : '',
      issueDate: ciz_form.controls.maincitizenForm.controls.issueDate.value ? ciz_form.controls.maincitizenForm.controls.issueDate.value : '',
      expireDate: ciz_form.controls.maincitizenForm.controls.expireDate.value ? ciz_form.controls.maincitizenForm.controls.expireDate.value : '',
      issuePlace: ciz_form.controls.maincitizenForm.controls.issuePlace.value ? ciz_form.controls.maincitizenForm.controls.issuePlace.value : '',

      address: ciz_form.controls.maincitizenForm.controls.address.value ? ciz_form.controls.maincitizenForm.controls.address.value : '',
      subDistrict: ciz_form.controls.maincitizenForm.controls.subDistrict.value ? ciz_form.controls.maincitizenForm.controls.subDistrict.value : '',
      district: ciz_form.controls.maincitizenForm.controls.district.value ? ciz_form.controls.maincitizenForm.controls.district.value : '',
      provinceName: ciz_form.controls.maincitizenForm.controls.provinceName.value ? ciz_form.controls.maincitizenForm.controls.provinceName.value : '',
      provinceCode: ciz_form.controls.maincitizenForm.controls.provinceCode.value ? ciz_form.controls.maincitizenForm.controls.provinceCode.value : '',
      postalCode: ciz_form.controls.maincitizenForm.controls.postalCode.value ? ciz_form.controls.maincitizenForm.controls.postalCode.value : '',
      dipchipuuid: uuid ? uuid : '',
      cizcardImage: this.cizcardtab.cizCardImage_string ? this.cizcardtab.cizCardImage_string : ''
    }

    const itemString = JSON.stringify(quotationdata)

    let fd = new FormData();
    fd.append('item', itemString)


    try {
      const resultCreateQEconsent = await lastValueFrom(this.quotationService.MPLS_dipchipnoneconsent(fd))

      return (resultCreateQEconsent.status == 200) ? { status: true, refId: resultCreateQEconsent.data[0].quo_key_app_id, message: '' } : { status: false, refId: '', message: resultCreateQEconsent.message }

    } catch (e: any) {
      console.log(`error create e-consent quotation : ${e.message}`)
      return { status: false, refid: '', message: '' }
    }
  }

  async onclickSavecitizendata() {

    // บันทึกค่าข้อมูลที่วไปเกี่ยวกับลูกค้า 
    // (MPLS_QUOTATION, MPSL_LIVING_PLACE, MPLS_HOUSE_REGIS_PLACE, MPLS_CONTACT_PLACE, MPLS_WORK_PLACE)

    this.loadingService.showLoader()
    const ciz_form = this.cizcardtab.cizForm
    const quoid = this.actRoute.snapshot.queryParamMap.get('id') ?? ''

    let quotationdata = {

      quotationid: quoid ? quoid : '',

      age: ciz_form.controls.maincitizenForm.controls.age.value ? ciz_form.controls.maincitizenForm.controls.age.value : '',
      titleCode: ciz_form.controls.maincitizenForm.controls.titleCode.value ? ciz_form.controls.maincitizenForm.controls.titleCode.value : '',
      titleName: ciz_form.controls.maincitizenForm.controls.titleCode.value ? this.mapTitleNameById(ciz_form.controls.maincitizenForm.controls.titleCode.value ?? '', this.cizcardtab.masterTitle.data) : '',
      firstName: ciz_form.controls.maincitizenForm.controls.firstName.value ? ciz_form.controls.maincitizenForm.controls.firstName.value : '',
      lastName: ciz_form.controls.maincitizenForm.controls.lastName.value ? ciz_form.controls.maincitizenForm.controls.lastName.value : '',
      gender: ciz_form.controls.maincitizenForm.controls.gender.value ? ciz_form.controls.maincitizenForm.controls.gender.value : '',
      citizenId: ciz_form.controls.maincitizenForm.controls.citizenId.value ? ciz_form.controls.maincitizenForm.controls.citizenId.value : '',
      birthDate: ciz_form.controls.maincitizenForm.controls.birthDate.value ? ciz_form.controls.maincitizenForm.controls.birthDate.value : '',
      issueDate: ciz_form.controls.maincitizenForm.controls.issueDate.value ? ciz_form.controls.maincitizenForm.controls.issueDate.value : '',
      expireDate: ciz_form.controls.maincitizenForm.controls.expireDate.value ? ciz_form.controls.maincitizenForm.controls.expireDate.value : '',
      issuePlace: ciz_form.controls.maincitizenForm.controls.issuePlace.value ? ciz_form.controls.maincitizenForm.controls.issuePlace.value : '',

      email: ciz_form.controls.generalinfoForm.controls.email.value ? ciz_form.controls.generalinfoForm.controls.email.value : '',
      phone_number: ciz_form.controls.generalinfoForm.controls.phoneNumber.value ? ciz_form.controls.generalinfoForm.controls.phoneNumber.value : '',
      nick_name: ciz_form.controls.generalinfoForm.controls.nickName.value ? ciz_form.controls.generalinfoForm.controls.nickName.value : '',
      maried_status: ciz_form.controls.generalinfoForm.controls.mariedStatus.value ? ciz_form.controls.generalinfoForm.controls.mariedStatus.value : '',
      house_type: ciz_form.controls.generalinfoForm.controls.houseType.value ? ciz_form.controls.generalinfoForm.controls.houseType.value : '',
      stayed_month: ciz_form.controls.generalinfoForm.controls.stayedMonth.value ? ciz_form.controls.generalinfoForm.controls.stayedMonth.value : 0,
      stayed_year: ciz_form.controls.generalinfoForm.controls.stayedYear.value ? ciz_form.controls.generalinfoForm.controls.stayedYear.value : 0,
      house_owner_type: ciz_form.controls.generalinfoForm.controls.houseOwnerType.value ? ciz_form.controls.generalinfoForm.controls.houseOwnerType.value : '',

      address: ciz_form.controls.maincitizenForm.controls.address.value ? ciz_form.controls.maincitizenForm.controls.address.value : '',
      subDistrict: ciz_form.controls.maincitizenForm.controls.subDistrict.value ? ciz_form.controls.maincitizenForm.controls.subDistrict.value : '',
      district: ciz_form.controls.maincitizenForm.controls.district.value ? ciz_form.controls.maincitizenForm.controls.district.value : '',
      provinceCode: ciz_form.controls.maincitizenForm.controls.provinceCode.value ? ciz_form.controls.maincitizenForm.controls.provinceCode.value : '',
      provinceName: ciz_form.controls.maincitizenForm.controls.provinceCode.value ? this.mapProvinceNameById(ciz_form.controls.maincitizenForm.controls.provinceCode.value ?? '', this.cizcardtab.masterProvince.data) : '',
      postalCode: ciz_form.controls.maincitizenForm.controls.postalCode.value ? ciz_form.controls.maincitizenForm.controls.postalCode.value : '',
      cizcardImage: this.cizcardtab.cizCardImage_string ? this.cizcardtab.cizCardImage_string : '',

      liv_address: ciz_form.controls.livingAddress.controls.address.value ? ciz_form.controls.livingAddress.controls.address.value : '',
      liv_sub_district: ciz_form.controls.livingAddress.controls.subDistrict.value ? ciz_form.controls.livingAddress.controls.subDistrict.value : '',
      liv_district: ciz_form.controls.livingAddress.controls.district.value ? ciz_form.controls.livingAddress.controls.district.value : '',
      liv_province_code: ciz_form.controls.livingAddress.controls.provinceCode.value ? ciz_form.controls.livingAddress.controls.provinceCode.value : '',
      liv_province_name: ciz_form.controls.livingAddress.controls.provinceName.value ? this.mapProvinceNameById(ciz_form.controls.livingAddress.controls.provinceCode.value ?? '', this.cizcardtab.masterProvince.data) : '',
      liv_postal_code: ciz_form.controls.livingAddress.controls.postalCode.value ? ciz_form.controls.livingAddress.controls.postalCode.value : '',
      liv_la: ciz_form.controls.livingAddress.controls.la.value ? ciz_form.controls.livingAddress.controls.la.value : '',
      liv_lon: ciz_form.controls.livingAddress.controls.lon.value ? ciz_form.controls.livingAddress.controls.lon.value : '',
      liv_lalon: ciz_form.controls.livingAddress.controls.lalon.value ? ciz_form.controls.livingAddress.controls.lalon.value : '',

      cont_address: ciz_form.controls.contactAddress.controls.address.value ? ciz_form.controls.contactAddress.controls.address.value : '',
      cont_sub_district: ciz_form.controls.contactAddress.controls.subDistrict.value ? ciz_form.controls.contactAddress.controls.subDistrict.value : '',
      cont_district: ciz_form.controls.contactAddress.controls.district.value ? ciz_form.controls.contactAddress.controls.district.value : '',
      cont_province_code: ciz_form.controls.contactAddress.controls.provinceCode.value ? ciz_form.controls.contactAddress.controls.provinceCode.value : '',
      cont_province_name: ciz_form.controls.contactAddress.controls.provinceName.value ? this.mapProvinceNameById(ciz_form.controls.contactAddress.controls.provinceCode.value ?? '', this.cizcardtab.masterProvince.data) : '',
      cont_postal_code: ciz_form.controls.contactAddress.controls.postalCode.value ? ciz_form.controls.contactAddress.controls.postalCode.value : '',

      hrp_address: ciz_form.controls.houseRegisAddress.controls.address.value ? ciz_form.controls.houseRegisAddress.controls.address.value : '',
      hrp_sub_district: ciz_form.controls.houseRegisAddress.controls.subDistrict.value ? ciz_form.controls.houseRegisAddress.controls.subDistrict.value : '',
      hrp_district: ciz_form.controls.houseRegisAddress.controls.district.value ? ciz_form.controls.houseRegisAddress.controls.district.value : '',
      hrp_province_code: ciz_form.controls.houseRegisAddress.controls.provinceCode.value ? ciz_form.controls.houseRegisAddress.controls.provinceCode.value : '',
      hrp_province_name: ciz_form.controls.houseRegisAddress.controls.provinceName.value ? this.mapProvinceNameById(ciz_form.controls.houseRegisAddress.controls.provinceCode.value ?? '', this.cizcardtab.masterProvince.data) : '',
      hrp_postal_code: ciz_form.controls.houseRegisAddress.controls.postalCode.value ? ciz_form.controls.houseRegisAddress.controls.postalCode.value : '',

      work_address: ciz_form.controls.workAddress.controls.address.value ? ciz_form.controls.workAddress.controls.address.value : '',
      work_sub_district: ciz_form.controls.workAddress.controls.subDistrict.value ? ciz_form.controls.workAddress.controls.subDistrict.value : '',
      work_district: ciz_form.controls.workAddress.controls.district.value ? ciz_form.controls.workAddress.controls.district.value : '',
      work_province_code: ciz_form.controls.workAddress.controls.provinceCode.value ? ciz_form.controls.workAddress.controls.provinceCode.value : '',
      work_province_name: ciz_form.controls.workAddress.controls.provinceName.value ? this.mapProvinceNameById(ciz_form.controls.workAddress.controls.provinceCode.value ?? '', this.cizcardtab.masterProvince.data) : '',
      work_postal_code: ciz_form.controls.workAddress.controls.postalCode.value ? ciz_form.controls.workAddress.controls.postalCode.value : '',

    }

    const itemString = JSON.stringify(quotationdata)

    let fd = new FormData();
    fd.append('item', itemString)


    try {
      const resultCreateQEconsent = await lastValueFrom(this.quotationService.MPLS_create_or_update_citizendata(fd))

      this.loadingService.hideLoader()

      if (resultCreateQEconsent.status == 200) {
        this.snackbarsuccess(`บันทึกฉบับร่างสำเร็จ`);

        const queryParams: Params = { id: resultCreateQEconsent.data.quotationid };

        await this.router.navigate(
          [],
          {
            relativeTo: this.actRoute,
            queryParams: queryParams,
            queryParamsHandling: 'merge', // remove to replace all query params by provided
          }
        )

        this.afteroninit();

      } else {
        // --- handle fail update citizen info data ---
      }

    } catch (e: any) {
      this.loadingService.hideLoader()
      console.log(`error create e-consent quotation : ${e.message}`)
    }

  }

  async manualsaveonchangestep() {

    // บันทึกค่าข้อมูลที่วไปเกี่ยวกับลูกค้า 
    // (MPLS_QUOTATION, MPSL_LIVING_PLACE, MPLS_HOUSE_REGIS_PLACE, MPLS_CONTACT_PLACE, MPLS_WORK_PLACE)

    this.loadingService.showLoader()
    const ciz_form = this.cizcardtab.cizForm
    const quoid = this.actRoute.snapshot.queryParamMap.get('id') ?? ''

    const provnameValue = ciz_form.controls.maincitizenForm.controls.provinceCode.value ? this.mapProvinceNameById(ciz_form.controls.maincitizenForm.controls.provinceCode.value ?? '', this.cizcardtab.masterProvince.data) : ''
    const liv_provnameValue = ciz_form.controls.livingAddress.controls.provinceCode.value ? this.mapProvinceNameById(ciz_form.controls.livingAddress.controls.provinceCode.value ?? '', this.cizcardtab.masterProvince.data) : ''
    const cont_provnameValue = ciz_form.controls.contactAddress.controls.provinceCode.value ? this.mapProvinceNameById(ciz_form.controls.contactAddress.controls.provinceCode.value ?? '', this.cizcardtab.masterProvince.data) : ''
    const hrp_provnameValue = ciz_form.controls.houseRegisAddress.controls.provinceCode.value ? this.mapProvinceNameById(ciz_form.controls.houseRegisAddress.controls.provinceCode.value ?? '', this.cizcardtab.masterProvince.data) : ''
    const work_provnameValue = ciz_form.controls.workAddress.controls.provinceCode.value ? this.mapProvinceNameById(ciz_form.controls.workAddress.controls.provinceCode.value ?? '', this.cizcardtab.masterProvince.data) : ''


    let quotationdata = {

      quotationid: quoid ? quoid : '',

      age: ciz_form.controls.maincitizenForm.controls.age.value ? ciz_form.controls.maincitizenForm.controls.age.value : '',
      titleCode: ciz_form.controls.maincitizenForm.controls.titleCode.value ? ciz_form.controls.maincitizenForm.controls.titleCode.value : '',
      titleName: ciz_form.controls.maincitizenForm.controls.titleCode.value ? this.mapTitleNameById(ciz_form.controls.maincitizenForm.controls.titleCode.value ?? '', this.cizcardtab.masterTitle.data) : '',
      firstName: ciz_form.controls.maincitizenForm.controls.firstName.value ? ciz_form.controls.maincitizenForm.controls.firstName.value : '',
      lastName: ciz_form.controls.maincitizenForm.controls.lastName.value ? ciz_form.controls.maincitizenForm.controls.lastName.value : '',
      gender: ciz_form.controls.maincitizenForm.controls.gender.value ? ciz_form.controls.maincitizenForm.controls.gender.value : '',
      citizenId: ciz_form.controls.maincitizenForm.controls.citizenId.value ? ciz_form.controls.maincitizenForm.controls.citizenId.value : '',
      birthDate: ciz_form.controls.maincitizenForm.controls.birthDate.value ? ciz_form.controls.maincitizenForm.controls.birthDate.value : '',
      issueDate: ciz_form.controls.maincitizenForm.controls.issueDate.value ? ciz_form.controls.maincitizenForm.controls.issueDate.value : '',
      expireDate: ciz_form.controls.maincitizenForm.controls.expireDate.value ? ciz_form.controls.maincitizenForm.controls.expireDate.value : '',
      issuePlace: ciz_form.controls.maincitizenForm.controls.issuePlace.value ? ciz_form.controls.maincitizenForm.controls.issuePlace.value : '',

      email: ciz_form.controls.generalinfoForm.controls.email.value ? ciz_form.controls.generalinfoForm.controls.email.value : '',
      phone_number: ciz_form.controls.generalinfoForm.controls.phoneNumber.value ? ciz_form.controls.generalinfoForm.controls.phoneNumber.value : '',
      nick_name: ciz_form.controls.generalinfoForm.controls.nickName.value ? ciz_form.controls.generalinfoForm.controls.nickName.value : '',
      maried_status: ciz_form.controls.generalinfoForm.controls.mariedStatus.value ? ciz_form.controls.generalinfoForm.controls.mariedStatus.value : '',
      house_type: ciz_form.controls.generalinfoForm.controls.houseType.value ? ciz_form.controls.generalinfoForm.controls.houseType.value : '',
      stayed_month: ciz_form.controls.generalinfoForm.controls.stayedMonth.value ? ciz_form.controls.generalinfoForm.controls.stayedMonth.value : 0,
      stayed_year: ciz_form.controls.generalinfoForm.controls.stayedYear.value ? ciz_form.controls.generalinfoForm.controls.stayedYear.value : 0,
      house_owner_type: ciz_form.controls.generalinfoForm.controls.houseOwnerType.value ? ciz_form.controls.generalinfoForm.controls.houseOwnerType.value : '',

      address: ciz_form.controls.maincitizenForm.controls.address.value ? ciz_form.controls.maincitizenForm.controls.address.value : '',
      subDistrict: ciz_form.controls.maincitizenForm.controls.subDistrict.value ? ciz_form.controls.maincitizenForm.controls.subDistrict.value : '',
      district: ciz_form.controls.maincitizenForm.controls.district.value ? ciz_form.controls.maincitizenForm.controls.district.value : '',
      provinceCode: ciz_form.controls.maincitizenForm.controls.provinceCode.value ? ciz_form.controls.maincitizenForm.controls.provinceCode.value : '',
      provinceName: provnameValue,
      postalCode: ciz_form.controls.maincitizenForm.controls.postalCode.value ? ciz_form.controls.maincitizenForm.controls.postalCode.value : '',

      liv_address: ciz_form.controls.livingAddress.controls.address.value ? ciz_form.controls.livingAddress.controls.address.value : '',
      liv_sub_district: ciz_form.controls.livingAddress.controls.subDistrict.value ? ciz_form.controls.livingAddress.controls.subDistrict.value : '',
      liv_district: ciz_form.controls.livingAddress.controls.district.value ? ciz_form.controls.livingAddress.controls.district.value : '',
      liv_province_code: ciz_form.controls.livingAddress.controls.provinceCode.value ? ciz_form.controls.livingAddress.controls.provinceCode.value : '',
      liv_province_name: liv_provnameValue,
      liv_postal_code: ciz_form.controls.livingAddress.controls.postalCode.value ? ciz_form.controls.livingAddress.controls.postalCode.value : '',
      liv_la: ciz_form.controls.livingAddress.controls.la.value ? ciz_form.controls.livingAddress.controls.la.value : '',
      liv_lon: ciz_form.controls.livingAddress.controls.lon.value ? ciz_form.controls.livingAddress.controls.lon.value : '',
      liv_lalon: ciz_form.controls.livingAddress.controls.lalon.value ? ciz_form.controls.livingAddress.controls.lalon.value : '',

      cont_address: ciz_form.controls.contactAddress.controls.address.value ? ciz_form.controls.contactAddress.controls.address.value : '',
      cont_sub_district: ciz_form.controls.contactAddress.controls.subDistrict.value ? ciz_form.controls.contactAddress.controls.subDistrict.value : '',
      cont_district: ciz_form.controls.contactAddress.controls.district.value ? ciz_form.controls.contactAddress.controls.district.value : '',
      cont_province_code: ciz_form.controls.contactAddress.controls.provinceCode.value ? ciz_form.controls.contactAddress.controls.provinceCode.value : '',
      cont_province_name: cont_provnameValue,
      cont_postal_code: ciz_form.controls.contactAddress.controls.postalCode.value ? ciz_form.controls.contactAddress.controls.postalCode.value : '',

      hrp_address: ciz_form.controls.houseRegisAddress.controls.address.value ? ciz_form.controls.houseRegisAddress.controls.address.value : '',
      hrp_sub_district: ciz_form.controls.houseRegisAddress.controls.subDistrict.value ? ciz_form.controls.houseRegisAddress.controls.subDistrict.value : '',
      hrp_district: ciz_form.controls.houseRegisAddress.controls.district.value ? ciz_form.controls.houseRegisAddress.controls.district.value : '',
      hrp_province_code: ciz_form.controls.houseRegisAddress.controls.provinceCode.value ? ciz_form.controls.houseRegisAddress.controls.provinceCode.value : '',
      hrp_province_name: hrp_provnameValue,
      hrp_postal_code: ciz_form.controls.houseRegisAddress.controls.postalCode.value ? ciz_form.controls.houseRegisAddress.controls.postalCode.value : '',

      work_address: ciz_form.controls.workAddress.controls.address.value ? ciz_form.controls.workAddress.controls.address.value : '',
      work_sub_district: ciz_form.controls.workAddress.controls.subDistrict.value ? ciz_form.controls.workAddress.controls.subDistrict.value : '',
      work_district: ciz_form.controls.workAddress.controls.district.value ? ciz_form.controls.workAddress.controls.district.value : '',
      work_province_code: ciz_form.controls.workAddress.controls.provinceCode.value ? ciz_form.controls.workAddress.controls.provinceCode.value : '',
      work_province_name: work_provnameValue,
      work_postal_code: ciz_form.controls.workAddress.controls.postalCode.value ? ciz_form.controls.workAddress.controls.postalCode.value : '',

    }

    const itemString = JSON.stringify(quotationdata)

    let fd = new FormData();
    fd.append('item', itemString)


    try {
      const resultCreateQEconsent = await lastValueFrom(this.quotationService.MPLS_create_or_update_citizendata(fd))

      this.loadingService.hideLoader()

      if (resultCreateQEconsent.status == 200) {
        this.snackbarsuccess(`บันทึกข้อมูลหน้า 'ข้อมูลบัตรประชาชน' สำเร็จ`);

        return true

      } else {
        // --- handle fail update citizen info data ---
        return false
      }

    } catch (e: any) {
      this.loadingService.hideLoader
      console.log(`error create e-consent quotation : ${e.message}`)
      return false
    }

  }

  async onClickBtnVerifyPhone() {

    // เช็ค field OTP_PHONE_VERIFY ถ้าเป็น 'Y' ไม่ให้แสดงปุุ่มและปลดล๊อคหน้า product 
    // == กรณี OTP_PHONE_VERIFY ไม่มีค่า (ไม่ได้เป็นค่า 'Y')
    // เช็ค field QUO_OTP_PHONE ถ้าเป็น 'C' แสดงว่ามีการขอ OTP ไปแล้ว (ไปใช้ OTP_PHONE_VERIFY แทน)

    // ==== กรณี field phone_number บนหน้า form มีการแก้ไข ให้ save record ก่อนค่อยเปิดหน้าออก OTP (open dialog OtpVerifyDialogComponent)

    if (!this.cizcardtab.cizForm.dirty) {
      if (this.quoid) {
        const isDirty = this.cizcardtab.cizForm.controls.generalinfoForm.controls.phoneNumber.dirty
        const quoid = this.actRoute.snapshot.queryParamMap.get('id') ?? ''


        let updatePhoneresult = {} as IResPhoneUpdate

        if (isDirty) {
          updatePhoneresult = await lastValueFrom(this.quotationService.MPLS_update_phone_number(
            {
              quotationid: quoid,
              phone_number: this.cizcardtab.cizForm.controls.generalinfoForm.controls.phoneNumber.value ?? ''
            }
          ))
        }

        if (updatePhoneresult.status == true || !isDirty) {
          this.dialog.open(OtpVerifyDialogComponent, {
            disableClose: true,
            panelClass: 'custom-dialog-header',
            width: `80%`,
            height: `90%`,
            data: {
              header: `หน้ายืนยันเบอร์โทรศัพท์`,
              message: `ของคุณ ...`,
              quotationid: this.quotationResult$.value.data[0].quo_key_app_id,
              phone_number: this.cizcardtab.cizForm.controls.generalinfoForm.controls.phoneNumber.value,
              refid: `${this.quotationResult$.value.data[0].quo_app_ref_no}`,
              button_name: `ปิด`
            }
          }).afterClosed().subscribe((resdialog: IDialogPhoneValidClose) => {


            // === check if phone number change ===
            const currentPhonenumber = this.cizcardtab.cizForm.controls.generalinfoForm.controls.phoneNumber.value
            const newphonenumber = resdialog.phone_number
            const validstatus = resdialog.otp_status

            if (validstatus) {
              this.cizcardtab.cizForm.controls.phonevalid.setValue(true)
              this.cizcardtab.phonevalidstatus = `✅ : ได้รับการยืนยันเบอร์โทรศัพท์แล้ว`
              this.visiblePhoneValid = false
              this.cizcardtab.cizForm.controls.generalinfoForm.controls.phoneNumber.disable()
            }

            if (currentPhonenumber !== newphonenumber) {

              if (newphonenumber) {
                this.quotationService.MPLS_update_phone_number({
                  quotationid: quoid,
                  phone_number: newphonenumber
                }).subscribe((res) => {

                  if (res.status) {

                    this._snackBar.open('อัพเดทเบอร์โทรศัพท์สำเร็จ', '', {
                      horizontalPosition: 'end',
                      verticalPosition: 'bottom',
                      duration: 3000,
                      panelClass: 'custom-snackbar-container'
                    })

                    this.cizcardtab.cizForm.controls.generalinfoForm.controls.phoneNumber.setValue(newphonenumber)

                    // === update quotationResult$ === 
                    this.quotationService.getquotationbyid(quoid).subscribe((result) => {
                      this.quotationResult$.next(result)
                    })

                  } else {

                  }
                })
              }

            }
          })

        } else {
          // === update phone number fail === 
          this.openMaindialog('ผิดพลาด', 'ไม่สามารถระบุรายการอัพเดทเบอร์โทรศัพท์ได้', 'OK')
        }
      } else {
        this.snackbarfail(`ไม่พบเลข quotation id ที่จะทำรายการ`)
      }
    } else {
      this.snackbarfail(`มีการแก้ไขข้อมูลบนหน้ากรอกข้อมูล กรุณาบันทึกก่อน`)
    }

  }

  async onclickCreateCreditBtn() {
    // *** create or save credit ***

    const reqcreatecreditdata: IReqCreateCredit = {
      quotationid: this.quoid,
      dealer_code: this.productdetailtab.productForm.controls.detailForm.controls.dealerCode.value ?? '',
      brand_code: this.productdetailtab.productForm.controls.detailForm.controls.carBrandField.value ?? '',
      brand_name: this.productdetailtab.productForm.controls.detailForm.controls.carBrandNameField.value ?? '',
      model_code: this.productdetailtab.productForm.controls.detailForm.controls.carModelField.value ?? '',
      model_name: this.productdetailtab.productForm.controls.detailForm.controls.carModelNameField.value ?? '',
      color_name: this.productdetailtab.productForm.controls.detailForm.controls.carColorField.value ?? '',
      loan_amount: this.productdetailtab.productForm.controls.detailForm.controls.loanAmountField.value ?? null,
      product_value: this.productdetailtab.productForm.controls.detailForm.controls.productValueField.value ?? null,
      interest_rate: this.productdetailtab.productForm.controls.detailForm.controls.interestRateField.value,
      payment_value: this.productdetailtab.productForm.controls.detailForm.controls.paymentValueField.value,
      payment_round_count: this.productdetailtab.productForm.controls.detailForm.controls.paymentRoundCountValueField.value ?? null,
      insurance_name: this.productdetailtab.productForm.controls.detailForm.controls.insuranceNameField.value ?? '',
      insurance_code: this.productdetailtab.productForm.controls.detailForm.controls.insuranceCodeField.value ?? '',
      insurance_year: this.productdetailtab.productForm.controls.detailForm.controls.insuranceYearField.value,
      insurance_plan_price: this.productdetailtab.productForm.controls.detailForm.controls.insurancePlanPriceField.value,
      is_include_loanamount: this.productdetailtab.productForm.controls.detailForm.controls.isincludeloanamount.value == true ? 1 : 0,
      factory_price: this.productdetailtab.productForm.controls.detailForm.controls.factoryPriceValueField.value,
      size_model: this.productdetailtab.productForm.controls.detailForm.controls.sizeModelField.value,
      insurer_code: this.productdetailtab.productForm.controls.detailForm.controls.insurerCodeField.value ?? '',
      insurer_name: this.productdetailtab.productForm.controls.detailForm.controls.insurerNameField.value ?? '',
      coverage_total_loss: this.productdetailtab.coverage ? this.productdetailtab.coverage : null, // ทุนประกัน
      max_ltv: this.productdetailtab.productForm.controls.detailForm.controls.maxltvField.value ? this.productdetailtab.productForm.controls.detailForm.controls.maxltvField.value : null, // Max LTV
      price_include_vat: this.productdetailtab.productForm.controls.detailForm.controls.priceincludevatField.value ? this.productdetailtab.productForm.controls.detailForm.controls.priceincludevatField.value : 0,
      engine_number: this.productdetailtab.productForm.controls.detailForm.controls.engineNoField.value ? this.productdetailtab.productForm.controls.detailForm.controls.engineNoField.value : null,
      chassis_number: this.productdetailtab.productForm.controls.detailForm.controls.chassisNoField.value ? this.productdetailtab.productForm.controls.detailForm.controls.chassisNoField.value : null,
      engine_no_running: this.productdetailtab.productForm.controls.detailForm.controls.runningengineNoField.value ? this.productdetailtab.productForm.controls.detailForm.controls.runningengineNoField.value : null,
      chassis_no_running: this.productdetailtab.productForm.controls.detailForm.controls.runningchassisNoField.value ? this.productdetailtab.productForm.controls.detailForm.controls.runningchassisNoField.value : null,
      checker_id: this.checker_id
    }

    const reqcreatecredit = await lastValueFrom(this.quotationService.MPLS_create_or_update_credit(reqcreatecreditdata))

    if (reqcreatecredit.status == true) {
      this.econsentbtnDisable = false
      this.cizcardtab.cizForm.markAsPristine();
      this.snackbarsuccess(`${reqcreatecredit.message}`)
    } else {
      this.snackbarfail(`${reqcreatecredit.message}`)
    }
  }

  async onclickEconsentBtn() {

    // *** เช็คสถานะการออก econsent ถ้ามีการ verify แล้วให้ซ่อนปุ่มไป ***
    // กรอกข้อมูลในหน้า product ให้ครบถึงจะกดปุ่มได้ 
    // จำเป็นต้องมีค่า cd_app_key_id ก่อน (ได้ค่าจากการกดปุ่มบันทึก (call fn onclickCreateCreditBtn()))
    // สร้างรายการ relate กับ MPLS_qquotation (MPLS_CREDIT) (เช็คสถานะว่ามี record อยู่แล้วหรอืเปล่า ถ้ามีไม่อนุญาตให้สร้าง) 
    // - ถ้า quo_dopa_status เป็น 'Y' ให้ popup หน้า validate econsent 
    // - ถ้าเป็น 'N' ให้ Skip ไปหน้า อาชีพและรายได้

    // === Create credit success  (first time click) === 
    this.loadingService.showLoader()

    const dopastatus = this.quotationResult$.value.data[0].quo_dopa_status

    if (dopastatus == 'Y') {

      // ==== เคสที่ dopa status เป็น 'Y' สามารถทำรายการ e-consent ได้ ===

      let resChkAppNum = await lastValueFrom(this.quotationService.MPLS_check_application_no(this.actRoute.snapshot.queryParamMap.get('id') ?? ''))

      let app_no = resChkAppNum.data[0].application_no

      if (app_no == '') {
        // *** gen application num ***

        const resultgenappno = await lastValueFrom(this.quotationService.MPLS_gen_application_no(this.actRoute.snapshot.queryParamMap.get('id') ?? ''))

        if (resultgenappno.status == 200) {
          // *** create applic ation num success *** 
          app_no = resultgenappno.data[0].application_no
        } else {
          console.log(`fail to gen application num : ${resultgenappno.message}`)
        }
      }

      // *** get time from server ***

      let currentDate: Date | null = null

      const resultgetcurrentDate = await lastValueFrom(this.quotationService.MPLS_getservertime())

      if (resultgetcurrentDate.status == 200) {
        // *** get server time success ***
        currentDate = resultgetcurrentDate.date
      }

      if (app_no !== '' && currentDate) {

        const quotationid = this.actRoute.snapshot.queryParamMap.get('id') ?? ''

        const senddata: IDialogEconsentOtpOpen = {
          header: `หน้ายืนยันการยินยอมเปิดเผยข้อมูล`,
          message: `ของคุณ ...`,
          quotationid: quotationid,
          firstname: this.quotationResult$.value.data[0].first_name ?? '-',
          lastname: this.quotationResult$.value.data[0].last_name ?? '-',
          citizenid: this.quotationResult$.value.data[0].idcard_num ?? '-',
          birthdate: this.quotationResult$.value.data[0].birth_date ? this.quotationResult$.value.data[0].birth_date : null,
          currentDate: currentDate,
          application_no: app_no ?? '-',
          phone_number: this.cizcardtab.cizForm.controls.generalinfoForm.controls.phoneNumber.value ?? '-',
          refid: app_no ?? '-',
          button_name: `ตกลง`,
          // === more field for stamp econsent log (addon 28/01/2023) ===
          transaction_no: this.quotationResult$.value.data[0].quo_app_ref_no
        }


        this.dialog.open(OtpEconsentComponent, {
          width: `100%`,
          height: `90%`,
          data: senddata,
          scrollStrategy: this.sso.reposition()
        }).afterClosed().subscribe((reseconsentdialog: IDialogEconsentValidClose) => {

          this.loadingService.hideLoader()

          if (reseconsentdialog.status == true) {
            this.snackbarsuccess('ทำรายการสำเร็จ')
            this.productdetailtab.productForm.controls.consentVerify.setValue(true)
            this.verifyeconsent = true

            // === set image attach valid (econsent non require image) === 
            this.verifyimageattach = true
            this.imageattachtab.txtrequireimage = ``
          }
        })
      } else {
        // === no application num value ===
        this.loadingService.hideLoader()
        this.openMaindialog('ผิดพลาด', 'ไม่พบเลข application no', 'OK')
      }
    } else if (dopastatus == 'N') {
      // === กรณี dopa status เป็น 'N' ไม่สามารถทำรายการ e-consent ได้ (auto flag non e-consent) ===
      if (this.quoid !== null || this.quoid !== '') {
        this.quotationService.MPLS_validation_otp_econsent_non(this.quoid).subscribe({
          next: (res_non) => {
            this.loadingService.hideLoader()
            if (res_non.status) {
              // === success update flag econsent ====
              this.snackbarsuccess('ทำรายการสำเร็จ')
              this.productdetailtab.productForm.controls.consentVerify.setValue(true)
              this.verifyeconsent = true
            } else {
              // === fail to update flag econsent ==== 
              this.snackbarfail(`ไม่สามารถทำรายการได้ : ${res_non.message}`)
            }
          }, error: (e) => {
            this.loadingService.hideLoader()
            console.error(e)
          }, complete: () => {
            this.loadingService.hideLoader()
            console.log(`complete trigger flag non e-consent`)
          }
        })
      }
    } else {
      // === do nothing === 
      this.loadingService.hideLoader()
    }



  }

  async onclickCreateCareerandPurposeBtn() {
    // *** create or save career and purpose record ***
    const career_form = this.careerandpurposetab.careerandpurposeForm.controls.careerForm.controls
    const purpose_form = this.careerandpurposetab.careerandpurposeForm.controls.purposeForm.controls

    const reqcreateorupdatecareerandpurpose: any = {
      quotationid: this.quoid,
      // === Career Path ===
      main_career_code: this.careerandpurposetab.careerandpurposeForm.controls.careerForm.controls.mainCareerCodeField.value ? career_form.mainCareerCodeField.value : '', // career form (stamp via code , sync master data)
      main_career_name: career_form.mainCareerNameField.value ? career_form.mainCareerNameField.value : '',
      main_department: career_form.mainCareerDepartmentField.value ? career_form.mainCareerDepartmentField.value : '',
      main_experience_month: career_form.mainCareerExperienceMonthField.value ? career_form.mainCareerExperienceMonthField.value : null,
      main_experience_year: career_form.mainCareerExperienceYearsField.value ? career_form.mainCareerExperienceYearsField.value : null,
      main_leader_name: career_form.mainCareerLeaderNameField.value ? career_form.mainCareerLeaderNameField.value : '',
      main_position: career_form.mainCareerPositionField.value ? career_form.mainCareerPositionField.value : '',
      main_salary_per_day: career_form.mainCareerSalaryPerDayField.value ? career_form.mainCareerSalaryPerDayField.value : null,
      main_salary_per_month: career_form.mainCareerSalaryPerMonthField.value ? career_form.mainCareerSalaryPerMonthField.value : null,
      main_work_per_week: career_form.mainCareerWorkPerWeekField.value ? career_form.mainCareerWorkPerWeekField.value : null,
      main_workplace_name: career_form.mainCareerWorkplace.value ? career_form.mainCareerWorkplace.value : '',
      is_sub_career: career_form.isSubCareerField.value ? 1 : 0,
      sub_career_code: career_form.subCareerCodeField.value ? career_form.subCareerCodeField.value : '', // career form (stamp via code , sync master data)
      sub_career_name: career_form.subCareerNameField.value ? career_form.subCareerNameField.value : '',
      sub_department: career_form.subCareerDepartmentField.value ? career_form.subCareerDepartmentField.value : '',
      sub_experience_month: career_form.subCareerExperienceMonthField.value ? career_form.subCareerExperienceMonthField.value : null,
      sub_experience_year: career_form.subCareerExperienceYearsField.value ? career_form.subCareerExperienceYearsField.value : null,
      sub_leader_name: career_form.subCareerLeaderNameField.value ? career_form.subCareerLeaderNameField.value : '',
      sub_position: career_form.subCareerPositionField.value ? career_form.subCareerPositionField.value : '',
      sub_salary_per_day: career_form.subCareerSalaryPerDayField.value ? career_form.subCareerSalaryPerDayField.value : null,
      sub_salary_per_month: career_form.subCareerSalaryPerMonthField.value ? career_form.subCareerSalaryPerMonthField.value : null,
      sub_work_per_week: career_form.subCareerWorkPerWeekField.value ? career_form.subCareerWorkPerWeekField.value : null,
      sub_workplace_name: career_form.subCareerWorkplace.value ? career_form.subCareerWorkplace.value : '',
      // === purpose Path ===
      car_user: purpose_form.carUser.value ? purpose_form.carUser.value : '', // career form (stamp via code , sync master data)
      car_user_citizen_id: purpose_form.carUserCitizenid.value ? purpose_form.carUserCitizenid.value : '',
      car_user_district: purpose_form.carUserDistrict.value ? purpose_form.carUserDistrict.value : '',
      car_user_floor: purpose_form.carUserFloor.value ? purpose_form.carUserFloor.value : '',
      car_user_home_name: purpose_form.carUserHomeName.value ? purpose_form.carUserHomeName.value : '',
      car_user_home_no: purpose_form.carUserHomeNo.value ? purpose_form.carUserHomeNo.value : '',
      car_user_moo: purpose_form.carUserMoo.value ? purpose_form.carUserMoo.value : '',
      car_user_name: purpose_form.carUserName.value ? purpose_form.carUserName.value : '',
      car_user_name_2: purpose_form.carUserName2.value ? purpose_form.carUserName2.value : '',
      car_user_phone_no: purpose_form.carUserPhoneNo.value ? purpose_form.carUserPhoneNo.value : '',
      car_user_postal_code: purpose_form.carUserPostalCode.value ? purpose_form.carUserPostalCode.value : '',
      car_user_province_code: purpose_form.carUserProvinceCode.value ? purpose_form.carUserProvinceCode.value : '',
      car_user_province_name: purpose_form.carUserProvinceName.value ? purpose_form.carUserProvinceName.value : '',
      car_user_relation: purpose_form.carUserRelation.value ? purpose_form.carUserRelation.value : '',
      car_user_road: purpose_form.carUserRoad.value ? purpose_form.carUserRoad.value : '',
      car_user_room_no: purpose_form.carUserRoomNo.value ? purpose_form.carUserRoomNo.value : '',
      car_user_soi: purpose_form.carUserSoi.value ? purpose_form.carUserSoi.value : '',
      car_user_sub_district: purpose_form.carUserSubDistrict.value ? purpose_form.carUserSubDistrict.value : '',
      first_referral_fullname: purpose_form.firstReferralFullName.value ? purpose_form.firstReferralFullName.value : '',
      first_referral_phone_no: purpose_form.firstReferralPhoneNo.value ? purpose_form.firstReferralPhoneNo.value : '',
      first_referral_relation: purpose_form.firstReferralRelation.value ? purpose_form.firstReferralRelation.value : '',
      purpose_buy: purpose_form.purposeBuy.value ? purpose_form.purposeBuy.value : '', // purpose form (รหัสคำนำหน้า)
      purpose_buy_name: purpose_form.purposeBuyName.value ? purpose_form.purposeBuyName.value : '',
      reason_buy: purpose_form.reasonBuy.value ? purpose_form.reasonBuy.value : '', // purpose form (select code of Reason (sync with master data))
      reason_buy_etc: purpose_form.reasonBuyEtc.value ? purpose_form.reasonBuyEtc.value : '',
      second_referral_fullname: purpose_form.secondReferralFullName.value ? purpose_form.secondReferralFullName.value : '',
      second_referral_phone_no: purpose_form.secondReferralPhoneNo.value ? purpose_form.secondReferralPhoneNo.value : '',
      second_referral_relation: purpose_form.secondReferralRelation.value ? purpose_form.secondReferralRelation.value : ''
    }

    const reqcreatorupdatecareerandpurpose = await lastValueFrom(this.quotationService.MPLS_create_or_update_careerandpurpose(reqcreateorupdatecareerandpurpose))

    if (reqcreatorupdatecareerandpurpose.status) {
      // === create or update success === 
      this.verifycareerandpurpose = true
      this.careerandpurposetab.careerandpurposeForm.controls.verifyCareerandpurpose.setValue(true)
      this.snackbarsuccess(`ทำรายการสำเร็จ : ${reqcreatorupdatecareerandpurpose.message}`)
    } else {
      this.snackbarfail(`ทำรายการไม่สำเร็จ : ${reqcreatorupdatecareerandpurpose.message ? reqcreatorupdatecareerandpurpose.message : 'No return message'}`)
    }


  }

  recieve_verifyimageattach($event: boolean) {
    if ($event) {
      this.verifyimageattach = true
      this.imageattachtab.txtrequireimage = `*แนบไฟล์ "บัตรประชาชน" , "รูปหน้าลูกค้าพร้อมบัตรประชาชน" , "สำเนาบัตรประชาชนพร้อมลายเซ็นรับรองถูกต้อง"  และ "NCB Consent`
    } else {
      this.verifyimageattach = false
    }
  }

  async recieve_createconsentBtn($event: boolean) {
    // === CREATE CONSENT (FINAL STAGE BEFORE SEND TO ORACLE)  ===
    if ($event) {
      // === call api to create consent and signature (all in tab consent) ===
      this.loadingService.showLoader()
      const consent_tab = this.consenttab
      const ciz_form = this.cizcardtab.cizForm

      // *** PDPA ***
      const pdpa_form = consent_tab.p_d_econsenttab.formPersonalDisclosureConsent
      // *** E-paper ***
      const e_paper_form = consent_tab.e_paper_econsenttab.epaperform
      // *** Siganture ***
      const signature_form = consent_tab.signaturetab.signatureForm

      const quoid = this.actRoute.snapshot.queryParamMap.get('id') ?? ''

      const quodata = this.quotationResult$.value.data[0]

      let quotationdata = {
        quotationid: quoid ? quoid : '',
        // *** customer name ***

        consent_customer_name: (quodata.first_name ? quodata.first_name : '') + ' ' + (quodata.last_name ? quodata.last_name : ''),
        consent_first_name: quodata.first_name ? quodata.first_name : '',
        consent_last_name: quodata.last_name ? quodata.last_name : '',
        // *** PDPA ***
        identity_approve_consent_value: pdpa_form.controls.identity_approve_consent_value.value ? pdpa_form.controls.identity_approve_consent_value.value : 0,
        motor_insurance_consent_value: pdpa_form.controls.motor_insurance_consent_value.value ? pdpa_form.controls.motor_insurance_consent_value.value : 0,
        nmotor_insurance_consent_value: pdpa_form.controls.nmotor_insurance_consent_value.value ? pdpa_form.controls.nmotor_insurance_consent_value.value : 0,
        analyze_consent_value: pdpa_form.controls.analyze_consent_value.value ? pdpa_form.controls.analyze_consent_value.value : 0,
        info_consent_value: pdpa_form.controls.info_consent_value.value ? pdpa_form.controls.info_consent_value.value : 0,
        info_party_consent_value: pdpa_form.controls.info_party_consent_value.value ? pdpa_form.controls.info_party_consent_value.value : 0,
        analyze_party_consent_value: pdpa_form.controls.analyze_party_consent_value.value ? pdpa_form.controls.analyze_party_consent_value.value : 0,
        prdt_info_party_consent_value: pdpa_form.controls.prdt_info_party_consent_value.value ? pdpa_form.controls.prdt_info_party_consent_value.value : 0,
        followup_consent_value: pdpa_form.controls.followup_consent_value.value ? pdpa_form.controls.followup_consent_value.value : 0,
        info_develop_consent_value: pdpa_form.controls.info_develop_consent_value.value ? pdpa_form.controls.info_develop_consent_value.value : 0,
        // *** E-paper ***
        e_paper_consent_value: e_paper_form.controls.epaperconsentvalue.value ? e_paper_form.controls.epaperconsentvalue.value : 0,
      }

      console.log(`data for create consent : ${JSON.stringify(quotationdata)}`)

      const itemString = JSON.stringify(quotationdata)

      let fd = new FormData();
      fd.append('item', itemString)
      // *** signature ***
      if (signature_form.controls.customerSignature.value) { fd.append('signature_image', await this._base64toblob(signature_form.controls.customerSignature.value)) }
      if (signature_form.controls.witnessSignature.value) { fd.append('witness_image', await this._base64toblob(signature_form.controls.witnessSignature.value)) }

      this.quotationService.MPLS_create_consent(fd).subscribe({
        next: (res_create_consent) => {

          this.loadingService.hideLoader()
          // === check result create consent (success when status == 200) ===
          if (res_create_consent.status == 200) {
            // === sucess ===
            this.snackbarsuccess(`ทำรายการสำเร็จ : ${res_create_consent.message ? res_create_consent.message : 'No message'}`)
            // === do next stage === 
            this.router.navigate(['/quotation-view']);
          } else {
            this.snackbarfail(`ทำรายการไม่สำเร็จ : ${res_create_consent.message ? res_create_consent.message : 'No message'}`)
          }
        }, error: (e) => {
          // === handle error here ===
          this.loadingService.hideLoader()
          this.snackbarfail(`ผิดพลาด : ${e.message ? e.message : 'No return message'}`)
          console.error(e.message ? e.message : 'No return message ')
        }, complete: () => {
          // === complete ===
          this.loadingService.hideLoader()
        }
      })
    }
  }

  openDialogStep(header: string, message: string, buttonName: string, previousStage: number) {
    this.dialog.open(MainDialogComponent, {
      maxWidth: '500px',
      data: {
        header: header,
        message: message,
        button_name: buttonName
      }
    }).afterClosed().subscribe((res) => {
      this.stepper.selectedIndex = previousStage;
    })
  }

  checkIsSendCar($event: boolean) {
    this.sendcarActive$.next($event)
  }

  updateage($event: number) {
    this.cusage = $event

    // console.log(`this is age from ciz page (quotaion) : ${this.age}`)

    this.age_send.emit($event)
  }

  updategender($event: number) {
    this.gender = $event

    // console.log(`this is gender from ciz page (quotaion) : ${this.gender}`)

    this.age_send.emit($event)
  }

}

