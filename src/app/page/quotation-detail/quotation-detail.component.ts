import { ChangeDetectorRef, Component, ErrorHandler, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BehaviorSubject, lastValueFrom, map, Observable, of } from 'rxjs';
import { BreakpointObserver } from '@angular/cdk/layout';
import { StepperOrientation, StepperSelectionEvent } from '@angular/cdk/stepper';
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
import { MatDialog } from '@angular/material/dialog';
import { MainDialogComponent } from 'src/app/widget/dialog/main-dialog/main-dialog.component';
import { ProductDetailTabComponent } from '../quotation-tab/product-detail-tab/product-detail-tab.component';
import { MatStepper } from '@angular/material/stepper';
import { OptEconsentComponent } from 'src/app/widget/dialog/opt-econsent/opt-econsent.component';
import { OtpVerifyDialogComponent } from 'src/app/widget/dialog/otp-verify-dialog/otp-verify-dialog.component';
import { IResBasic } from 'src/app/interface/i-res-basic';
import { IResPhoneUpdate } from 'src/app/interface/i-res-phone-update';
import { IDialogPhoneValidClose } from 'src/app/interface/i-dialog-phone-valid-close';
import { IDialogEconsentOtpOpen } from 'src/app/interface/i-dialog-econsent-otp-open';
import { IReqCreateCredit } from 'src/app/interface/i-req-create-credit';

@Component({
  selector: 'app-quotation-detail',
  templateUrl: './quotation-detail.component.html',
  styleUrls: ['./quotation-detail.component.scss']
})
export class QuotationDetailComponent extends BaseService implements OnInit {

  // === lay out ===
  // ** stepper **
  stepperOrientation: Observable<StepperOrientation>;
  isLinear: boolean = true;

  quoForm: FormGroup;
  quotationkeyid: string;
  queryParams: ParamMap;
  quotationResult$: BehaviorSubject<IResQuotationDetail> = new BehaviorSubject<IResQuotationDetail>({} as IResQuotationDetail)
  quoid: string = ''
  visiblePhoneValid: boolean = true
  verifyeconsent: boolean = false
  createorupdatecreditbtnDisable: boolean = true
  econsentbtnDisable: boolean = true // === use with buttn econsent btn disable (step 2)


  @ViewChild(CizCardTabComponent) cizcardtab: CizCardTabComponent = new CizCardTabComponent(
    this.fb,
    this.cd,
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
    this._snackBar
  )


  constructor(
    private fb: FormBuilder,
    private cd: ChangeDetectorRef,
    private router: Router,
    private breakpointObserver: BreakpointObserver,
    private loadingService: LoadingService,
    private masterDataService: MasterDataService,
    private dipchipService: DipchipService,
    private actRoute: ActivatedRoute,
    private quotationService: QuotationService,
    public override dialog: MatDialog,
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

          if (quoitem.otp_consent_verify == 'Y') {
            this.verifyeconsent = true
          }

          if (quoitem.ciz_phone_valid_status == 'Y') {
            this.visiblePhoneValid = false
          }

          if (quoitem.cd_app_key_id !== '' && quoitem.cd_app_key_id !== null) {
            this.econsentbtnDisable = false
          }

        }
      }
    })
  }


  // === subscribe on viewchild === 
  // *** etc subscribe form ****
  ngAfterViewInit() {

    this.productdetailtab.detailForm.valueChanges.subscribe(value => {
      if (this.productdetailtab.productForm.controls.detailForm.valid) {
        this.econsentbtnDisable = false
        this.createorupdatecreditbtnDisable = false
      }
    });
  }

  async afteroninit() {
    // == clear dopa status ==
    this.quotationService.cleardopastatus()
    if (this.quoid) {
      // === set Observable quotation (quotationResult$) ===
      this.quotationResult$.next(await lastValueFrom(this.quotationService.getquotationbyid(this.quoid)))
      if (this.quotationResult$.value.data.length !== 0) {
        console.log(`this is quo id : ${this.quotationResult$.value.data[0].quo_key_app_id}`)

        this.quotationService.setstatusdopa(this.quotationResult$.value.data[0].quo_key_app_id)
        this.manageStatgequotation(this.quotationResult$.value)
      } else {

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



  changeStage($event: StepperSelectionEvent) {
    const stage = $event.selectedIndex

    switch (stage) {
      case 0:
        // *** Citizencard ***
        break;
      case 1: {
        // *** Product deatail ***
        this.productdetailtab.onStageChageFormStepper()
      }
        break;

      default:
        break;
    }

  }

  recieve_dipchipData($event: IReqFlagDipchip) {
    if ($event.status) {

      this.createquotationdopa('1', $event.uuid).then((dchk) => {
        if (dchk.status) {
          this.dipchipService.updatedipchipflag({
            token: '',
            username: this.usernamefordipchip,
            fromBody: $event.uuid
          }).subscribe(async (value) => {
            console.log(`flag success : ${JSON.stringify(value)}`)

            // === set router id ===
            if (value.number == 200) {
              this.snackbarsuccess(`บันทึกฉบับร่างสำเร็จ`);

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
        }
      })
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

      return (resultCreateQEconsent.status == 200) ? { status: true, refId: resultCreateQEconsent.data[0].quo_key_app_id } : { status: false, refId: '' }

    } catch (e: any) {
      console.log(`error create e-consent quotation : ${e.message}`)
      return { status: false, refid: '' }
    }
  }

  async onClickBtnVerifyPhone() {

    // เช็ค field OTP_PHONE_VERIFY ถ้าเป็น 'Y' ไม่ให้แสดงปุุ่มและปลดล๊อคหน้า product 
    // == กรณี OTP_PHONE_VERIFY ไม่มีค่า (ไม่ได้เป็นค่า 'Y')
    // เช็ค field QUO_OTP_PHONE ถ้าเป็น 'C' แสดงว่ามีการขอ OTP ไปแล้ว

    // ==== กรณี field phone_number บนหน้า form มีการแก้ไข ให้ save record ก่อนค่อยเปิดหน้าออก OTP (open dialog OtpVerifyDialogComponent)

    const isDirty = this.cizcardtab.cizForm.controls.maincitizenForm.controls.phoneNumber.dirty
    const quoid = this.actRoute.snapshot.queryParamMap.get('id') ?? ''


    let updatePhoneresult = {} as IResPhoneUpdate

    if (isDirty) {
      updatePhoneresult = await lastValueFrom(this.quotationService.MPLS_update_phone_number(
        {
          quotationid: quoid,
          phone_number: this.cizcardtab.cizForm.controls.maincitizenForm.controls.phoneNumber.value ?? ''
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
          phone_number: this.cizcardtab.cizForm.controls.maincitizenForm.controls.phoneNumber.value,
          refid: `${this.quotationResult$.value.data[0].quo_app_ref_no}`,
          button_name: `ปิด`
        }
      }).afterClosed().subscribe((resdialog: IDialogPhoneValidClose) => {

        // === check if phone number change ===
        const currentPhonenumber = this.cizcardtab.cizForm.controls.maincitizenForm.controls.phoneNumber.value
        const newphonenumber = resdialog.phone_number
        const validstatus = resdialog.otp_status

        if (currentPhonenumber !== newphonenumber) {

          if (newphonenumber) {
            this.quotationService.MPLS_update_phone_number({
              quotationid: quoid,
              phone_number: newphonenumber
            }).subscribe((res) => {

              if (res.status) {
                this.cizcardtab.cizForm.controls.maincitizenForm.controls.phoneNumber.setValue(newphonenumber)
                this._snackBar.open('อัพเดทเบอร์โทรศัพท์สำเร็จ', '', {
                  horizontalPosition: 'end',
                  verticalPosition: 'bottom',
                  duration: 3000,
                  panelClass: 'custom-snackbar-container'
                })

              } else {

              }
            })
          }

        }
        // === update quotationResult$ === 
        this.quotationService.getquotationbyid(quoid).subscribe((result) => {
          this.quotationResult$.next(result)
        })
      })

    } else {
      // === update phone number fail === 
      this.openMaindialog('ผิดพลาด', 'ไม่สามารถอัพเดทเบอร์โทรศัพท์ได้', 'OK')
    }


  }

  async onclickCreateCreditBtn() {
    // *** save credit ***

    const reqcreatecreditdata: IReqCreateCredit = {
      quotationid: this.quoid,
      brand_code: this.productdetailtab.productForm.controls.detailForm.controls.carBrandField.value ?? '',
      brand_name: this.productdetailtab.productForm.controls.detailForm.controls.carModelNameField.value ?? '',
      model_code: this.productdetailtab.productForm.controls.detailForm.controls.carModelField.value ?? '',
      model_name: this.productdetailtab.productForm.controls.detailForm.controls.carModelNameField.value ?? '',
      color_name: this.productdetailtab.productForm.controls.detailForm.controls.carColorField.value ?? '',
      loan_amount: this.productdetailtab.productForm.controls.detailForm.controls.loanAmountField.value ?? null,
      product_value: this.productdetailtab.productForm.controls.detailForm.controls.productValueField.value ?? null,
      interest_rate: this.productdetailtab.productForm.controls.detailForm.controls.interestRateField.value,
      payment_value: this.productdetailtab.productForm.controls.detailForm.controls.paymentValueField.value,
      payment_round_count: this.productdetailtab.productForm.controls.detailForm.controls.paymentRoundCountValueField.value,
      insurance_code: this.productdetailtab.productForm.controls.detailForm.controls.insuranceCodeField.value ?? '',
      insurance_year: this.productdetailtab.productForm.controls.detailForm.controls.insuranceYearField.value,
      insurance_plan_price: this.productdetailtab.productForm.controls.detailForm.controls.insurancePlanPriceField.value,
      is_include_loanamount: this.productdetailtab.productForm.controls.detailForm.controls.isincludeloanamount.value == true ? 1 : 0,
      factory_price: this.productdetailtab.productForm.controls.detailForm.controls.factoryPriceValueField.value,
      size_model: this.productdetailtab.productForm.controls.detailForm.controls.sizeModelField.value,
      insurer_code: this.productdetailtab.productForm.controls.detailForm.controls.insurerCodeField.value ?? '',
      insurer_name: this.productdetailtab.productForm.controls.detailForm.controls.insurerNameField.value ?? '',
    }

    const reqcreatecredit = await lastValueFrom(this.quotationService.MPLS_create_or_update_credit(reqcreatecreditdata))

    if(reqcreatecredit.status == true) {
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

    // === Create credit success  (first time click) === 

    let resChkAppNum = await lastValueFrom(this.quotationService.MPLS_check_application_no(this.actRoute.snapshot.queryParamMap.get('id') ?? ''))

    let app_no = resChkAppNum.data[0].application_no

    if (app_no == '') {
      // *** gen application num ***

      const resultgenappno = await lastValueFrom(this.quotationService.MPLS_gen_application_no(this.actRoute.snapshot.queryParamMap.get('id') ?? ''))

      if (resultgenappno.status == 200) {
        // *** create application num success *** 
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

      const quotationid = this.quotationkeyid

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
        phone_number: this.cizcardtab.cizForm.controls.maincitizenForm.controls.phoneNumber.value ?? '-',
        refid: app_no ?? '-',
        button_name: `ตกลง`
      }
      this.dialog.open(OptEconsentComponent, {
        width: `65%`,
        height: `90%`,
        data: senddata
      }).afterClosed().subscribe(res => {
        // === do something ===
      })
    } else {
      // === no application num value ===
      this.openMaindialog('ผิดพลาด', 'ไม่พบเลข application no', 'OK')
    }


  }
}

