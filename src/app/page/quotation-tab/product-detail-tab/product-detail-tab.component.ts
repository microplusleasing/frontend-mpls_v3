import { BreakpointObserver } from '@angular/cdk/layout';
import { DatePipe } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, combineLatest, debounceTime, lastValueFrom, map, Observable, of, startWith, Subject, tap } from 'rxjs';
import { ThaidateformatDirective } from 'src/app/directive/thaidateformat.directive';
import { IDialogSecondHandCarView } from 'src/app/interface/i-dialog-second-hand-car-view';
import { IResGetMasterBussinessData } from 'src/app/interface/i-res-get-master-bussiness';
import { IResMasterBranchData } from 'src/app/interface/i-res-master-branch';
import { IResMasterBrandData } from 'src/app/interface/i-res-master-brand';
import { IResMasterDealer, IResMasterDealerData } from 'src/app/interface/i-res-master-dealer';
import { IResMasterInsuranceYearsData } from 'src/app/interface/i-res-master-insurance-years';
import { IResMasterInsurerData } from 'src/app/interface/i-res-master-insurer';
import { IResMasterModel, IResMasterModelData } from 'src/app/interface/i-res-master-model';
import { IResMasterProvince } from 'src/app/interface/i-res-master-province';
import { IResQuotationDetail } from 'src/app/interface/i-res-quotation-detail';
import { IUserToken } from 'src/app/interface/i-user-token';
import { IResSecondHandCarViewData } from 'src/app/interface/i-res-second-hand-car-view';
import { BaseService } from 'src/app/service/base/base.service';
import { ImageUtilService } from 'src/app/service/image-util.service';
import { LoadingService } from 'src/app/service/loading.service';
import { MasterDataService } from 'src/app/service/master.service';
import { DealerGradeImageDialogComponent } from 'src/app/widget/dialog/dealer-grade-image-dialog/dealer-grade-image-dialog.component';
import { MainDialogComponent } from 'src/app/widget/dialog/main-dialog/main-dialog.component';
import { SecondhandCarViewDialogComponent } from 'src/app/widget/dialog/secondhand-car-view-dialog/secondhand-car-view-dialog.component';

@Component({
    selector: 'app-product-detail-tab',
    templateUrl: './product-detail-tab.component.html',
    styleUrls: ['./product-detail-tab.component.scss'],
    standalone: false
})
export class ProductDetailTabComponent extends BaseService implements OnInit, AfterViewInit {

  @Input() quotationReq = {} as Subject<IResQuotationDetail>;
  quotationdatatemp: IResQuotationDetail = {} as IResQuotationDetail
  lockallbtn: boolean = false

  // *** check econsent verify ***
  consentVerify = new FormControl<boolean>(false, Validators.requiredTrue)

  bussinessCode = new FormControl('')
  bussinessName = new FormControl('')
  dealerCode = new FormControl('', Validators.required)
  carBrandField = new FormControl<string | ''>('', Validators.required)
  carBrandNameField = new FormControl('', Validators.required)
  carModelField = new FormControl<string | ''>('', Validators.required)
  carModelNameField = new FormControl('', Validators.required)
  carColorField = new FormControl('')
  loanAmountField = new FormControl<number | null>(null, [Validators.minLength(1), this.customMaxValidator.bind(this)])
  isovermaxltvField = new FormControl<boolean>(false)
  overmaxltvreasonField = new FormControl<string>('')
  productValueField = new FormControl<number | null>(null, Validators.required)
  downPaymentField = new FormControl<number | null>(null)
  interestRateField = new FormControl<number | null>(null, Validators.required)
  paymentRoundCountValueField = new FormControl<number | null | undefined>(null, Validators.required)
  insurerCodeField = new FormControl('', Validators.required)
  insurerNameField = new FormControl('', Validators.required)
  insuranceCodeField = new FormControl('', Validators.required)
  insuranceNameField = new FormControl<string | ''>('', Validators.required)
  insuranceYearField = new FormControl<number | null>(null, Validators.required)
  insurancePlanPriceField = new FormControl<number | null>(null, Validators.required)
  paymentValueField = new FormControl<number | null>(null, Validators.required)
  isincludeloanamount = new FormControl<boolean>(true)
  factoryPriceValueField = new FormControl<number | null>(null)
  sizeModelField = new FormControl()
  // === new field max ltv (24.08/2022) ===
  maxltvField = new FormControl()
  // === new field (29/08/2022) ===
  engineNoField = new FormControl()
  chassisNoField = new FormControl()
  runningengineNoField = new FormControl()
  runningchassisNoField = new FormControl()
  priceincludevatField = new FormControl<number | null>(null, Validators.required)
  value1 = new FormControl()
  value2 = new FormControl()
  value3 = new FormControl()

  // === second hand car field (31/03/2023) ====
  model_year = new FormControl()
  cc = new FormControl<number | null>(null)
  reg_no = new FormControl()
  reg_date = new FormControl()
  contract_ref = new FormControl()
  reg_mile = new FormControl<number | null>(null)
  grade_moto = new FormControl<string>('')
  prov_name = new FormControl()
  prov_code = new FormControl()
  moto_year = new FormControl()

  detailForm = this.fb.group({
    bussinessCode: this.bussinessCode,
    bussinessName: this.bussinessName,
    dealerCode: this.dealerCode,
    carBrandField: this.carBrandField,
    carBrandNameField: this.carBrandNameField,
    carModelField: this.carModelField,
    carModelNameField: this.carModelNameField,
    carColorField: this.carColorField,
    loanAmountField: this.loanAmountField,
    productValueField: this.productValueField,
    downPaymentField: this.downPaymentField,
    interestRateField: this.interestRateField,
    paymentRoundCountValueField: this.paymentRoundCountValueField,
    insurerCodeField: this.insurerCodeField,
    insurerNameField: this.insurerNameField,
    insuranceCodeField: this.insuranceCodeField,
    insuranceNameField: this.insuranceNameField,
    insuranceYearField: this.insuranceYearField,
    insurancePlanPriceField: this.insurancePlanPriceField,
    paymentValueField: this.paymentValueField,
    isincludeloanamount: this.isincludeloanamount,
    factoryPriceValueField: this.factoryPriceValueField,
    sizeModelField: this.sizeModelField,
    // === new field max ltv (24.08/2022) ===
    maxltvField: this.maxltvField,
    // === new field (29/08/2022) ===
    engineNoField: this.engineNoField,
    chassisNoField: this.chassisNoField,
    runningengineNoField: this.runningengineNoField,
    runningchassisNoField: this.runningchassisNoField,
    priceincludevatField: this.priceincludevatField,
    value1: this.value1,
    value2: this.value2,
    value3: this.value3
  })

  secondHandCarForm = this.fb.group({
    model_year: this.model_year,
    cc: this.cc,
    reg_no: this.reg_no,
    reg_date: this.reg_date,
    contract_ref: this.contract_ref,
    reg_mile: this.reg_mile,
    grade_moto: this.grade_moto,
    prov_name: this.prov_name,
    prov_code: this.prov_code,
    moto_year: this.moto_year,
    // === is over max ltv in case busicode == 002 (MPlus จัดกลับ) (25/08/2023) ===
    isovermaxltvField: this.isovermaxltvField,
    overmaxltvreasonField: this.overmaxltvreasonField,
  })


  // *** main Form ***
  productForm = this.fb.group({
    consentVerify: this.consentVerify,
    detailForm: this.detailForm,
    secondHandCarForm: this.secondHandCarForm
  })

  showPrice: boolean = false;

  bussinessList = [] as IResGetMasterBussinessData[];
  brandList = [] as IResMasterBrandData[];
  modelList = [] as IResMasterModelData[];
  masterProvinceList: IResMasterProvince = {} as IResMasterProvince
  modelListFilter = [] as IResMasterModelData[];
  modelSelect = [] as IResMasterModelData[];
  InsuranceListTemp = [] as IResMasterInsurerData[];
  InsuranceList: any = [];
  InsuranceListFilter: any = [];
  InsuranceYearSelect = [] as IResMasterInsuranceYearsData[];
  rateSelect: any = [];
  paymentCountSelect: any = [];
  planPrice: number = 0
  dealerList: IResMasterDealerData[] = [] as IResMasterDealerData[]
  lockbtncalculate$ = new BehaviorSubject<boolean>(true)
  paymentvalue$ = new BehaviorSubject<number>(0)
  showpaymentvalue$ = new BehaviorSubject<boolean>(false)
  netfinance: number = 0
  biaprakan: number = 0
  paymentshowvalue: number = 0
  maxltvCurrent: number = 0

  // === ทุนประกัน (24/08/2022) === 
  coverage: number = 0

  // === ราคาเงินสด (29/08/2022) ===
  factoryprice: number = 0

  loanAmountFieldSubjet: Subject<number | null> = new Subject();

  // === for mat autocomplete ===
  filterDealerList?: Observable<IResMasterDealerData[]>
  filterBrandList?: Observable<IResMasterBrandData[]>
  filterModelList?: Observable<IResMasterModelData[]>
  filterInsurerList?: Observable<IResMasterInsurerData[]>
  filterInsuranceYear?: Observable<IResMasterInsuranceYearsData[]>

  dealerSelectText: Observable<string> = of('')
  brandSelectText: Observable<string> = of('')
  modelSelectText: Observable<string> = of('')

  maxlvtmessage$: Observable<string> = new Observable<string>()
  maxltvValue$: Observable<number> = new Observable<number>()
  maxltvValue: number = 0;
  isshowmaxltv: boolean = false;
  showBrandModelLoan$: Observable<boolean> = new Observable<boolean>()
  showInsuranceSelect$: Observable<boolean> = new Observable<boolean>()
  isChecker: boolean = false;
  sellerCode: string = '';
  countload: number = 0;
  is_edit: boolean = true
  // === show chasis and engine (29/08/2022) === 
  showchassisandengine: boolean = false


  // === show econsent image button (20/04/2023) ===
  showeconsentimagebutton: boolean = false

  // === variable (out_stand) (22/09/2022) ===
  out_stand: number = 0

  // *** add some temp param of getMaxLtv for call agiant when moto year change (handle secondhand car that bussiness_code = 003) (20/04/2023) *** 
  valuepricetemp: number = 0
  selectModelCodeValueTemp: string = ''

  // *** add current select brand and model value (30/05/2023) ***
  currentSelectBrand: IResMasterBrandData[] = []
  currentSelectModel: IResMasterModelData[] = []


  // === variable to check dealer grade dialog is open ====
  isDialogOpen: boolean = false;

  @Input() insurance_age: number = 0
  @Input() cusage: number = 0
  @Input() gender: number = 0
  @Input() birth_date: Date | null = null
  @Output() trigger_bussinesscode = new EventEmitter<boolean>();


  // === 2ndhand_car variable (23/03/2023) ===
  show2ndHandMPLSBtn: boolean = false
  showdealerfield: boolean = false
  showgeneralcarinfovisible: boolean = false
  shwosecondhandcardetail: boolean = false

  warningMsgPaymentValueField: boolean = false;// === subscribe on paymentValueField (valueChange) to show or hide === 

  cardLayout = this.breakpointObserver
    .observe('(min-width: 800px)')
    .pipe(
      map(({ matches }) => {
        if (matches) {
          return {
            columns: 12,
            list: { maxcols: 12, cols6: 6, cols4: 4, cols3: 3, cols2: 2, col: 1 },
            isweb: true
          };
        }

        return {
          columns: 1,
          list: { maxcols: 1, cols6: 1, cols4: 1, cols3: 1, cols2: 1, col: 1 },
          isweb: false
        };
      })
    );

  constructor(
    private fb: FormBuilder,
    private cdRef: ChangeDetectorRef,
    private masterDataService: MasterDataService,
    private imageUtilService: ImageUtilService,
    private loadingService: LoadingService,
    public override dialog: MatDialog,
    public override _snackBar: MatSnackBar,
    private breakpointObserver: BreakpointObserver
  ) {
    super(dialog, _snackBar)

    this.productForm.controls.secondHandCarForm.controls.overmaxltvreasonField.disable()

    this.productForm.controls.secondHandCarForm.controls.isovermaxltvField.valueChanges.subscribe((res) => {
      if (res) {
        this.productForm.controls.secondHandCarForm.controls.overmaxltvreasonField.enable()
      } else {
        this.productForm.controls.secondHandCarForm.controls.overmaxltvreasonField.setValue(null, { emitEvent: false })
        this.productForm.controls.secondHandCarForm.controls.overmaxltvreasonField.disable()
      }
    })
  }

  async ngOnInit() {
    // === onchange field ====
    this.warningMsgPaymentValueField = false

    this.productForm.controls.detailForm.controls.insurancePlanPriceField.disable();

  }

  ngAfterViewInit(): void {
    // *** paymentValueField ***
    this.productForm.controls.detailForm.controls.paymentValueField.valueChanges.subscribe((res) => {
      if (this.productForm.controls.detailForm.controls.paymentValueField.valid) {
        this.warningMsgPaymentValueField = false
        this.cdRef.detectChanges();
      } else {
        this.warningMsgPaymentValueField = true
        this.cdRef.detectChanges();
      }
    })
  }


  private _filterDealer(value: string | null): IResMasterDealerData[] {

    if (value) {
      const filterValue = value.toLowerCase();
      return this.dealerList.filter(value => value.dl_code.includes(filterValue) || value.dl_name.includes(filterValue))
    } else {
      return this.dealerList.filter(value => value.dl_code.includes('') || value.dl_name.includes(''))
    }
  }

  private _filterBrand(value: string | null): IResMasterBrandData[] {
    if (value) {
      const filterValue = value.toLowerCase();
      return this.brandList.filter(value => value.brand_code.includes(filterValue) || value.brand_name.toLowerCase().includes(filterValue))
    } else {
      return this.brandList.filter(value => value.brand_code.includes('') || value.brand_name.toLowerCase().includes(''))
    }
  }

  private _filterModel(value: string | null): IResMasterModelData[] {

    if (value) {

      const filterValue = value
      return this.modelListFilter.filter(value => value.model_code.includes(filterValue) || value.model.includes(filterValue))
    } else {
      return this.modelListFilter.filter(value => value.model_code.includes('') || value.model.includes(''))
    }
  }

  validateDealerformat(listitem: IResMasterDealerData[]): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const index = listitem.findIndex(items => {
        return (new RegExp('\^' + items.dl_code + '\$')).test(control.value);
      })
      return index < 0 ? { 'wrongFormatDealer': { value: control.value } } : null;
    };
  }

  validateBrandformat(listitem: IResMasterBrandData[]): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const index = listitem.findIndex(items => {
        return (new RegExp('\^' + items.brand_code + '\$')).test(control.value);
      })
      return index < 0 ? { 'wrongFormatBrand': { value: control.value } } : null;
    };
  }

  validateModelformat(listitem: IResMasterModelData[]): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const index = listitem.findIndex(items => {
        return (new RegExp('\^' + items.model_code + '\$')).test(control.value);
      })
      return index < 0 ? { 'wrongFormatModel': { value: control.value } } : null;
    };
  }

  // Custom validator function for max validation (loan_amountField)
  customMaxValidator(control: AbstractControl): ValidationErrors | null {

    if (this.maxltvValue) {
      if (control.value > this.maxltvValue) {
        return { max: true }; // Return a ValidationErrors object with the 'max' key
      }
      return null; // Return null if there are no validation errors
    } else {
      return null;
    }
  }


  async onStageChageFormStepper() {
    // this.loadingService.showLoader()
    if (this.countload === 0) {
      // this.loadingService.showLoader()
      this.quotationReq.subscribe({
        next: (resquo) => {
          this.loadingService.showLoader()
          this.quotationdatatemp = resquo
          const checkquoitem = this.quotationdatatemp.data
          if (checkquoitem) {

            const quoitem = this.quotationdatatemp.data[0]
            const recordExists = (quoitem.cd_app_key_id !== '' && quoitem.cd_app_key_id !== null) ? true : false
            combineLatest([
              this.masterDataService.getMasterBussiness(),
              this.masterDataService.getDealer('01'),
              this.masterDataService.MPLS_getbrand(),
              this.masterDataService.MPLS_getmodel(),
              this.masterDataService.getMasterProvince()
            ]).subscribe(async (res) => {
              // console.log(`this is master Data : ${JSON.stringify(res)}`)
              // === set master to variable ===

              const priceincludevatValue = this.productForm.controls.detailForm.controls.priceincludevatField.value
              if (!priceincludevatValue) {
                this.productForm.controls.detailForm.controls.priceincludevatField.setValue(0)
              }

              // *** province master ****
              if (res[4]) {
                this.masterProvinceList = res[4]
              }

              // *** bussiness ***
              if (res[0]) {
                this.bussinessList = res[0].data
                this.productForm.controls.detailForm.controls.bussinessCode.valueChanges.subscribe((value) => {

                  // *** set filterbrandlist (08/04/2023) ****
                  this.filterDealerList = of(res[1].data)

                  if (recordExists) {
                    this.trigger_bussinesscode.emit(false)
                  }

                  // *** set bussiness name by bussiness code (03/04/2023) ***
                  const busi_name_value = this.bussinessList.find((res) => res.bussiness_code == value)
                  this.productForm.controls.detailForm.controls.bussinessName.setValue(busi_name_value?.bussiness_name ?? '')

                  // *** check is checker or dealer (for dealer not clear dealercode when bussiness code value change) (03/04/2023) ***
                  const sessionData = this.userSessionQuotation
                  // sessionData.value.channal == 'checker' ? this.detailForm.controls.dealerCode.setValue('', { emitEvent: false }) : null
                  // *** switch check channal checker and dealer (replace on up line) (13/07/2023) ***

                  switch (sessionData.value.channal) {
                    case 'checker':
                      this.productForm.controls.detailForm.controls.dealerCode.setValue('', { emitEvent: false })
                      this.dealerSelectText = of(this.getDealerNamebyCode('', this.dealerList))
                      break;
                    case 'dealer':
                      const dealer_seller_id = sessionData.value.SELLER_ID ? sessionData.value.SELLER_ID : ''
                      this.productForm.controls.detailForm.controls.dealerCode.setValue(dealer_seller_id, { emitEvent: false })
                      this.dealerSelectText = of(this.getDealerNamebyCode(dealer_seller_id, this.dealerList))
                      break;

                    default:
                      break;
                  }

                  // **** clear all form field when value of bussiness code change ****
                  this.detailForm.controls.carBrandField.setValue('', { emitEvent: false });
                  this.detailForm.controls.carBrandNameField.setValue('', { emitEvent: false });
                  this.detailForm.controls.carColorField.setValue('', { emitEvent: false });
                  this.detailForm.controls.carModelField.setValue('', { emitEvent: false });
                  this.detailForm.controls.carModelNameField.setValue('', { emitEvent: false });
                  this.detailForm.controls.chassisNoField.setValue('', { emitEvent: false });
                  // *** use switch condition check instead cause of fix in dealer case (comment on 13/07/2023) ***
                  // this.detailForm.controls.dealerCode.setValue('', { emitEvent: false });
                  this.detailForm.controls.downPaymentField.setValue(null, { emitEvent: false });
                  this.detailForm.controls.engineNoField.setValue('', { emitEvent: false });
                  this.detailForm.controls.factoryPriceValueField.setValue(null, { emitEvent: false });
                  this.detailForm.controls.insuranceCodeField.setValue('', { emitEvent: false });
                  this.detailForm.controls.insuranceNameField.setValue('', { emitEvent: false });
                  this.detailForm.controls.insurancePlanPriceField.setValue(null, { emitEvent: false });
                  this.detailForm.controls.insuranceYearField.setValue(null, { emitEvent: false });
                  this.detailForm.controls.insurerCodeField.setValue('', { emitEvent: false });
                  this.detailForm.controls.insurerNameField.setValue('', { emitEvent: false });
                  this.detailForm.controls.interestRateField.setValue(null, { emitEvent: false });
                  this.detailForm.controls.isincludeloanamount.setValue(null, { emitEvent: false });
                  this.detailForm.controls.loanAmountField.setValue(null, { emitEvent: false });
                  this.detailForm.controls.maxltvField.setValue('', { emitEvent: false });
                  this.detailForm.controls.paymentRoundCountValueField.setValue(null, { emitEvent: false });
                  this.detailForm.controls.paymentValueField.setValue(null, { emitEvent: false });
                  this.detailForm.controls.priceincludevatField.setValue(null, { emitEvent: false });
                  this.detailForm.controls.productValueField.setValue(null, { emitEvent: false });
                  this.detailForm.controls.runningchassisNoField.setValue('', { emitEvent: false });
                  this.detailForm.controls.runningengineNoField.setValue('', { emitEvent: false });
                  this.detailForm.controls.sizeModelField.setValue('', { emitEvent: false });
                  this.detailForm.controls.value1.setValue('', { emitEvent: false });
                  this.detailForm.controls.value2.setValue('', { emitEvent: false });
                  this.detailForm.controls.value3.setValue('', { emitEvent: false });
                  this.detailForm.controls.paymentValueField.setValue(null)
                  this.showpaymentvalue$.next(false)

                  this.secondHandCarForm.controls.model_year.setValue('', { emitEvent: false })
                  this.secondHandCarForm.controls.cc.setValue(null, { emitEvent: false })
                  this.secondHandCarForm.controls.reg_no.setValue('', { emitEvent: false })
                  this.secondHandCarForm.controls.grade_moto.setValue('', { emitEvent: false })
                  this.secondHandCarForm.controls.isovermaxltvField.setValue(false, { emitEvent: false })
                  this.secondHandCarForm.controls.overmaxltvreasonField.setValue('', { emitEvent: false })
                  this.secondHandCarForm.controls.grade_moto.setValue('', { emitEvent: false })
                  this.secondHandCarForm.controls.reg_date.setValue(null, { emitEvent: false })

                  // *** check bussiness code === 002 don't clear contract_ref value (30/05/2023) ***
                  if (value !== '002') {
                    this.secondHandCarForm.controls.contract_ref.setValue('', { emitEvent: false })
                  }
                  this.secondHandCarForm.controls.reg_mile.setValue(null, { emitEvent: false })
                  this.secondHandCarForm.controls.prov_name.setValue('', { emitEvent: false })
                  this.secondHandCarForm.controls.prov_code.setValue('', { emitEvent: false })

                  // === check value and show form by type of data ===enable
                  switch (value) {
                    case '001':
                      {
                        // *** รถมือหนึ่ง ***
                        this.show2ndHandMPLSBtn = false
                        this.showdealerfield = true
                        this.showgeneralcarinfovisible = true
                        this.showBrandModelLoan$ = of(false)
                        this.shwosecondhandcardetail = false
                        this.showPrice = false

                        this.productForm.controls.detailForm.controls.carBrandField.enable({ onlySelf: true, emitEvent: false })
                        this.productForm.controls.detailForm.controls.carModelField.enable({ onlySelf: true, emitEvent: false })
                        this.productForm.controls.detailForm.controls.engineNoField.enable({ onlySelf: true, emitEvent: false })
                        this.productForm.controls.detailForm.controls.runningengineNoField.enable({ onlySelf: true, emitEvent: false })
                        this.productForm.controls.detailForm.controls.chassisNoField.enable({ onlySelf: true, emitEvent: false })
                        this.productForm.controls.detailForm.controls.runningchassisNoField.enable({ onlySelf: true, emitEvent: false })
                        this.productForm.controls.detailForm.controls.carColorField.enable({ onlySelf: true, emitEvent: false })

                        this.productForm.controls.secondHandCarForm.controls.model_year.enable({ onlySelf: true, emitEvent: false })
                        this.productForm.controls.secondHandCarForm.controls.cc.enable({ onlySelf: true, emitEvent: false })
                        this.productForm.controls.secondHandCarForm.controls.prov_code.enable({ onlySelf: true, emitEvent: false })
                        this.productForm.controls.secondHandCarForm.controls.reg_date.enable({ onlySelf: true, emitEvent: false })
                        this.productForm.controls.secondHandCarForm.controls.reg_no.enable({ onlySelf: true, emitEvent: false })

                        this.lockbtncalculate$.next(true)
                        this.productForm.controls.detailForm.controls.paymentValueField.setValue(null, { emitEvent: false })
                        this.paymentvalue$.next(0);
                        this.out_stand = 0
                        this.showpaymentvalue$.next(false)

                        // *** unset Require to some field of second hand car (MPLS) with select new car ***
                        this.productForm.controls.secondHandCarForm.controls.reg_mile.setValidators(null)
                        this.productForm.controls.secondHandCarForm.controls.model_year.setValidators(null)
                        this.productForm.controls.secondHandCarForm.controls.cc.setValidators(null)
                        this.productForm.controls.secondHandCarForm.controls.reg_no.setValidators(null)
                        this.productForm.controls.secondHandCarForm.controls.reg_date.setValidators(null)
                        this.productForm.controls.secondHandCarForm.controls.contract_ref.setValidators(null)
                        this.productForm.controls.secondHandCarForm.controls.prov_name.setValidators(null)
                        this.productForm.controls.secondHandCarForm.controls.prov_code.setValidators(null)
                        this.productForm.controls.secondHandCarForm.updateValueAndValidity()

                        this.productForm.controls.detailForm.controls.engineNoField.setValidators(null)
                        this.productForm.controls.detailForm.controls.runningengineNoField.setValidators(null)
                        this.productForm.controls.detailForm.controls.chassisNoField.setValidators(null)
                        this.productForm.controls.detailForm.controls.runningchassisNoField.setValidators(null)
                        this.productForm.controls.detailForm.updateValueAndValidity()
                      }
                      break;
                    case '002':
                      {
                        // === รถมือสองจัดกลับ ===
                        // *** ค้นหาเลขทะเบียนแล้วเลือกรายการ นำค่า pass ค่าลง form ***
                        // *** โชว์ปุ่มค้นหารถมือสอง ****

                        (sessionData.value.channal !== 'checker' && value === '002') ? this.show2ndHandMPLSBtn = true : this.show2ndHandMPLSBtn = false

                        this.showdealerfield = true
                        this.showgeneralcarinfovisible = false
                        // this.showpaymentvalue$.next(false)

                        this.lockbtncalculate$.next(true)
                        this.productForm.controls.detailForm.controls.paymentValueField.setValue(null, { emitEvent: false })
                        this.paymentvalue$.next(0);
                        this.out_stand = 0
                        this.showpaymentvalue$.next(false)

                        // *** set Require to some field of second hand car (MPLS) ***
                        this.productForm.controls.secondHandCarForm.controls.reg_mile.setValidators(Validators.required)
                        this.productForm.controls.secondHandCarForm.controls.model_year.setValidators(Validators.required)
                        this.productForm.controls.secondHandCarForm.controls.cc.setValidators(Validators.required)
                        this.productForm.controls.secondHandCarForm.controls.reg_no.setValidators(Validators.required)
                        this.productForm.controls.secondHandCarForm.controls.reg_date.setValidators(Validators.required)
                        this.productForm.controls.secondHandCarForm.controls.prov_name.setValidators(Validators.required)
                        this.productForm.controls.secondHandCarForm.controls.prov_code.setValidators(Validators.required)
                        this.productForm.controls.secondHandCarForm.updateValueAndValidity()
                      }
                      break;
                    case '003':
                      {
                        // *** รถมือสองทั่วไป ***
                        this.show2ndHandMPLSBtn = false
                        this.showdealerfield = true
                        this.showgeneralcarinfovisible = true
                        this.showchassisandengine = true
                        this.shwosecondhandcardetail = true

                        this.productForm.controls.detailForm.controls.carBrandField.enable({ onlySelf: true, emitEvent: false })
                        this.productForm.controls.detailForm.controls.carModelField.enable({ onlySelf: true, emitEvent: false })
                        this.productForm.controls.detailForm.controls.engineNoField.enable({ onlySelf: true, emitEvent: false })
                        this.productForm.controls.detailForm.controls.runningengineNoField.enable({ onlySelf: true, emitEvent: false })
                        this.productForm.controls.detailForm.controls.chassisNoField.enable({ onlySelf: true, emitEvent: false })
                        this.productForm.controls.detailForm.controls.runningchassisNoField.enable({ onlySelf: true, emitEvent: false })
                        this.productForm.controls.detailForm.controls.carColorField.enable({ onlySelf: true, emitEvent: false })

                        this.productForm.controls.secondHandCarForm.controls.model_year.enable({ onlySelf: true, emitEvent: false })
                        this.productForm.controls.secondHandCarForm.controls.cc.enable({ onlySelf: true, emitEvent: false })
                        this.productForm.controls.secondHandCarForm.controls.prov_code.enable({ onlySelf: true, emitEvent: false })
                        this.productForm.controls.secondHandCarForm.controls.reg_date.enable({ onlySelf: true, emitEvent: false })
                        this.productForm.controls.secondHandCarForm.controls.reg_no.enable({ onlySelf: true, emitEvent: false })

                        this.lockbtncalculate$.next(true)
                        this.productForm.controls.detailForm.controls.paymentValueField.setValue(null, { emitEvent: false })
                        this.paymentvalue$.next(0);
                        this.out_stand = 0
                        this.showpaymentvalue$.next(false)

                        // *** set Require to some field of second hand car (normal) ***
                        this.productForm.controls.secondHandCarForm.controls.reg_mile.setValidators(Validators.required)
                        this.productForm.controls.secondHandCarForm.controls.model_year.setValidators(Validators.required)
                        this.productForm.controls.secondHandCarForm.controls.cc.setValidators(Validators.required)
                        this.productForm.controls.secondHandCarForm.controls.reg_no.setValidators(Validators.required)
                        this.productForm.controls.secondHandCarForm.controls.reg_date.setValidators(Validators.required)
                        this.productForm.controls.secondHandCarForm.controls.prov_name.setValidators(Validators.required)
                        this.productForm.controls.secondHandCarForm.controls.prov_code.setValidators(Validators.required)
                        this.productForm.controls.secondHandCarForm.updateValueAndValidity()

                        this.productForm.controls.detailForm.controls.engineNoField.setValidators(Validators.required)
                        this.productForm.controls.detailForm.controls.runningengineNoField.setValidators(Validators.required)
                        this.productForm.controls.detailForm.controls.chassisNoField.setValidators(Validators.required)
                        this.productForm.controls.detailForm.controls.runningchassisNoField.setValidators(Validators.required)
                        this.productForm.controls.detailForm.updateValueAndValidity()
                      }
                      break;

                    default:
                      break;
                  }

                })
              }

              // *** dealer ***
              if (res[1]) {
                this.dealerList = res[1].data
                // === set validate format dealer code === 
                this.productForm.controls.detailForm.controls.dealerCode.setValidators(this.validateDealerformat(this.dealerList))
                this.productForm.controls.detailForm.controls.dealerCode.valueChanges.pipe(
                  startWith(''),
                  map(value => {

                    // *** check dealer grade (09/05/2023) ***

                    this.masterDataService.getDealergrade(value ? value : ``).subscribe({
                      next: (resultDealerGrade) => {
                        if (resultDealerGrade.status === 200) {
                          if (resultDealerGrade.data.active_notice == 'Y') {


                            let userdata = localStorage.getItem('currentUser');
                            if (userdata) {

                              const userdataObj = (JSON.parse(userdata) as IUserToken).data;
                              if (userdataObj.channal === 'checker') {

                                // *** check image contain data ****
                                if (resultDealerGrade.data.notice_image.data.length !== 0) {

                                  // *** check trigger when field contain value (14/07/2023) ***
                                  if (this.productForm.controls.detailForm.controls.dealerCode.value) {
                                    this.imageUtilService.getUrlImage(resultDealerGrade.data.notice_image.data).then(imageurldealergrade => {
                                      // *** show dialog of image dealer grade ***
                                      if (!this.isDialogOpen) {
                                        this.isDialogOpen = true; // Set the flag to indicate that the dialog is open
                                        // Open the dialog
                                        this.dialog.open(DealerGradeImageDialogComponent, {
                                          disableClose: true,
                                          width: `500`,
                                          height: `700`,
                                          data: {
                                            imageurl: imageurldealergrade
                                          }
                                        }).afterClosed().subscribe((res_dealer_grage_dialog_close) => {
                                          this.isDialogOpen = false; // Reset the flag when the dialog is closed
                                        })
                                      }
                                    })
                                  }

                                }

                              }
                            }
                          }
                        }
                      }, error: (e) => {

                      }, complete: () => {

                      }
                    })

                    // ***************************************

                    return value
                  }),
                  map(value => this._filterDealer(value))
                ).subscribe(async (value: IResMasterDealerData[]) => {

                  this.filterDealerList = of(value)

                  const selectValue = this.dealerList.find((items: { dl_code: string }) => {
                    return items.dl_code === value[0].dl_code
                  })

                  if (typeof selectValue !== 'undefined') {
                    // === set text of dealer select === 
                    this.dealerSelectText = of(selectValue.dl_name);
                  }

                  this.productForm.controls.detailForm.controls.carModelField.setValue('', { emitEvent: false });
                  this.productForm.controls.detailForm.controls.carBrandField.setValue('', { emitEvent: false })
                  this.productForm.controls.detailForm.controls.insurerCodeField.setValue('', { emitEvent: false })
                  this.productForm.controls.detailForm.controls.insuranceYearField.setValue(null, { emitEvent: false })
                  this.productForm.controls.detailForm.controls.engineNoField.setValue('')
                  this.productForm.controls.detailForm.controls.runningengineNoField.setValue('', { emitEvent: false })
                  this.productForm.controls.detailForm.controls.chassisNoField.setValue('')
                  this.productForm.controls.detailForm.controls.runningchassisNoField.setValue('', { emitEvent: false })
                  this.productForm.controls.detailForm.controls.carColorField.setValue('', { emitEvent: false })

                  this.productForm.controls.secondHandCarForm.reset()
                  // this.checkChangeMaxValuePrice();
                  if (this.productForm.controls.detailForm.controls.bussinessCode.value === '002') {
                    if (this.productForm.controls.detailForm.controls.dealerCode.valid) {
                      // *** โชว์ปุ่มค้นหารถมือสอง ****
                      this.show2ndHandMPLSBtn = true
                    } else {
                      // *** ซ่อนปุ่มค้นหารถมือสอง ****
                      this.show2ndHandMPLSBtn = false
                    }
                  } else {

                    if (recordExists && (quoitem.cd_bussiness_code === '002')) {
                      if (this.productForm.controls.detailForm.controls.bussinessCode.value === '001' || this.productForm.controls.detailForm.controls.bussinessCode.value === '003') {
                        this.show2ndHandMPLSBtn = false
                      } else {
                        this.show2ndHandMPLSBtn = true
                      }
                    } else {
                      // *** ซ่อนปุ่มค้นหารถมือสอง ****
                      this.show2ndHandMPLSBtn = false
                    }
                  }
                })
              }

              // *** brand ***
              if (res[2]) {
                this.brandList = res[2].data
                this.productForm.controls.detailForm.controls.carBrandField.valueChanges.pipe(
                  startWith(''),
                  tap(async value => {
                    if (value) {
                      this.currentSelectBrand = this.brandList.filter((items: { brand_code: any; }) => {
                        return items.brand_code === value
                      });
                    } else {
                      this.currentSelectBrand = []
                    }
                  }),
                  map(value => this._filterBrand(value))
                ).subscribe(async (value: IResMasterBrandData[]) => {
                  this.filterBrandList = of(value)

                  // *** comment on 05/04/2023 use below code instead ***
                  // this.productForm.controls.detailForm.controls.carModelField.setValue(null, { emitEvent: false })
                  // this.productForm.controls.detailForm.controls.productValueField.setValue(null, { emitEvent: false })
                  // this.productForm.controls.detailForm.controls.factoryPriceValueField.setValue(null, { emitEvent: false })
                  // this.productForm.controls.detailForm.controls.interestRateField.setValue(null, { emitEvent: false })
                  // this.productForm.controls.detailForm.controls.paymentRoundCountValueField.setValue(null, { emitEvent: false })
                  // this.productForm.controls.detailForm.controls.insurerCodeField.setValue(null, { emitEvent: false })

                  // *** set more null field (secondhand car include) (05/04/2023) ***
                  this.detailForm.controls.carBrandNameField.setValue('', { emitEvent: false });
                  this.detailForm.controls.carColorField.setValue('', { emitEvent: false });
                  this.detailForm.controls.carModelField.setValue('', { emitEvent: false });
                  this.detailForm.controls.carModelNameField.setValue('', { emitEvent: false });
                  this.detailForm.controls.chassisNoField.setValue('', { emitEvent: false });
                  this.detailForm.controls.downPaymentField.setValue(null, { emitEvent: false });
                  this.detailForm.controls.engineNoField.setValue('', { emitEvent: false });
                  this.detailForm.controls.factoryPriceValueField.setValue(null, { emitEvent: false });
                  this.detailForm.controls.insuranceCodeField.setValue('', { emitEvent: false });
                  this.detailForm.controls.insuranceNameField.setValue('', { emitEvent: false });
                  this.detailForm.controls.insurancePlanPriceField.setValue(null, { emitEvent: false });
                  this.detailForm.controls.insuranceYearField.setValue(null, { emitEvent: false });
                  this.detailForm.controls.insurerCodeField.setValue('', { emitEvent: false });
                  this.detailForm.controls.insurerNameField.setValue('', { emitEvent: false });
                  this.detailForm.controls.interestRateField.setValue(null, { emitEvent: false });
                  this.detailForm.controls.isincludeloanamount.setValue(true, { emitEvent: false });
                  this.detailForm.controls.loanAmountField.setValue(null, { emitEvent: false });
                  this.detailForm.controls.maxltvField.setValue('', { emitEvent: false });
                  this.detailForm.controls.paymentRoundCountValueField.setValue(null, { emitEvent: false });
                  this.detailForm.controls.paymentValueField.setValue(null, { emitEvent: false });
                  this.detailForm.controls.priceincludevatField.setValue(null, { emitEvent: false });
                  this.detailForm.controls.productValueField.setValue(null, { emitEvent: false });
                  this.detailForm.controls.runningchassisNoField.setValue('', { emitEvent: false });
                  this.detailForm.controls.runningengineNoField.setValue('', { emitEvent: false });
                  this.detailForm.controls.sizeModelField.setValue('', { emitEvent: false });
                  this.detailForm.controls.value1.setValue('', { emitEvent: false });
                  this.detailForm.controls.value2.setValue('', { emitEvent: false });
                  this.detailForm.controls.value3.setValue('', { emitEvent: false });
                  this.detailForm.controls.paymentValueField.setValue(null)
                  this.showpaymentvalue$.next(false)

                  this.secondHandCarForm.controls.model_year.setValue('', { emitEvent: false })
                  this.secondHandCarForm.controls.cc.setValue(null, { emitEvent: false })
                  this.secondHandCarForm.controls.reg_no.setValue('', { emitEvent: false })
                  this.secondHandCarForm.controls.grade_moto.setValue('', { emitEvent: false })
                  this.secondHandCarForm.controls.isovermaxltvField.setValue(false, { emitEvent: false })
                  this.secondHandCarForm.controls.overmaxltvreasonField.setValue('', { emitEvent: false })
                  this.secondHandCarForm.controls.reg_date.setValue(null, { emitEvent: false })
                  // *** check bussiness code === 002 don't clear contract_ref value (30/05/2023) ***
                  // this.secondHandCarForm.controls.contract_ref.setValue('', { emitEvent: false })
                  this.secondHandCarForm.controls.reg_mile.setValue(null, { emitEvent: false })
                  this.secondHandCarForm.controls.prov_name.setValue('', { emitEvent: false })
                  this.secondHandCarForm.controls.prov_code.setValue('', { emitEvent: false })

                  this.maxlvtmessage$ = of('');

                  this.rateSelect = [];
                  this.paymentCountSelect = [];

                  // **** user this.currentSelectBrand instead of value (30/05/2023) ***
                  const selectValue = this.currentSelectBrand
                  if (selectValue.length !== 0) {
                    this.modelSelect = this.modelList.filter((items: { brand_code: any; }) => {
                      return items.brand_code === selectValue[0].brand_code
                    }
                    );

                    if (this.modelSelect.length !== 0) {
                      this.productForm.controls.detailForm.controls.carModelField.enable({ emitEvent: false });
                      this.filterModelList = this.productForm.controls.detailForm.controls.carModelField.valueChanges.pipe(
                        startWith(''),
                        map(value => this._filterModel(value))
                      )

                      // === set text of brand select === 
                      this.brandSelectText = of(this.modelSelect[0].brand_name);
                    } else {

                      // === set child list (model) === 
                      this.modelListFilter = this.modelList.filter((items: { brand_code: string }) => {
                        return items.brand_code === selectValue[0].brand_code
                      })

                      this.productForm.controls.detailForm.controls.carModelField.setValue('')
                      this.productForm.controls.detailForm.controls.carModelField.disable();
                    }

                    // === set child list (model) === 
                    this.modelListFilter = this.modelList.filter((items: { brand_code: string }) => {
                      return items.brand_code === selectValue[0].brand_code
                    })

                    // === set validate Brand === 

                    this.productForm.controls.detailForm.controls.carModelField.setValidators(this.validateModelformat(this.modelListFilter))
                    this.productForm.controls.detailForm.controls.carModelField.setValue('')
                    this.productForm.controls.detailForm.controls.carModelField.enable({ emitEvent: false })
                    this.showBrandModelLoan$ = of(false)

                    // === stamp car brand by code ===

                    console.log(`this is brandList before error : ${JSON.stringify(this.brandList)}`)
                    if (this.brandList && this.brandList.length !== 0) {
                      const result = this.brandList.find((x: { brand_code: string; }) => x.brand_code === selectValue[0].brand_code);
                      if (result) {
                        const carBrandNameSelect = result.brand_name
                        if (carBrandNameSelect) {
                          this.productForm.controls.detailForm.controls.carBrandNameField.setValue(carBrandNameSelect)
                        }
                      }
                    }

                  } else {
                    this.productForm.controls.detailForm.controls.carModelField.setValue('')
                    this.productForm.controls.detailForm.controls.carModelField.disable();
                    this.productForm.controls.detailForm.controls.carModelField.setValue('')
                    this.productForm.controls.detailForm.controls.carModelField.enable({ emitEvent: false })
                  }
                })
              }

              // *** model ***
              if (res[3]) {
                this.modelList = res[3].data
                this.productForm.controls.detailForm.controls.carModelField.valueChanges.pipe(
                  startWith(''),
                  tap(async value => {
                    this.currentSelectModel = this.modelList.filter((items: { model_code: any; }) => {
                      return items.model_code === value
                    })
                  }),
                  map(value => this._filterModel(value))
                ).subscribe(async (value: IResMasterModelData[]) => {
                  this.filterModelList = of(value)

                  // *** comment on 05/04/2023 use below code instead ***
                  // this.productForm.controls.detailForm.controls.interestRateField.enable()
                  // this.productForm.controls.detailForm.controls.interestRateField.setValue(null, { emitEvent: false })
                  // this.productForm.controls.detailForm.controls.paymentRoundCountValueField.setValue(null, { emitEvent: false })
                  // this.productForm.controls.detailForm.controls.insurerCodeField.setValue(null, { emitEvent: false })
                  // this.productForm.controls.detailForm.controls.productValueField.setValue(null, { emitEvent: false })
                  // this.productForm.controls.detailForm.controls.factoryPriceValueField.setValue(null, { emitEvent: false })
                  // this.productForm.controls.detailForm.controls.engineNoField.setValue(null, { emitEvent: false })
                  // this.productForm.controls.detailForm.controls.chassisNoField.setValue(null, { emitEvent: false })
                  // this.productForm.controls.detailForm.controls.runningengineNoField.setValue(null, { emitEvent: false })
                  // this.productForm.controls.detailForm.controls.runningchassisNoField.setValue(null, { emitEvent: false })
                  // this.productForm.controls.detailForm.controls.insuranceYearField.setValue(null, { emitEvent: false })
                  // this.productForm.controls.detailForm.controls.insurancePlanPriceField.setValue(null, { emitEvent: false })

                  // *** set more null field (secondhand car include) (05/04/2023) ***
                  this.detailForm.controls.carColorField.setValue('', { emitEvent: false });
                  this.detailForm.controls.chassisNoField.setValue('', { emitEvent: false });
                  this.detailForm.controls.downPaymentField.setValue(null, { emitEvent: false });
                  this.detailForm.controls.engineNoField.setValue('', { emitEvent: false });
                  this.detailForm.controls.factoryPriceValueField.setValue(null, { emitEvent: false });
                  this.detailForm.controls.insuranceCodeField.setValue('', { emitEvent: false });
                  this.detailForm.controls.insuranceNameField.setValue('', { emitEvent: false });
                  this.detailForm.controls.insurancePlanPriceField.setValue(null, { emitEvent: false });
                  this.detailForm.controls.insuranceYearField.setValue(null, { emitEvent: false });
                  this.detailForm.controls.insurerCodeField.setValue('', { emitEvent: false });
                  this.detailForm.controls.insurerNameField.setValue('', { emitEvent: false });
                  this.detailForm.controls.interestRateField.setValue(null, { emitEvent: false });
                  this.detailForm.controls.isincludeloanamount.setValue(true, { emitEvent: false });
                  this.detailForm.controls.loanAmountField.setValue(null, { emitEvent: false });
                  this.detailForm.controls.maxltvField.setValue('', { emitEvent: false });
                  this.detailForm.controls.paymentRoundCountValueField.setValue(null, { emitEvent: false });
                  this.detailForm.controls.paymentValueField.setValue(null, { emitEvent: false });
                  this.detailForm.controls.priceincludevatField.setValue(null, { emitEvent: false });
                  this.detailForm.controls.productValueField.setValue(null, { emitEvent: false });
                  this.detailForm.controls.runningchassisNoField.setValue('', { emitEvent: false });
                  this.detailForm.controls.runningengineNoField.setValue('', { emitEvent: false });
                  this.detailForm.controls.sizeModelField.setValue('', { emitEvent: false });
                  this.detailForm.controls.value1.setValue('', { emitEvent: false });
                  this.detailForm.controls.value2.setValue('', { emitEvent: false });
                  this.detailForm.controls.value3.setValue('', { emitEvent: false });
                  this.detailForm.controls.paymentValueField.setValue(null)
                  this.showpaymentvalue$.next(false)

                  this.secondHandCarForm.controls.model_year.setValue('', { emitEvent: false })
                  this.secondHandCarForm.controls.cc.setValue(null, { emitEvent: false })
                  this.secondHandCarForm.controls.reg_no.setValue('', { emitEvent: false })
                  this.secondHandCarForm.controls.grade_moto.setValue('', { emitEvent: false })
                  this.secondHandCarForm.controls.isovermaxltvField.setValue(false, { emitEvent: false })
                  this.secondHandCarForm.controls.overmaxltvreasonField.setValue('', { emitEvent: false })
                  // this.secondHandCarForm.controls.reg_date.setValue(null, { emitEvent: false })
                  this.secondHandCarForm.controls.reg_date.setValue(null)
                  // *** check bussiness code === 002 don't clear contract_ref value (30/05/2023) ***
                  // this.secondHandCarForm.controls.contract_ref.setValue('', { emitEvent: false })
                  this.secondHandCarForm.controls.reg_mile.setValue(null, { emitEvent: false })
                  this.secondHandCarForm.controls.prov_name.setValue('', { emitEvent: false })
                  this.secondHandCarForm.controls.prov_code.setValue('', { emitEvent: false })


                  this.coverage = 0
                  this.factoryprice = 0

                  // const selectValue = value
                  // *** user this.currentSelectModel instead of value (30/05/2023) ***
                  const selectValue = this.currentSelectModel
                  if (selectValue.length !== 0) {

                    // ==== get model price from model select value ===
                    let modelprice = this.modelListFilter.filter((items: { model_code: any; brand_code: any }) => {
                      return items.model_code === selectValue[0].model_code && items.brand_code === this.productForm.controls.detailForm.controls.carBrandField.value
                    })


                    /// ==== set price (productValueField) from master of model code ==== 
                    if (modelprice.length === 1) {
                      // === set text of model select === 
                      this.modelSelectText = of(modelprice[0].model);
                      const valuePrice = modelprice[0].price
                      this.productForm.controls.detailForm.controls.productValueField.setValue(valuePrice)
                      this.productForm.controls.detailForm.controls.factoryPriceValueField.setValue(valuePrice)

                      // === set chassis and engine to field (29/08/2022) ===
                      this.productForm.controls.detailForm.controls.engineNoField.setValue(modelprice[0].engine_no)
                      this.productForm.controls.detailForm.controls.chassisNoField.setValue(modelprice[0].chassis_no)

                      // ==== use loan_amont instead of factory_price when bussi code == '002' ===
                      let priceForCalTotalloss = this.productForm.controls.detailForm.controls.factoryPriceValueField.value ? this.productForm.controls.detailForm.controls.factoryPriceValueField.value : 0
                      if (this.productForm.controls.detailForm.controls.bussinessCode.value === '002') {
                        priceForCalTotalloss = this.productForm.controls.detailForm.controls.loanAmountField.value ? this.productForm.controls.detailForm.controls.loanAmountField.value : 0
                      }

                      //=== call max lvt vaue === 
                      const resultMaxLtv = await lastValueFrom(this.masterDataService.getMaxLtv(
                        // valuePrice,
                        priceForCalTotalloss,
                        this.productForm.controls.detailForm.controls.bussinessCode.value ? this.productForm.controls.detailForm.controls.bussinessCode.value : '',
                        '01',
                        this.productForm.controls.detailForm.controls.carBrandField.value ? this.productForm.controls.detailForm.controls.carBrandField.value : '',
                        selectValue[0].model_code,
                        this.productForm.controls.detailForm.controls.dealerCode.value ? this.productForm.controls.detailForm.controls.dealerCode.value : '',
                        this.productForm.controls.secondHandCarForm.controls.moto_year.value ? this.productForm.controls.secondHandCarForm.controls.moto_year.value : 0,
                        this.productForm.controls.secondHandCarForm.controls.contract_ref.value ? this.productForm.controls.secondHandCarForm.controls.contract_ref.value : ''

                      ))

                      console.log(`this is max ltv value : ${resultMaxLtv.data[0].maxltv}`)
                      const maxlvtnumber = (resultMaxLtv.data[0].maxltv ?? 0).toString();
                      const maxlvtsetFormat = this.numberWithCommas(resultMaxLtv.data[0].maxltv)
                      const maxlvttext = `(สูงสุด ${maxlvtsetFormat} บาท)`
                      this.maxltvValue$ = of(resultMaxLtv.data[0].maxltv)
                      this.maxltvValue = resultMaxLtv.data[0].maxltv
                      this.maxlvtmessage$ = of(maxlvttext)
                      this.maxltvCurrent = resultMaxLtv.data[0].maxltv

                      // === set max ltv field ===
                      this.productForm.controls.detailForm.controls.maxltvField.setValue(this.maxltvCurrent)


                      // === call insurance list value === 
                      // this.masterDataService.getInsuranceold2(maxlvtnumber).subscribe((insuranceResult) => {
                      //   this.InsuranceListTemp = insuranceResult.data
                      //   this.InsuranceList = this.InsuranceListTemp

                      //   // ==== filter repeat insurance form return value ====
                      //   this.InsuranceList = Array.from(new Set(this.InsuranceListTemp.map((a: { insurer_code: string }) => a.insurer_code)))
                      //     .map(insurer_code => {
                      //       return this.InsuranceListTemp.find((a: { insurer_code: string }) => a.insurer_code === insurer_code)
                      //     })
                      // })

                      // === new api of getInsurance (5 params : (factory_price, bussi_code, brand_code, model_code, dl_code)) ====
                      // *** stamp some temp param of getMaxLtv for call agiant when moto year change (handle secondhand car that bussiness_code = 003) (20/04/2023) *** 

                      this.valuepricetemp = valuePrice
                      this.selectModelCodeValueTemp = selectValue[0].model_code

                      // ==== use loan_amont instead of factory_price when bussi code == '002' ===

                      this.masterDataService.getInsurance(
                        // valuePrice,
                        priceForCalTotalloss,
                        this.productForm.controls.detailForm.controls.bussinessCode.value ? this.productForm.controls.detailForm.controls.bussinessCode.value : '',// '001', // bussi_code
                        this.productForm.controls.detailForm.controls.carBrandField.value ? this.productForm.controls.detailForm.controls.carBrandField.value : '',  // brand_code
                        selectValue[0].model_code, // model_code
                        this.productForm.controls.detailForm.controls.dealerCode.value ? this.productForm.controls.detailForm.controls.dealerCode.value : '' // dealer_code
                      ).subscribe((insuranceResult) => {
                        this.InsuranceListTemp = insuranceResult.data
                        this.InsuranceList = this.InsuranceListTemp

                        // ==== filter repeat insurance form return value ====
                        this.InsuranceList = Array.from(new Set(this.InsuranceListTemp.map((a: { insurer_code: string }) => a.insurer_code)))
                          .map(insurer_code => {
                            return this.InsuranceListTemp.find((a: { insurer_code: string }) => a.insurer_code === insurer_code)
                          })
                      })

                    }

                    if (selectValue[0].model_code) {
                      this.showPrice = true;
                      this.showchassisandengine = true
                    }


                    this.productForm.controls.detailForm.controls.interestRateField.enable({ emitEvent: false })
                    this.productForm.controls.detailForm.controls.paymentRoundCountValueField.enable({ emitEvent: false })

                    const bcSelect = this.productForm.controls.detailForm.controls.carBrandField.value
                    const bmSelect = this.productForm.controls.detailForm.controls.carModelField.value

                    // === get price from model select ==== 
                    let fPirce;
                    let modelPrice;
                    if (bmSelect) {

                      fPirce = this.modelSelect.filter((items: { brand_code: any; model_code: any }) => {
                        return items.brand_code == bcSelect && items.model_code == bmSelect
                      })


                      if (fPirce.length !== 0) {

                        modelPrice = fPirce[0].price;
                        console.log(`modelPrice : ${modelPrice}`)

                        // ==== set factory price to field ===
                        this.factoryprice = modelPrice

                        const valuePrice = modelprice[0].price

                        this.productForm.controls.detailForm.controls.factoryPriceValueField.setValue(valuePrice)
                      }

                    }

                    // ==== get Rate and PaymentCount select from service ==== 

                    const busicode = this.productForm.controls.detailForm.controls.bussinessCode.value

                    if (bcSelect && bmSelect && modelPrice) {

                      this.masterDataService.getSizeModel(
                        '01',
                        bcSelect,
                        bmSelect,
                        this.productForm.controls.detailForm.controls.dealerCode.value ? this.productForm.controls.detailForm.controls.dealerCode.value : '',
                        this.productForm.controls.detailForm.controls.bussinessCode.value ? this.productForm.controls.detailForm.controls.bussinessCode.value : '',
                        // '001',
                        modelPrice,
                        (busicode == '003' && this.productForm.controls.secondHandCarForm.controls.moto_year.value) ? this.productForm.controls.secondHandCarForm.controls.moto_year.value : ''
                      ).subscribe((result) => {
                        this.productForm.controls.detailForm.controls.sizeModelField.setValue(result.data[0].size);
                        // this.masterDataService.getTerm('01', result.data[0].size).subscribe((resPayment) => {
                        //   console.log(`sol1 : ${JSON.stringify(resPayment.data)}`)
                        //   this.paymentCountSelect = resPayment.data
                        //   this.masterDataService.getMasterRate('01', result.data[0].size).subscribe((resRate) => {
                        //     this.rateSelect = resRate.data

                        //     // === set quotaion lookup data if old record ===

                        //     if (this.quotationdatatemp.data) {
                        //       const quoitem = this.quotationdatatemp.data[0]
                        //       this.productForm.controls.detailForm.controls.interestRateField.setValue(quoitem.cd_interest_rate ?? null, { emitEvent: false })
                        //       this.productForm.controls.detailForm.controls.paymentRoundCountValueField.setValue(quoitem.cd_payment_round_count ?? null, { emitEvent: false })
                        //       this.showlistInsurancePlan();
                        //     }
                        //   })
                        // })

                        // === แก้ไขการเรียกข้อมูล term (จำนวนงวด) จาก paremeter ที่เพิ่มมาจาก net_finance และ rate ===

                        const bussinessCode = this.productForm.controls.detailForm.controls.bussinessCode.value ? this.productForm.controls.detailForm.controls.bussinessCode.value : ``
                        this.masterDataService.getMasterRate('01', result.data[0].size, bussinessCode).subscribe((resRate) => {
                          this.rateSelect = resRate.data
                          // === set quotaion lookup data if old record ===
                          if (this.quotationdatatemp.data) {
                            const quoitem = this.quotationdatatemp.data[0]
                            this.productForm.controls.detailForm.controls.interestRateField.setValue((quoitem.cd_interest_rate ? quoitem.cd_interest_rate : null), { emitEvent: false })
                            this.productForm.controls.detailForm.controls.paymentRoundCountValueField.setValue(quoitem.cd_payment_round_count ? quoitem.cd_payment_round_count : null, { emitEvent: false })
                            this.showlistInsurancePlan();
                          }
                        })

                      })

                    }

                    this.showBrandModelLoan$ = of(true);

                    // === stamp car model by code ===

                    const result = this.modelList.find((x: { model_code: string; }) => x.model_code === selectValue[0].model_code);
                    if (result) {
                      const carModelNameSelect = result.model
                      if (carModelNameSelect) {
                        this.productForm.controls.detailForm.controls.carModelNameField.setValue(carModelNameSelect)
                      }
                    }
                  }

                  // === stamp model year by model select (02/05/2023) ===
                  if (this.productForm.controls.detailForm.controls.carModelField.value) {
                    this.secondHandCarForm.controls.model_year.setValue(selectValue[0].model_year)
                    this.secondHandCarForm.controls.cc.setValue(selectValue[0].cc)
                  } else {
                    this.secondHandCarForm.controls.model_year.setValue('')
                    this.secondHandCarForm.controls.cc.setValue(null)
                  }
                })
              } else {
                // === Clear all temp (20/04/2023) ===

                this.valuepricetemp = 0
                this.selectModelCodeValueTemp = ''
              }

              // *** interestRateField ***
              this.productForm.controls.detailForm.controls.interestRateField.valueChanges.subscribe((res) => {
                this.productForm.controls.detailForm.controls.paymentValueField.setValue(null)
                this.showpaymentvalue$.next(false);
                this.paymentvalue$.next(0);
                this.out_stand = 0
                console.log(`chagne interestRateField`)
                this.checkforstamppaymentvalue();
                this.checkvalidpaymentCount();
              })

              // *** paymentRoundCountValueField ***
              this.productForm.controls.detailForm.controls.paymentRoundCountValueField.valueChanges.subscribe((res) => {
                this.productForm.controls.detailForm.controls.paymentValueField.setValue(null)
                this.showpaymentvalue$.next(false);
                this.paymentvalue$.next(0);
                this.out_stand = 0
                console.log(`chagne paymentRoundCountValueField`)
                this.checkforstamppaymentvalue();
              })

              // *** loanAmountField ***
              this.productForm.controls.detailForm.controls.loanAmountField.valueChanges.pipe(debounceTime(300)).subscribe(async (res) => {
                this.loanAmountFieldSubjet.next(res)

                // === clear payment value (31/05/2022) === 
                this.productForm.controls.detailForm.controls.paymentValueField.setValue(null)
                this.showpaymentvalue$.next(false);
                this.paymentvalue$.next(0);
                this.out_stand = 0
                const busicode = this.detailForm.controls.bussinessCode.value
                const reason = this.secondHandCarForm.controls.overmaxltvreasonField.value

                // === clear is over max ltv and over max ltv reason ===

                if (busicode === '002') {

                  // === business code == '002' ====
                  if (res) {
                    this.loadingService.showLoader()
                    // ==== เรียก getInsurance ใหม่เมื่อเงื่อนไข bussiness_code เป็น '002' ตลอดเพราะเปลี่ยนการคำนวนค่าประกันจากการส่งค่า factory price เป็น loan amount (06/09/2023) ====
                    this.masterDataService.getInsurance(
                      res,
                      this.productForm.controls.detailForm.controls.bussinessCode.value ? this.productForm.controls.detailForm.controls.bussinessCode.value : '',// '001', // bussi_code
                      this.productForm.controls.detailForm.controls.carBrandField.value ? this.productForm.controls.detailForm.controls.carBrandField.value : '',  // brand_code
                      // selectValue[0].model_code, // model_code
                      this.productForm.controls.detailForm.controls.carModelField.value ?? '',
                      this.productForm.controls.detailForm.controls.dealerCode.value ? this.productForm.controls.detailForm.controls.dealerCode.value : '' // dealer_code
                    ).subscribe({
                      next: (resinsurance) => {

                        if (resinsurance.data.length !== 0) {

                          this.productForm.controls.detailForm.controls.insurerCodeField.setValue(null)
                          this.productForm.controls.detailForm.controls.insuranceYearField.setValue(null)
                          this.productForm.controls.detailForm.controls.insurancePlanPriceField.setValue(null)
                          this.InsuranceListFilter = []

                          this.InsuranceListTemp = resinsurance.data
                          this.InsuranceList = this.InsuranceListTemp

                          // ==== filter repeat insurance form return value ====
                          this.InsuranceList = Array.from(new Set(this.InsuranceListTemp.map((a: { insurer_code: string }) => a.insurer_code)))
                            .map(insurer_code => {
                              return this.InsuranceListTemp.find((a: { insurer_code: string }) => a.insurer_code === insurer_code)
                            })
                        } else {
                          // === clear select insurance data when loan amount value change (06/09/2023)
                          this.InsuranceListTemp = []
                          this.InsuranceList = []
                          this.InsuranceListFilter = []

                          this.productForm.controls.detailForm.controls.insurerCodeField.setValue(null)
                          this.productForm.controls.detailForm.controls.insuranceYearField.setValue(null)
                          this.productForm.controls.detailForm.controls.insurancePlanPriceField.setValue(null)
                        }
                      }, error: (e) => {

                      }, complete: () => {

                      }
                    }).add(() => {
                      this.loadingService.hideLoader()

                      if (res <= this.maxltvValue) {
                        // === ไม่เกินยอดกู้ ====
                        this.isshowmaxltv = false
                        this.secondHandCarForm.controls.isovermaxltvField.setValidators(null)
                        this.secondHandCarForm.controls.overmaxltvreasonField.setValidators(null)
                        this.secondHandCarForm.controls.isovermaxltvField.setValue(false)
                        this.secondHandCarForm.controls.overmaxltvreasonField.setValue('', { emitEvent: false })
                      } else {
                        // === เกินยอดกู้ ====
                        this.isshowmaxltv = true
                        this.secondHandCarForm.controls.isovermaxltvField.setValidators(Validators.requiredTrue)
                        this.secondHandCarForm.controls.overmaxltvreasonField.setValidators(Validators.required)
                        this.secondHandCarForm.controls.isovermaxltvField.updateValueAndValidity({ emitEvent: false });
                        this.secondHandCarForm.controls.overmaxltvreasonField.updateValueAndValidity({ emitEvent: false });
                        if (reason) {
                          // === กรอกเหตุผลมาแล้ว =====
                          this.detailForm.controls.loanAmountField.setValidators(Validators.minLength(1));
                          this.detailForm.controls.loanAmountField.updateValueAndValidity({ emitEvent: false });
                        } else {
                          // === ไม่ได้กรอกเหตุผลมา
                          this.detailForm.controls.loanAmountField.setValidators([Validators.minLength(1), this.customMaxValidator.bind(this)]);
                          this.detailForm.controls.loanAmountField.updateValueAndValidity({ emitEvent: false });
                        }
                      }
                    })

                  }
                } else {
                  // === business code != '002' ===='
                  this.isshowmaxltv = false
                  this.secondHandCarForm.controls.isovermaxltvField.setValidators(null)
                  this.secondHandCarForm.controls.overmaxltvreasonField.setValidators(null)
                  this.secondHandCarForm.controls.isovermaxltvField.setValue(false)
                  this.secondHandCarForm.controls.overmaxltvreasonField.setValue('', { emitEvent: false })
                  this.detailForm.controls.loanAmountField.setValidators([Validators.minLength(1), this.customMaxValidator.bind(this)]);
                  this.detailForm.controls.loanAmountField.updateValueAndValidity({ emitEvent: false });
                }
                console.log(`chagne loanAmountField`)
                this.checkforstamppaymentvalue();
                this.checkvalidpaymentCount();
              })

              // *** insurerCodeField ***
              this.productForm.controls.detailForm.controls.insurerCodeField.valueChanges.subscribe((res) => {
                if (res) {
                  // === set Insurance Year === 
                  this.InsuranceListFilter = this.InsuranceListTemp.filter((items: { insurer_code: any; }) => {
                    return items.insurer_code === res
                  })

                  // ==== set name of insurer selelct field (25/05/2022) ====
                  const insurerName = this.InsuranceListFilter[0].insurer_name ? this.InsuranceListFilter[0].insurer_name : ''

                  this.productForm.controls.detailForm.controls.insurerNameField.setValue(insurerName)
                  this.showlistInsurancePlan();
                } else {

                  this.productForm.controls.detailForm.controls.insuranceYearField.setValue(null)
                  this.productForm.controls.detailForm.controls.insurancePlanPriceField.setValue(null)
                  this.coverage = 0
                }
              })

              // *** insuranceYearField *** 
              this.productForm.controls.detailForm.controls.insuranceYearField.valueChanges.subscribe(async (res) => {
                if (res) {

                  // ==== add validate point for require new calculate (29/08/2022) ==== 
                  console.log(`648 (insuranceYearField.valueChange: res: ${res})`)
                  this.productForm.controls.detailForm.controls.paymentValueField.setValue(null)
                  this.showpaymentvalue$.next(false);

                  // === set Insurance Plan ===
                  const yearInt = res

                  const insureselect = this.InsuranceListFilter.filter((value: { years_insur: any }) => {
                    return value.years_insur === yearInt
                  })

                  const priceValue = insureselect[0].premium_insur;
                  this.productForm.controls.detailForm.controls.insurancePlanPriceField.setValue(priceValue)
                  this.productForm.controls.detailForm.controls.insuranceCodeField.setValue(insureselect[0].insurance_code)
                  this.productForm.controls.detailForm.controls.insuranceNameField.setValue(insureselect[0].insurer_name + '(' + insureselect[0].insurance_code + ')')

                  // === set coverage total loss (29/08/2022) ====
                  // const resultCoveragetotalloss = await lastValueFrom(this.masterDataService.getcoverageTotalloss
                  //   (
                  //     this.productForm.controls.detailForm.controls.insuranceCodeField.value ? this.productForm.controls.detailForm.controls.insuranceCodeField.value : '',
                  //     this.maxltvCurrent
                  //   )
                  // )

                  // ==== use loan_amont instead of factory_price when bussi code == '002' ===
                  let priceForCalTotalloss = this.productForm.controls.detailForm.controls.factoryPriceValueField.value ? this.productForm.controls.detailForm.controls.factoryPriceValueField.value : 0
                  if (this.productForm.controls.detailForm.controls.bussinessCode.value === '002') {
                    priceForCalTotalloss = this.productForm.controls.detailForm.controls.loanAmountField.value ? this.productForm.controls.detailForm.controls.loanAmountField.value : 0
                  }

                  const resultCoveragetotalloss = await lastValueFrom(this.masterDataService.getcoverageTotalloss
                    (
                      this.productForm.controls.detailForm.controls.insuranceCodeField.value ? this.productForm.controls.detailForm.controls.insuranceCodeField.value : '',
                      // '001',
                      this.productForm.controls.detailForm.controls.bussinessCode.value ? this.productForm.controls.detailForm.controls.bussinessCode.value : '',
                      this.productForm.controls.detailForm.controls.carBrandField.value ? this.productForm.controls.detailForm.controls.carBrandField.value : '',
                      this.productForm.controls.detailForm.controls.carModelField.value ? this.productForm.controls.detailForm.controls.carModelField.value : '',
                      this.productForm.controls.detailForm.controls.dealerCode.value ? this.productForm.controls.detailForm.controls.dealerCode.value : '',
                      priceForCalTotalloss
                    )
                  )
                  this.coverage = resultCoveragetotalloss.data[0].coverage_total_loss ? resultCoveragetotalloss.data[0].coverage_total_loss : 0
                  console.log(`chagne insuranceYearField (have data , year : ${res})`)
                  this.checkforstamppaymentvalue();
                  this.checkvalidpaymentCount();

                } else {
                  // ==== clear price and payment value when year is null (25/05/2022) === 
                  this.productForm.controls.detailForm.controls.insurancePlanPriceField.setValue(null)
                  console.log('679 : (insuranceYearField.valueChange) no res')
                  this.productForm.controls.detailForm.controls.paymentValueField.setValue(null)
                }
              })

              // *** isincludeloanamount ***
              this.productForm.controls.detailForm.controls.isincludeloanamount.valueChanges.subscribe((res) => {
                console.log('686 : (isincludeloanamount.valueChange)')
                this.productForm.controls.detailForm.controls.paymentValueField.setValue(null)
                this.showpaymentvalue$.next(false);
                console.log(`chagne isincludeloanamount`)
                this.checkforstamppaymentvalue();
                this.checkvalidpaymentCount();
              })

              // *** reg_mile (03/04/2023) ***
              this.productForm.controls.secondHandCarForm.controls.reg_mile.valueChanges.subscribe((res) => {

                this.productForm.controls.detailForm.controls.paymentValueField.setValue(null)
                this.showpaymentvalue$.next(false);
                this.checkforstamppaymentvalue();

              })

              // *** model_year (04/04/2023) ****
              this.productForm.controls.secondHandCarForm.controls.model_year.valueChanges.subscribe((res) => {
                this.productForm.controls.detailForm.controls.paymentValueField.setValue(null)
                this.showpaymentvalue$.next(false);
                this.checkforstamppaymentvalue();
              })
              // *** cc (04/04/2023) ****
              this.productForm.controls.secondHandCarForm.controls.cc.valueChanges.subscribe((res) => {
                this.productForm.controls.detailForm.controls.paymentValueField.setValue(null)
                this.showpaymentvalue$.next(false);
                this.checkforstamppaymentvalue();
              })
              // *** reg_no (04/04/2023) ****
              this.productForm.controls.secondHandCarForm.controls.reg_no.valueChanges.subscribe((res) => {
                this.productForm.controls.detailForm.controls.paymentValueField.setValue(null)
                this.showpaymentvalue$.next(false);
                this.checkforstamppaymentvalue();
              })
              // *** reg_date (04/04/2023) ****
              this.productForm.controls.secondHandCarForm.controls.reg_date.valueChanges.subscribe(async (res) => {


                // *** chec moto year from valueChange in case of bussiness_code === '003' 

                if (res) {
                  if (this.productForm.controls.detailForm.controls.bussinessCode.value === '003') {
                    const motoyearresult = await lastValueFrom(this.masterDataService.MPLS_calculate_moto_year(res))

                    if (motoyearresult.status === 200) {
                      this.productForm.controls.secondHandCarForm.controls.moto_year.setValue(motoyearresult.data.moto_year)
                    } else {
                      this.dialog.open(MainDialogComponent, {
                        data: {
                          header: `ผิดพลาด`,
                          message: `ไม่สามารถคำนวณหาค่า Moto year ได้, กรุณาเลือกวันจดทะเบียนให้ถูกต้อง`,
                          button_name: `ปิด`
                        }
                      }).afterClosed().subscribe((res_dialog_close) => {
                        // *** clear reg_date with no trigger valueChange (19/04/2023) ****
                        this.productForm.controls.secondHandCarForm.controls.reg_date.setValue(null, { emitEvent: false })
                      })
                    }
                  }
                } else {
                  this.productForm.controls.secondHandCarForm.controls.moto_year.setValue(null)
                }


                this.productForm.controls.detailForm.controls.paymentValueField.setValue(null)
                this.showpaymentvalue$.next(false);
                this.checkforstamppaymentvalue();
              })

              // *** moto_year (19/04/2023) *** 
              // *** if (bussiness_code === '002' recieve this value from getsecondcar api , if (bussiness_code === '003' get this value from calcualte year from select reg_date field)) ***
              this.productForm.controls.secondHandCarForm.controls.moto_year.valueChanges.subscribe(async (res_moto_year) => {


                // *** calculate max ltv trigger when second hand car bussiness_code = '003' (require moto_year) ***

                if (this.productForm.controls.detailForm.controls.bussinessCode.value === `003`) {
                  if (res_moto_year) {

                    const busicode = this.productForm.controls.detailForm.controls.bussinessCode.value
                    const bcSelect = this.productForm.controls.detailForm.controls.carBrandField.value
                    const bmSelect = this.productForm.controls.detailForm.controls.carModelField.value
                    let modelprice = this.modelListFilter.filter((items: { model_code: any; brand_code: any }) => {
                      return items.model_code === this.productForm.controls.detailForm.controls.carModelField.value && items.brand_code === this.productForm.controls.detailForm.controls.carBrandField.value
                    })
                    // === get price from model select ==== 
                    let fPirce;
                    let modelPrice;
                    if (bmSelect) {

                      fPirce = this.modelSelect.filter((items: { brand_code: any; model_code: any }) => {
                        return items.brand_code === bcSelect && items.model_code === bmSelect
                      })


                      if (fPirce.length !== 0) {

                        modelPrice = fPirce[0].price;

                        // ==== set factory price to field ===
                        this.factoryprice = modelPrice

                        const valuePrice = modelprice[0].price

                        this.productForm.controls.detailForm.controls.factoryPriceValueField.setValue(valuePrice)
                      }

                    }

                    if (bcSelect && bmSelect && modelPrice) {
                      combineLatest([

                        // ==== bussi_code === '003' ====
                        this.masterDataService.getMaxLtv(
                          this.valuepricetemp,
                          this.productForm.controls.detailForm.controls.bussinessCode.value ? this.productForm.controls.detailForm.controls.bussinessCode.value : '',
                          '01',
                          this.productForm.controls.detailForm.controls.carBrandField.value ? this.productForm.controls.detailForm.controls.carBrandField.value : '',
                          this.selectModelCodeValueTemp,
                          this.productForm.controls.detailForm.controls.dealerCode.value ? this.productForm.controls.detailForm.controls.dealerCode.value : '',
                          this.productForm.controls.secondHandCarForm.controls.moto_year.value ? this.productForm.controls.secondHandCarForm.controls.moto_year.value : 0,
                          this.productForm.controls.secondHandCarForm.controls.contract_ref.value ? this.productForm.controls.secondHandCarForm.controls.contract_ref.value : ''
                        ),
                        this.masterDataService.getSizeModel(
                          '01',
                          this.productForm.controls.detailForm.controls.carBrandField.value ? this.productForm.controls.detailForm.controls.carBrandField.value : '',
                          this.productForm.controls.detailForm.controls.carModelField.value ? this.productForm.controls.detailForm.controls.carModelField.value : '',
                          this.productForm.controls.detailForm.controls.dealerCode.value ? this.productForm.controls.detailForm.controls.dealerCode.value : '',
                          this.productForm.controls.detailForm.controls.bussinessCode.value ? this.productForm.controls.detailForm.controls.bussinessCode.value : '',
                          // '001',
                          modelPrice,
                          (busicode === '003' && this.productForm.controls.secondHandCarForm.controls.moto_year.value) ? this.productForm.controls.secondHandCarForm.controls.moto_year.value : ''
                        )
                      ]).subscribe({
                        next: (res) => {
                          // *** res[0] = result getMaxLtv ***
                          // *** res[1] = result getSizeModel ***

                          if (res[0].data.length !== 0) {
                            // === getMaxLtv ====
                            const maxlvtsetFormat = this.numberWithCommas(res[0].data[0].maxltv)
                            const maxlvttext = `(สูงสุด ${maxlvtsetFormat} บาท)`
                            this.maxltvValue$ = of(res[0].data[0].maxltv)
                            this.maxltvValue = res[0].data[0].maxltv
                            this.maxlvtmessage$ = of(maxlvttext)
                            this.maxltvCurrent = res[0].data[0].maxltv

                            // === set max ltv field ===
                            this.productForm.controls.detailForm.controls.maxltvField.setValue(this.maxltvCurrent)
                          }

                          if (res[1].data.length !== 0) {
                            // === getSizeModel === 

                            this.productForm.controls.detailForm.controls.sizeModelField.setValue(res[1].data[0].size);
                            // === แก้ไขการเรียกข้อมูล term (จำนวนงวด) จาก paremeter ที่เพิ่มมาจาก net_finance และ rate ===

                            const bussinessCode = this.productForm.controls.detailForm.controls.bussinessCode.value ? this.productForm.controls.detailForm.controls.bussinessCode.value : ``
                            this.masterDataService.getMasterRate('01', res[1].data[0].size, bussinessCode).subscribe((resRate) => {
                              this.rateSelect = resRate.data
                              // === set quotaion lookup data if old record ===
                              if (this.quotationdatatemp.data) {
                                const quoitem = this.quotationdatatemp.data[0]
                                this.productForm.controls.detailForm.controls.interestRateField.setValue((quoitem.cd_interest_rate ? quoitem.cd_interest_rate : null), { emitEvent: false })
                                this.productForm.controls.detailForm.controls.paymentRoundCountValueField.setValue(quoitem.cd_payment_round_count ? quoitem.cd_payment_round_count : null, { emitEvent: false })
                                this.showlistInsurancePlan();
                              }
                            })
                          }
                        }
                      })
                    }

                  } else {
                    this.rateSelect = []
                    this.productForm.controls.detailForm.controls.interestRateField.setValue(null)
                  }
                }

              })


              // *** prov_code (04/04/2023) ****
              this.productForm.controls.secondHandCarForm.controls.prov_code.valueChanges.subscribe((res) => {

                // *** set Prov_name value ***
                const selectProv = this.masterProvinceList.data.find((item) => item.prov_code === res)
                if (selectProv) {
                  this.productForm.controls.secondHandCarForm.controls.prov_name.setValue(selectProv.prov_name, { emitEvent: false })
                }

                this.productForm.controls.detailForm.controls.paymentValueField.setValue(null)
                this.showpaymentvalue$.next(false);
                this.checkforstamppaymentvalue();
              })

              // *** old valueChange (general info) (04/04/2023) ***
              // *** engineNoField ****
              this.productForm.controls.detailForm.controls.engineNoField.valueChanges.subscribe((res) => {
                this.productForm.controls.detailForm.controls.paymentValueField.setValue(null)
                this.showpaymentvalue$.next(false);
                this.checkforstamppaymentvalue();
              })
              // *** runningengineNoField ****
              this.productForm.controls.detailForm.controls.runningengineNoField.valueChanges.subscribe((res) => {
                this.productForm.controls.detailForm.controls.paymentValueField.setValue(null)
                this.showpaymentvalue$.next(false);
                this.checkforstamppaymentvalue();
              })
              // *** chassisNoField ****
              this.productForm.controls.detailForm.controls.chassisNoField.valueChanges.subscribe((res) => {
                this.productForm.controls.detailForm.controls.paymentValueField.setValue(null)
                this.showpaymentvalue$.next(false);
                this.checkforstamppaymentvalue();
              })
              // *** runningchassisNoField ****
              this.productForm.controls.detailForm.controls.runningchassisNoField.valueChanges.subscribe((res) => {
                this.productForm.controls.detailForm.controls.paymentValueField.setValue(null)
                this.showpaymentvalue$.next(false);
                this.checkforstamppaymentvalue();
              })

              // *** overmaxltvreasonField ****
              this.secondHandCarForm.controls.overmaxltvreasonField.valueChanges.subscribe((value) => {
                const busicode = this.detailForm.controls.bussinessCode.value
                const loanAmount = this.detailForm.controls.loanAmountField.value

                if (busicode === '002') {
                  if (loanAmount) {
                    // ==== กรอกยอดกู้แล้ว ====
                    if (loanAmount <= this.maxltvValue) {
                      // === ไม่เกินยอดกู้ ====
                      this.isshowmaxltv = false
                      this.secondHandCarForm.controls.isovermaxltvField.setValidators(null)
                      this.secondHandCarForm.controls.overmaxltvreasonField.setValidators(null)
                      this.secondHandCarForm.controls.isovermaxltvField.setValue(false)
                      this.secondHandCarForm.controls.overmaxltvreasonField.setValue('', { emitEvent: false })
                    } else {
                      // === เกินยอดกู้ ====
                      this.isshowmaxltv = true
                      this.secondHandCarForm.controls.isovermaxltvField.setValidators(Validators.requiredTrue)
                      this.secondHandCarForm.controls.overmaxltvreasonField.setValidators(Validators.required)
                      this.secondHandCarForm.controls.isovermaxltvField.updateValueAndValidity({ emitEvent: false });
                      this.secondHandCarForm.controls.overmaxltvreasonField.updateValueAndValidity({ emitEvent: false });
                      if (value) {
                        // === กรอกเหตุผลมาแล้ว =====
                        this.detailForm.controls.loanAmountField.setValidators(Validators.minLength(1));
                        this.detailForm.controls.loanAmountField.updateValueAndValidity({ emitEvent: false });
                      } else {
                        // === ไม่ได้กรอกเหตุผลมา
                        this.detailForm.controls.loanAmountField.setValidators([Validators.minLength(1), this.customMaxValidator.bind(this)]);
                        this.detailForm.controls.loanAmountField.updateValueAndValidity({ emitEvent: false });
                      }
                    }


                  } else {
                    // ==== ยังไม่กรอกยอดกู้ ====
                    this.isshowmaxltv = false
                    if (value) {
                      this.detailForm.controls.loanAmountField.clearValidators();
                      this.detailForm.controls.loanAmountField.setValidators([Validators.minLength(1)]);
                      this.detailForm.controls.loanAmountField.updateValueAndValidity({ emitEvent: false });
                    } else {
                      this.detailForm.controls.loanAmountField.setValidators([Validators.minLength(1), this.customMaxValidator.bind(this)]);
                      this.detailForm.controls.loanAmountField.updateValueAndValidity({ emitEvent: false });
                    }
                  }

                } else {
                  this.isshowmaxltv = false
                  this.detailForm.controls.loanAmountField.setValidators([Validators.minLength(1)]);
                  this.detailForm.controls.loanAmountField.updateValueAndValidity({ emitEvent: false });

                }
              });





              // ==== new check MPLS record already exits ====

              // *** check for stamp record data to form ====
              if (!recordExists) {
                // === no record exist ===

                // === set default isincludeloanamount to ture (25/04/2023) ===
                this.detailForm.controls.isincludeloanamount.setValue(true, { emitEvent: false });

                // // === stamp dealer code ==== 
                const sessionData = this.userSessionQuotation
                // === checker ===
                if (sessionData.value.channal == 'checker') {
                  if (quoitem.sl_code) {
                    // *** comment this line on 10/07/2023 ***
                    // this.productForm.controls.detailForm.controls.dealerCode.setValue(quoitem.sl_code);
                    this.productForm.controls.detailForm.controls.dealerCode.setValue(quoitem.sl_code, { emitEvent: false })
                    this.dealerSelectText = of(this.getDealerNamebyCode(quoitem.sl_code, this.dealerList))
                  }
                } else {
                  // === store ==== 
                  if (this.userSessionQuotation.value.SELLER_ID) {
                    this.productForm.controls.detailForm.controls.dealerCode.setValue(this.userSessionQuotation.value.SELLER_ID, { emitEvent: false });
                    this.dealerSelectText = of(this.getDealerNamebyCode(this.userSessionQuotation.value.SELLER_ID, this.dealerList))
                    this.productForm.controls.detailForm.controls.dealerCode.disable();
                  }
                }
              } else {

                // === already have record (have quo_key_app_id) ===
                // === load and call master data ===


                // === parameter for call api master === 

                // === second hand car field (03/04/2023) ===
                const qbussinesscode = quoitem.cd_bussiness_code ?? '';
                const qmodelyear = quoitem.cd_model_year ?? '';
                const qcc = quoitem.cd_cc ?? null;
                const qregno = quoitem.cd_reg_no ?? '';
                const qgrade = quoitem.cd_grade ?? '';
                const qregdate = quoitem.cd_reg_date ?? null;
                const clinet_format_qregdate = quoitem.cd_reg_date ? this.changeDateFormat(quoitem.cd_reg_date) : null;
                const qcontractref = quoitem.cd_contract_ref ?? '';
                const qregmile = quoitem.cd_reg_mile ?? '';
                const qprovcode = quoitem.cd_prov_code ?? '';
                const qprovname = quoitem.cd_prov_name ?? '';

                const qcarbrandcode = quoitem.cd_brand_code ?? '';
                const qcarbrandname = quoitem.cd_brand_name ?? '';
                const qcarmodelcode = quoitem.cd_model_code ?? '';
                const qcarmodelname = quoitem.cd_model_name ?? '';
                const qcolor = quoitem.cd_color_name ?? '';
                const qcarmodel = quoitem.cd_model_code ?? '';
                const qsizemodel = quoitem.cd_size_model ?? '';
                const qfactoryprice = quoitem.cd_factory_price ?? null;
                const qrate = quoitem.cd_interest_rate ?? null;
                const qterm = quoitem.cd_payment_round_count ?? null;
                const qisincludealoneamount = quoitem.cd_is_include_loanamount ? true : false;
                const qloanamount = quoitem.cd_loan_amount ?? null
                const qinsureplanpricevalue = quoitem.cd_insurance_plan_price ?? null
                const qinsurercode = quoitem.cd_insurer_code ?? '';
                const qinsurername = quoitem.cd_insurer_name ?? '';
                const qinsurancecode = quoitem.cd_insurance_code ?? '';
                const qinsurancename = quoitem.cd_insurance_name ?? '';
                const qinsuranceyear = quoitem.cd_insurance_year ?? null;
                const qinsuranceplan = quoitem.cd_insurance_plan_price ?? null;
                const qpaymentvalue = quoitem.cd_payment_value ?? null;
                const qslcode = quoitem.sl_code ?? '20220003'; // default seller code when null 
                // === new field value form total-loss phase (29/08/2022) === 
                const qcoveragetotalloss = quoitem.cd_coverage_total_loss // === still didn't use becasue effect old record === 
                const qmaxltv = quoitem.cd_max_ltv
                const qpriceincludevat = quoitem.cd_price_include_vat
                const qenginenumber = quoitem.cd_engine_number
                const qchassisnumber = quoitem.cd_chassis_number
                const qenginenorunning = quoitem.cd_engine_no_running
                const qchassisnorunning = quoitem.cd_chassis_no_running
                // === add parameter for change getinsurance from factory_price to max_ltv (24/08/2022) === 
                const qdealercode = quoitem.sl_code
                const qmotoyear = quoitem.cd_moto_year ? quoitem.cd_moto_year : 0
                // === over max ltv (bussiness code == '002') (25/08/2023) ===
                const qisovermaxltv = quoitem.cd_is_over_max_ltv === 'Y' ? true : false
                const qovermaxltvreason = quoitem.cd_over_max_ltv_reason ?? ''


                // === check form layout depend on bussiness code (03/04/2023) ===
                switch (qbussinesscode) {
                  case '001':
                    {
                      this.showdealerfield = true
                      this.showgeneralcarinfovisible = true
                      this.showBrandModelLoan$ = of(true)
                      this.shwosecondhandcardetail = false
                      this.showpaymentvalue$.next(true)

                      // *** unset Require to some field of second hand car (MPLS) with select new car ***
                      this.productForm.controls.secondHandCarForm.controls.reg_mile.setValidators(null)
                      this.productForm.controls.secondHandCarForm.controls.model_year.setValidators(null)
                      this.productForm.controls.secondHandCarForm.controls.cc.setValidators(null)
                      this.productForm.controls.secondHandCarForm.controls.reg_no.setValidators(null)
                      this.productForm.controls.secondHandCarForm.controls.reg_date.setValidators(null)
                      this.productForm.controls.secondHandCarForm.controls.contract_ref.setValidators(null)
                      this.productForm.controls.secondHandCarForm.controls.prov_name.setValidators(null)
                      this.productForm.controls.secondHandCarForm.controls.prov_code.setValidators(null)
                      this.productForm.controls.secondHandCarForm.updateValueAndValidity()
                    }
                    break;
                  case '002':
                    {
                      this.showdealerfield = true
                      this.showgeneralcarinfovisible = true
                      this.showBrandModelLoan$ = of(true)
                      this.shwosecondhandcardetail = true
                      this.showpaymentvalue$.next(true)

                      // *** set Require to some field of second hand car (MPLS) ***
                      this.productForm.controls.secondHandCarForm.controls.reg_mile.setValidators(Validators.required)
                      this.productForm.controls.secondHandCarForm.controls.model_year.setValidators(Validators.required)
                      this.productForm.controls.secondHandCarForm.controls.cc.setValidators(Validators.required)
                      this.productForm.controls.secondHandCarForm.controls.reg_no.setValidators(Validators.required)
                      this.productForm.controls.secondHandCarForm.controls.reg_date.setValidators(Validators.required)
                      this.productForm.controls.secondHandCarForm.controls.prov_name.setValidators(Validators.required)
                      this.productForm.controls.secondHandCarForm.controls.prov_code.setValidators(Validators.required)
                      this.productForm.controls.secondHandCarForm.updateValueAndValidity()
                    }
                    break;
                  case '003':
                    {
                      // waiting ...
                      this.showdealerfield = true
                      this.showgeneralcarinfovisible = true
                      this.showBrandModelLoan$ = of(true)
                      this.shwosecondhandcardetail = true
                      this.showpaymentvalue$.next(true)

                      // *** set Require to some field of second hand car (MPLS) ***
                      this.productForm.controls.secondHandCarForm.controls.reg_mile.setValidators(Validators.required)
                      this.productForm.controls.secondHandCarForm.controls.model_year.setValidators(Validators.required)
                      this.productForm.controls.secondHandCarForm.controls.cc.setValidators(Validators.required)
                      this.productForm.controls.secondHandCarForm.controls.reg_no.setValidators(Validators.required)
                      this.productForm.controls.secondHandCarForm.controls.reg_date.setValidators(Validators.required)
                      this.productForm.controls.secondHandCarForm.controls.prov_name.setValidators(Validators.required)
                      this.productForm.controls.secondHandCarForm.controls.prov_code.setValidators(Validators.required)
                      this.productForm.controls.secondHandCarForm.updateValueAndValidity()

                      this.productForm.controls.detailForm.controls.engineNoField.setValidators(Validators.required)
                      this.productForm.controls.detailForm.controls.runningengineNoField.setValidators(Validators.required)
                      this.productForm.controls.detailForm.controls.chassisNoField.setValidators(Validators.required)
                      this.productForm.controls.detailForm.controls.runningchassisNoField.setValidators(Validators.required)
                      this.productForm.controls.detailForm.updateValueAndValidity()
                    }
                    break;

                  default:
                    break;
                }

                // === unlock field === 
                if (qrate) this.productForm.controls.detailForm.controls.interestRateField.enable({ emitEvent: false });
                // if (qterm) this.productForm.controls.detailForm.controls.paymentRoundCountValueField.enable();
                // if (qinsuranceplan) this.productForm.controls.detailForm.controls.inssurancePlanPriceField.enable();

                this.productForm.controls.detailForm.controls.carModelField.setValue(quoitem.cd_model_code ?? '', { emitEvent: false })


                if (qfactoryprice && qcarbrandcode && qcarmodel && qterm && qsizemodel && qloanamount && qinsureplanpricevalue && qrate) {


                  const resultRateMaster = await lastValueFrom(this.masterDataService.getMasterRate(`01`, qsizemodel, qbussinesscode));

                  // ==== change parameter for get insurance from factory_price to max_ltv (24/08/2022) ===

                  // ==== use loan_amont instead of factory_price when bussi code == '002' ===
                  let priceForCalTotalloss_ = (qbussinesscode === '002') ? qloanamount : qfactoryprice;


                  const resultMaxLtv = await lastValueFrom(this.masterDataService.getMaxLtv(
                    priceForCalTotalloss_,
                    // qfactoryprice,
                    qbussinesscode, // '001',
                    '01',
                    qcarbrandcode,
                    qcarmodelcode,
                    qdealercode,
                    qmotoyear,
                    qcontractref
                  ))
                  // this.maxltvCurrent = resultMaxLtv.data[0].maxltv

                  console.log(`this is max ltv value : ${resultMaxLtv.data[0].maxltv}`)
                  const maxlvtnumber = (resultMaxLtv.data[0].maxltv ?? 0).toString();
                  const maxlvtsetFormat = this.numberWithCommas(resultMaxLtv.data[0].maxltv)
                  const maxlvttext = `(สูงสุด ${maxlvtsetFormat} บาท)`
                  this.maxltvValue = resultMaxLtv.data[0].maxltv
                  this.maxlvtmessage$ = of(maxlvttext)
                  this.maxltvCurrent = resultMaxLtv.data[0].maxltv

                  // ==== show all condition validtor === 
                  this.showPrice = true;
                  this.showchassisandengine = true
                  this.showBrandModelLoan$ = of(true);
                  this.showInsuranceSelect$ = of(true);

                  // === set max ltv field (29/08/2022) ===
                  this.productForm.controls.detailForm.controls.maxltvField.setValue(this.maxltvCurrent)

                  // const resultInsuranceMaster = await lastValueFrom(this.masterDataService.getInsuranceold2((resultMaxLtv.data[0].maxltv.toString())));
                  // const resultInsuranceMaster = await lastValueFrom(this.masterDataService.getInsurance(qfactoryprice, '001', qcarbrandcode, qcarmodelcode, qdealercode));


                  const resultInsuranceMaster = await lastValueFrom(this.masterDataService.getInsurance(
                    // qfactoryprice,
                    priceForCalTotalloss_,
                    qbussinesscode,
                    qcarbrandcode,
                    qcarmodelcode,
                    qdealercode
                  ));

                  // === chage from getTerm to getTermNew 03/01/2023 ===
                  // const resultTerm = await lastValueFrom(this.masterDataService.getTerm(`01`, qsizemodel))

                  const net_finance = qloanamount + (qinsuranceplan ?? 0)
                  // const resultTerm = await lastValueFrom(this.masterDataService.getTermNew(`01`, qsizemodel, qrate, net_finance, '001'))
                  const resultTerm = await lastValueFrom(this.masterDataService.getTermNew(`01`, qsizemodel, qrate, net_finance, qbussinesscode))

                  let netfinance;
                  if (qisincludealoneamount) {
                    netfinance = qloanamount + qinsureplanpricevalue
                  } else {
                    netfinance = qloanamount
                  }

                  // === stop trigger bypass loading screen (27/10/2022) ===
                  this.loadingService.hideLoader

                  // ***==== Car Brand ====***

                  // === map api with return value ====
                  this.brandList = res[2].data
                  this.modelList = res[3].data


                  // === set model select 
                  this.modelSelect = this.modelList.filter((items: { brand_code: any; }) => {
                    return items.brand_code === qcarbrandcode
                  });

                  // === set text of brand select === 
                  this.brandSelectText = of(this.modelSelect[0].brand_name);

                  // === set child list (model) === 
                  this.modelListFilter = this.modelList.filter((items: { brand_code: any; }) => {
                    return items.brand_code === qcarbrandcode
                  })

                  // === set validate Brand (auto data stamp on this.quotationdatatemp) === 
                  this.productForm.controls.detailForm.controls.carModelField.setValidators(this.validateModelformat(this.modelListFilter))
                  // this.productForm.controls.detailForm.controls.carModelField.setValue('')
                  // this.productForm.controls.detailForm.controls.carModelField.enable({ emitEvent: false })

                  this.productForm.controls.detailForm.controls.carBrandNameField.setValue(qcarbrandname, { emitEvent: false })
                  this.productForm.controls.detailForm.controls.carBrandField.setValue(qcarbrandcode, { emitEvent: false });

                  // ***==== Car Model ====***

                  // ==== get model price from model select value ===
                  let modelprice = this.modelListFilter.filter((items: { model_code: any; brand_code: any }) => {
                    return items.model_code === qcarmodelcode && items.brand_code == this.productForm.controls.detailForm.controls.carBrandField.value
                  })
                  if (modelprice.length === 1) {
                    // === set text of model select === 
                    this.modelSelectText = of(modelprice[0].model);
                    const valuePrice = modelprice[0].price
                    this.productForm.controls.detailForm.controls.productValueField.setValue(valuePrice, { emitEvent: false })
                    this.productForm.controls.detailForm.controls.factoryPriceValueField.setValue(valuePrice, { emitEvent: false })

                    // === set chassis and engine to field (29/08/2022) ===
                    this.productForm.controls.detailForm.controls.engineNoField.setValue(modelprice[0].engine_no, { emitEvent: false })
                    this.productForm.controls.detailForm.controls.chassisNoField.setValue(modelprice[0].chassis_no, { emitEvent: false })

                  }
                  // ***===================***

                  this.rateSelect = resultRateMaster.data
                  this.paymentCountSelect = resultTerm.data
                  this.InsuranceListTemp = resultInsuranceMaster.data
                  this.InsuranceList = Array.from(new Set(resultInsuranceMaster.data.map((a: { insurer_code: string }) => a.insurer_code)))
                    .map(insurer_code => {
                      return resultInsuranceMaster.data.find((a: { insurer_code: string }) => a.insurer_code === insurer_code)
                    })
                  this.InsuranceListFilter = this.InsuranceListTemp.filter((items: { insurer_code: any; }) => {
                    return items.insurer_code === qinsurercode
                  })

                  // // === stamp dealer code ==== 
                  const sessionData = this.userSessionQuotation
                  // === checker ===
                  if (sessionData.value.channal === 'checker') {
                    if (quoitem.sl_code) {
                      this.productForm.controls.detailForm.controls.dealerCode.setValue(quoitem.sl_code, { emitEvent: false });
                      this.dealerSelectText = of(this.getDealerNamebyCode(quoitem.sl_code, this.dealerList))
                    }
                  } else {
                    // === store ==== 
                    if (this.userSessionQuotation.value.SELLER_ID) {
                      console.log(`trigger this : ${this.userSessionQuotation.value.SELLER_ID}`)
                      this.productForm.controls.detailForm.controls.dealerCode.setValue(this.userSessionQuotation.value.SELLER_ID, { emitEvent: false });
                      this.dealerSelectText = of(this.getDealerNamebyCode(this.userSessionQuotation.value.SELLER_ID, this.dealerList))
                      this.productForm.controls.detailForm.controls.dealerCode.disable();
                    }
                  }

                  // === stamp value to field ==== 
                  this.productForm.controls.detailForm.controls.bussinessCode.setValue(qbussinesscode, { emitEvent: false })
                  this.productForm.controls.detailForm.controls.dealerCode.setValue(qdealercode, { emitEvent: false })
                  this.dealerSelectText = of(this.getDealerNamebyCode(qdealercode, this.dealerList))
                  this.productForm.controls.detailForm.controls.carBrandField.setValue(qcarbrandcode, { emitEvent: false }); /// investigate on 13/03/2023
                  this.productForm.controls.detailForm.controls.carBrandNameField.setValue(qcarbrandname, { emitEvent: false });
                  this.productForm.controls.detailForm.controls.carModelField.setValue(qcarmodelcode, { emitEvent: false });
                  this.productForm.controls.detailForm.controls.carModelNameField.setValue(qcarmodelname, { emitEvent: false });
                  this.productForm.controls.detailForm.controls.carColorField.setValue(qcolor, { emitEvent: false });
                  this.productForm.controls.detailForm.controls.sizeModelField.setValue(qsizemodel, { emitEvent: false });
                  this.productForm.controls.detailForm.controls.loanAmountField.setValue(qloanamount, { emitEvent: false });
                  // this.productForm.controls.detailForm.controls.productValueField.setValue();
                  // this.productForm.controls.detailForm.controls.downPaymentField.setValue();
                  this.productForm.controls.detailForm.controls.interestRateField.setValue(qrate, { emitEvent: false });
                  this.productForm.controls.detailForm.controls.paymentRoundCountValueField.setValue(qterm, { emitEvent: false });
                  // === insurer code and name set (25/05/2022) === 
                  this.productForm.controls.detailForm.controls.insurerCodeField.setValue(qinsurercode, { emitEvent: false });
                  this.productForm.controls.detailForm.controls.insurerNameField.setValue(qinsurername, { emitEvent: false });
                  this.productForm.controls.detailForm.controls.insuranceCodeField.setValue(qinsurancecode, { emitEvent: false });
                  this.productForm.controls.detailForm.controls.insuranceNameField.setValue(qinsurancename, { emitEvent: false });
                  this.productForm.controls.detailForm.controls.insuranceYearField.setValue(qinsuranceyear, { emitEvent: false })
                  this.productForm.controls.detailForm.controls.insurancePlanPriceField.setValue(qinsuranceplan, { emitEvent: false });
                  this.productForm.controls.detailForm.controls.isincludeloanamount.setValue(qisincludealoneamount, { emitEvent: false });
                  // this.productForm.controls.detailForm.controls.factoryPriceValueField.setValue(qfactoryprice, { emitEvent: false });
                  this.productForm.controls.detailForm.controls.paymentValueField.setValue(qpaymentvalue, { emitEvent: false });

                  // *** secondhand car field binding ***
                  this.productForm.controls.secondHandCarForm.controls.cc.setValue(qcc, { emitEvent: false })
                  this.productForm.controls.secondHandCarForm.controls.contract_ref.setValue(qcontractref, { emitEvent: false })
                  this.productForm.controls.secondHandCarForm.controls.grade_moto.setValue(qgrade, { emitEvent: false })
                  this.productForm.controls.secondHandCarForm.controls.isovermaxltvField.setValue(qisovermaxltv, { emitEvent: false })
                  this.productForm.controls.secondHandCarForm.controls.overmaxltvreasonField.setValue(qovermaxltvreason, { emitEvent: false })
                  this.productForm.controls.secondHandCarForm.controls.model_year.setValue(qmodelyear, { emitEvent: false })
                  this.productForm.controls.secondHandCarForm.controls.prov_code.setValue(qprovcode, { emitEvent: false })
                  this.productForm.controls.secondHandCarForm.controls.prov_name.setValue(qprovname, { emitEvent: false })
                  this.productForm.controls.secondHandCarForm.controls.reg_date.setValue(clinet_format_qregdate, { emitEvent: false })
                  this.productForm.controls.secondHandCarForm.controls.reg_no.setValue(qregno, { emitEvent: false })
                  this.productForm.controls.secondHandCarForm.controls.reg_mile.setValue(qregmile, { emitEvent: false })
                  // *** add set value to motoyear Field (14/07/2023) ***
                  this.productForm.controls.secondHandCarForm.controls.moto_year.setValue(qmotoyear, { emitEvent: false })

                  // ---- set validator on over max ltv reason is 'Y' and over max ltv reason !== '' ------
                  if (qisovermaxltv && qovermaxltvreason !== '') {
                    this.detailForm.controls.loanAmountField.setValidators(Validators.minLength(1));
                    this.detailForm.controls.loanAmountField.updateValueAndValidity({ emitEvent: false });
                  } else {
                    this.detailForm.controls.loanAmountField.setValidators([Validators.minLength(1), this.customMaxValidator.bind(this)]);
                    this.detailForm.controls.loanAmountField.updateValueAndValidity({ emitEvent: false });
                  }

                  if (qbussinesscode === '002') {

                    // *** lock all detail field when stamp data finish ***
                    this.productForm.controls.detailForm.controls.carBrandField.disable({ onlySelf: true, emitEvent: false })
                    this.productForm.controls.detailForm.controls.carModelField.disable({ onlySelf: true, emitEvent: false })
                    this.productForm.controls.detailForm.controls.engineNoField.disable({ onlySelf: true, emitEvent: false })
                    this.productForm.controls.detailForm.controls.runningengineNoField.disable({ onlySelf: true, emitEvent: false })
                    this.productForm.controls.detailForm.controls.chassisNoField.disable({ onlySelf: true, emitEvent: false })
                    this.productForm.controls.detailForm.controls.runningchassisNoField.disable({ onlySelf: true, emitEvent: false })
                    this.productForm.controls.detailForm.controls.carColorField.disable({ onlySelf: true, emitEvent: false })

                    this.productForm.controls.secondHandCarForm.controls.cc.disable({ onlySelf: true, emitEvent: false })
                    this.productForm.controls.secondHandCarForm.controls.grade_moto.disable({ onlySelf: true, emitEvent: false })
                    this.productForm.controls.secondHandCarForm.controls.model_year.disable({ onlySelf: true, emitEvent: false })
                    this.productForm.controls.secondHandCarForm.controls.prov_code.disable({ onlySelf: true, emitEvent: false })
                    this.productForm.controls.secondHandCarForm.controls.reg_date.disable({ onlySelf: true, emitEvent: false })
                    this.productForm.controls.secondHandCarForm.controls.reg_no.disable({ onlySelf: true, emitEvent: false })
                  }

                  // === for show coverage (24/08/2022) ===
                  // this.coverage = qfactoryprice;
                  // === new coverage total loss from DB function (29/08/2022) ===
                  // const resultCoveragetotalloss = await lastValueFrom(this.masterDataService.getcoverageTotalloss(qinsurancecode, (resultMaxLtv.data[0].maxltv)))

                  // ==== use loan_amont instead of factory_price when bussi code == '002' ===
                  let priceForCalTotalloss = qfactoryprice ? qfactoryprice : 0
                  if (this.productForm.controls.detailForm.controls.bussinessCode.value === '002') {
                    priceForCalTotalloss = qloanamount ? qloanamount : 0
                  }

                  const resultCoveragetotalloss = await lastValueFrom(this.masterDataService.getcoverageTotalloss(
                    qinsurancecode,
                    qbussinesscode, //'001',
                    qcarbrandcode,
                    qcarmodelcode,
                    qdealercode,
                    priceForCalTotalloss
                  ))
                  this.coverage = resultCoveragetotalloss.data[0].coverage_total_loss ? resultCoveragetotalloss.data[0].coverage_total_loss : 0
                  this.factoryprice = qfactoryprice


                  // === stamp new field form total-loss phase to field (29/08/2022) ===
                  this.coverage = qcoveragetotalloss
                  this.productForm.controls.detailForm.controls.maxltvField.setValue(qmaxltv, { emitEvent: false })
                  this.productForm.controls.detailForm.controls.engineNoField.setValue(qenginenumber, { emitEvent: false })
                  this.productForm.controls.detailForm.controls.chassisNoField.setValue(qchassisnumber, { emitEvent: false })
                  this.productForm.controls.detailForm.controls.runningengineNoField.setValue(qenginenorunning, { emitEvent: false })
                  this.productForm.controls.detailForm.controls.runningchassisNoField.setValue(qchassisnorunning, { emitEvent: false })
                  this.productForm.controls.detailForm.controls.priceincludevatField.setValue(qpriceincludevat, { emitEvent: false })


                  // === finish stamp data === 

                  // === show paymentvalue (30/05/2022) ===
                  if (
                    this.productForm.controls.detailForm.controls.factoryPriceValueField.value &&
                    this.productForm.controls.detailForm.controls.interestRateField.value &&
                    this.productForm.controls.detailForm.controls.paymentRoundCountValueField.value &&
                    this.productForm.controls.detailForm.controls.loanAmountField.value
                  ) {
                    this.lockbtncalculate$.next(false)
                    this.showpaymentvalue$.next(true)
                    this.checkvalidpaymentandpaymentcalculateauto();
                  }
                  else {
                    // === clear payment value when condition out match ===
                    console.log('no trigger this if valid')
                    this.lockbtncalculate$.next(true)
                    this.productForm.controls.detailForm.controls.paymentValueField.setValue(null, { emitEvent: false })
                    this.paymentvalue$.next(0);
                    this.out_stand = 0
                    this.showpaymentvalue$.next(false)
                  }

                  // this.loadFinish = true;

                } else {
                  console.log(`mission parameter to show all detail`)
                }

                // ==== add warning alert about interestrate 1.39 (add-on 02/08/2022) ====

              }

              // ===== ***** check quo_status (if quo_status = 1 : lock all client field , valid in api can't update data) ****** =======
              if (this.quotationdatatemp.data[0].quo_status == 1) {
                this.productForm.disable({ onlySelf: true, emitEvent: false })
                this.lockallbtn = true
              }
              this.loadingService.hideLoader()



            })
            this.countload++
          } else {
            this.loadingService.hideLoader()
            console.log(`this record is still no exits`)
          }
        }, error: (e) => {
          this.loadingService.hideLoader()
          this.snackbarfail(`${e.message}`)
        }, complete: () => {
          this.loadingService.hideLoader()
        }

        //end 
      })
    }
  }

  // async checkChangeMaxValuePrice() {
  //   if (
  //     this.productForm.controls.detailForm.controls.carBrandField.value &&
  //     this.productForm.controls.detailForm.controls.carModelField.value &&
  //     this.productForm.controls.detailForm.controls.dealerCode.value
  //   ) {
  //     const cbcode = this.productForm.controls.detailForm.controls.carBrandField.value
  //     const cmcode = this.productForm.controls.detailForm.controls.carModelField.value
  //     const dlcode = this.productForm.controls.detailForm.controls.dealerCode.value
  //     let modelprice = this.modelList.filter((items: { model_code: any; brand_code: any }) => {
  //       return items.model_code == cmcode && items.brand_code == cbcode
  //     })

  //     /// ==== set price (productValueField) from master of model code ==== 
  //     if (modelprice.length == 1) {
  //       const valuePrice = modelprice[0].price
  //       const resultMaxValue = await lastValueFrom(this.masterDataService.getMaxLtv(
  //         valuePrice,
  //         '001',
  //         '01',
  //         cbcode,
  //         cmcode,
  //         dlcode
  //       ))

  //       if (resultMaxValue) {
  //         console.log(`this is max ltv value : ${resultMaxValue.data[0].maxltv}`)
  //         const maxlvtnumber = (resultMaxValue.data[0].maxltv ?? 0).toString();
  //         const maxlvtsetFormat = this.numberWithCommas(resultMaxValue.data[0].maxltv)
  //         const maxlvttext = `(สูงสุด ${maxlvtsetFormat} บาท)`
  //         this.maxltvValue$ = of(resultMaxValue.data[0].maxltv)
  //         this.maxlvtmessage$ = of(maxlvttext)
  //       }
  //     }
  //   }
  // }

  showlistInsurancePlan() {
    const modelValue = this.productForm.controls.detailForm.controls.carModelField.value
    const isrYerarselect = this.productForm.controls.detailForm.controls.insurerCodeField.value
    if (modelValue && isrYerarselect) {
      this.showInsuranceSelect$ = of(true);
    } else {
      this.showInsuranceSelect$ = of(false)
      this.productForm.controls.detailForm.controls.insuranceYearField.setValue(null)
      this.productForm.controls.detailForm.controls.insurancePlanPriceField.setValue(null)
    }
  }

  checkforstamppaymentvalue() {
    // *** add check reg_mile if bussicode is '002' and '003' *** (03/04/2023) 

    // const chkrequireregmile = 
    // (this.productForm.controls.detailForm.controls.bussinessCode.value === '001') ||
    // ((this.productForm.controls.detailForm.controls.bussinessCode.value === '002' || this.productForm.controls.detailForm.controls.bussinessCode.value === '003') && this.productForm.controls.secondHandCarForm.controls.reg_mile.value)
    // ? true : false

    const { detailForm, secondHandCarForm } = this.productForm.controls;
    const bussinessCode = detailForm.controls.bussinessCode.value;
    const regMile = secondHandCarForm.controls.reg_mile.value;

    const modelYear = secondHandCarForm.controls.model_year.value;
    const cc = secondHandCarForm.controls.cc.value;
    const regNo = secondHandCarForm.controls.reg_no.value;
    const regDate = secondHandCarForm.controls.cc.value;
    const provCode = secondHandCarForm.controls.prov_code.value;

    const engineNo = detailForm.controls.engineNoField.value;
    const engineNoRunning = detailForm.controls.runningengineNoField.value;
    const chassisNo = detailForm.controls.chassisNoField.value;
    const chasssisNoRunning = detailForm.controls.runningchassisNoField.value;


    const chkrequireregmile =
      (
        bussinessCode === '001' || (['002'].includes(bussinessCode ? bussinessCode : '') && regMile) ||
        ((['003'].includes(bussinessCode ? bussinessCode : '') &&
          regMile &&
          modelYear &&
          cc &&
          regNo &&
          regDate &&
          provCode &&
          engineNo &&
          engineNoRunning &&
          chassisNo &&
          chasssisNoRunning
        ))
      ) ? true : false;

    if (
      this.productForm.controls.detailForm.controls.factoryPriceValueField.value &&
      this.productForm.controls.detailForm.controls.interestRateField.value &&
      this.productForm.controls.detailForm.controls.paymentRoundCountValueField.value &&
      this.productForm.controls.detailForm.controls.loanAmountField.value &&
      this.productForm.controls.detailForm.controls.insurerCodeField.value &&
      chkrequireregmile
    ) {
      this.lockbtncalculate$.next(false)
    }
    else {
      // === clear payment value when condition out match ===
      this.lockbtncalculate$.next(true)
      // console.log('975')
      this.productForm.controls.detailForm.controls.paymentValueField.setValue(null, { emitEvent: false })
      this.paymentvalue$.next(0);
      this.out_stand = 0
      this.showpaymentvalue$.next(false)
    }
  }

  async checkvalidpaymentCount() {
    // console.log(`trigger 2`)
    // this.carselectForm.get('paymentRoundCountValueField')?.setValue(undefined);
    this.loadingService.showLoader()
    // this.productForm.controls.detailForm.controls.paymentRoundCountValueField.setValue(undefined, { emitEvent: false })
    if (
      this.productForm.controls.detailForm.controls.interestRateField.value && // อัตราดอกเบี้ย
      this.productForm.controls.detailForm.controls.loanAmountField.value && // ยอดกู้
      this.productForm.controls.detailForm.controls.insuranceYearField.value  // จำนวนปี (ประกัน)
      //this.productForm.controls.detailForm.controls.isincludeloanamount.value // รวมยอดกู้
    ) {
      const size_model = this.productForm.controls.detailForm.controls.sizeModelField.value ? this.productForm.controls.detailForm.controls.sizeModelField.value : ''
      const rate = this.productForm.controls.detailForm.controls.interestRateField.value


      // === create net_finance ===
      let netfinance;
      const isincludeloanamount = this.productForm.controls.detailForm.controls.isincludeloanamount.value
      const paymentvalue = this.productForm.controls.detailForm.controls.loanAmountField.value
      const insuranceplan = (this.productForm.controls.detailForm.controls.insurancePlanPriceField.value ?? 0)
      const busicode = this.productForm.controls.detailForm.controls.bussinessCode.value ?? ''

      if (isincludeloanamount) {
        netfinance = paymentvalue + insuranceplan
      } else {
        netfinance = paymentvalue
      }
      // this.masterDataService.getTermNew('01', size_model, rate, netfinance, '001').subscribe((resPayment) => {
      this.masterDataService.getTermNew('01', size_model, rate, netfinance, busicode).subscribe((resPayment) => {
        // === manage data here ===
        this.loadingService.hideLoader()

        this.paymentCountSelect = resPayment.data
        this.productForm.controls.detailForm.controls.paymentRoundCountValueField.enable({ emitEvent: false });

        // === check payment count round value is include in parameter GetTermNew ====

        const currentPaymentRoundCountValue = this.detailForm.controls.paymentRoundCountValueField.value ?? null

        if (currentPaymentRoundCountValue) {

          if (resPayment.data.some((d) => d.term === currentPaymentRoundCountValue)) {
            this.productForm.controls.detailForm.controls.paymentRoundCountValueField.setValue(this.quotationdatatemp.data[0].cd_payment_round_count, { emitEvent: false })
          } else {
            this.productForm.controls.detailForm.controls.paymentRoundCountValueField.setValue(null, { emitEvent: false })
          }
        } else {
          this.productForm.controls.detailForm.controls.paymentRoundCountValueField.setValue(null, { emitEvent: false })
        }

        // === lock when have application_no ===
        if (this.quotationdatatemp.data[0].application_num) {
          // this.productForm.controls.detailForm.controls.paymentRoundCountValueField.disable();
        }

      })
    } else {
      this.loadingService.hideLoader()
      this.productForm.controls.detailForm.controls.paymentRoundCountValueField.setValue(undefined, { emitEvent: false });
    }
  }

  async onbtnpaymentcalculate() {
    // === create net finance
    // 
    // const test = this.productForm.valid;
    if (this.productForm.controls.detailForm.controls.isincludeloanamount.value) {
      let loanValue = this.productForm.controls.detailForm.controls.loanAmountField.value ?? 0
      loanValue = 1 * loanValue
      this.paymentshowvalue = loanValue
      let insureValue = this.productForm.controls.detailForm.controls.insurancePlanPriceField.value ?? 0
      insureValue = 1 * (+insureValue)
      this.biaprakan = insureValue
      this.netfinance = loanValue + insureValue
    } else {
      this.netfinance = this.productForm.controls.detailForm.controls.loanAmountField.value ?? 0
    }

    // === get payment Value ===
    this.masterDataService.getPaymentValue(
      this.netfinance,
      this.productForm.controls.detailForm.controls.paymentRoundCountValueField.value ? this.productForm.controls.detailForm.controls.paymentRoundCountValueField.value : 0,
      this.productForm.controls.detailForm.controls.interestRateField.value ? this.productForm.controls.detailForm.controls.interestRateField.value : 0
    ).subscribe((result) => {
      if (result.data[0].value) {
        console.log(`1056`)
        this.productForm.controls.detailForm.controls.paymentValueField.setValue(result.data[0].value ? result.data[0].value : null)

        // === set payment value text ===
        this.showpaymentvalue$.next(true)
        this.paymentvalue$.next(result.data[0].value)

        // === build out_stand (22/09/2022) ===
        const out_stand_value = (result.data[0].value) * (this.productForm.controls.detailForm.controls.paymentRoundCountValueField.value ? this.productForm.controls.detailForm.controls.paymentRoundCountValueField.value : 0)
        this.out_stand = out_stand_value
      } else {
        // === handle get payment value error ==== 
      }
    })

  }

  async checkvalidpaymentandpaymentcalculateauto() {

    this.loadingService.showLoader()
    // this.productForm.controls.detailForm.controls.paymentRoundCountValueField.setValue(undefined, { emitEvent: false })
    if (
      this.productForm.controls.detailForm.controls.interestRateField.value && // อัตราดอกเบี้ย
      this.productForm.controls.detailForm.controls.loanAmountField.value && // ยอดกู้
      this.productForm.controls.detailForm.controls.insuranceYearField.value  // จำนวนปี (ประกัน)
      //this.productForm.controls.detailForm.controls.isincludeloanamount.value // รวมยอดกู้
    ) {
      const size_model = this.productForm.controls.detailForm.controls.sizeModelField.value ? this.productForm.controls.detailForm.controls.sizeModelField.value : ''
      const rate = this.productForm.controls.detailForm.controls.interestRateField.value


      // === create net_finance ===
      let netfinance;
      const isincludeloanamount = this.productForm.controls.detailForm.controls.isincludeloanamount.value
      const paymentvalue = this.productForm.controls.detailForm.controls.loanAmountField.value
      const insuranceplan = (this.productForm.controls.detailForm.controls.insurancePlanPriceField.value ?? 0)
      const busicode = this.productForm.controls.detailForm.controls.bussinessCode.value ?? ''

      if (isincludeloanamount) {
        netfinance = paymentvalue + insuranceplan
      } else {
        netfinance = paymentvalue
      }
      // this.masterDataService.getTermNew('01', size_model, rate, netfinance, '001').subscribe((resPayment) => {
      this.masterDataService.getTermNew('01', size_model, rate, netfinance, busicode).subscribe((resPayment) => {
        // === manage data here ===
        this.loadingService.hideLoader()

        this.paymentCountSelect = resPayment.data


        // === *** extra add on for disalbe paymentRoundCountValue (เพิ่มเงื่่อนไขพิเศษในการ lock field จำนวนงวด เนื่องจาก trigger และ condition เยอะ) *** ===
        if (this.quotationdatatemp.data) {
          if (this.quotationdatatemp.data[0].quo_status === 1) {
          } else {
            this.productForm.controls.detailForm.controls.paymentRoundCountValueField.enable({ emitEvent: false });
          }
        }

        // ===========================================================================================================================================

        if (this.quotationdatatemp.data[0].cd_payment_round_count) {
          this.productForm.controls.detailForm.controls.paymentRoundCountValueField.setValue((this.quotationdatatemp.data[0].cd_payment_round_count ? this.quotationdatatemp.data[0].cd_payment_round_count : null), { emitEvent: false })
        }

        // === lock when have application_no ===
        // === cancle on 09/01/2023 ==
        // if (this.quotationdatatemp.data[0].application_num) {
        //  this.productForm.controls.detailForm.controls.paymentRoundCountValueField.disable();
        // }

      })
    } else {
      this.loadingService.hideLoader()
      this.productForm.controls.detailForm.controls.paymentRoundCountValueField.setValue(undefined, { emitEvent: false });
    }


    // =========== calcualte payment ================
    if (this.productForm.controls.detailForm.controls.isincludeloanamount.value) {
      let loanValue = this.productForm.controls.detailForm.controls.loanAmountField.value ?? 0
      loanValue = 1 * loanValue
      this.paymentshowvalue = loanValue
      let insureValue = this.productForm.controls.detailForm.controls.insurancePlanPriceField.value ?? 0
      insureValue = 1 * (+insureValue)
      this.biaprakan = insureValue
      this.netfinance = loanValue + insureValue
    } else {
      this.netfinance = this.productForm.controls.detailForm.controls.loanAmountField.value ?? 0
    }

    // === get payment Value ===
    this.masterDataService.getPaymentValue(
      this.netfinance,
      this.productForm.controls.detailForm.controls.paymentRoundCountValueField.value ? this.productForm.controls.detailForm.controls.paymentRoundCountValueField.value : 0,
      this.productForm.controls.detailForm.controls.interestRateField.value ? this.productForm.controls.detailForm.controls.interestRateField.value : 0
    ).subscribe((result) => {
      if (result.data[0].value) {
        console.log(`1056`)
        this.productForm.controls.detailForm.controls.paymentValueField.setValue(result.data[0].value ? result.data[0].value : null)

        // === set payment value text ===
        this.showpaymentvalue$.next(true)
        this.paymentvalue$.next(result.data[0].value)

        // === build out_stand (22/09/2022) ===
        const out_stand_value = (result.data[0].value) * (this.productForm.controls.detailForm.controls.paymentRoundCountValueField.value ? this.productForm.controls.detailForm.controls.paymentRoundCountValueField.value : 0)
        this.out_stand = out_stand_value
      } else {
        // === handle get payment value error ==== 
      }
    })

  }

  onclick2ndhandSearchBtn() {
    const dealercode = this.detailForm.controls.dealerCode.value ? this.detailForm.controls.dealerCode.value : ''
    const dealername = this.dealerList.find((x) => { return x.dl_code == dealercode })
    const senddata: IDialogSecondHandCarView = {
      dealer_code: dealercode,
      dealer_name: dealername ? dealername.dl_name : '',
      quo_key_app_id: this.quotationdatatemp.data[0].quo_key_app_id
    }
    if (dealercode) {
      this.dialog.open(SecondhandCarViewDialogComponent, {
        width: '100%',
        height: `80%`,
        data: senddata
      }).afterClosed().subscribe((res: IResSecondHandCarViewData) => {
        // *** parse data back from second hance car select dialog ***
        // console.log(`parse data back success : ${JSON.stringify(res)}`)
        if (res.contract_no) {
          this.showgeneralcarinfovisible = true
          this.showchassisandengine = true
          this.shwosecondhandcardetail = true

          // *** field in secondhand car that need to use call other master data (contract_ref = *for getMaxLtv incase business_code = '002') ***
          this.productForm.controls.secondHandCarForm.controls.contract_ref.setValue(res.contract_no, { emitEvent: false })

          // *** set date format ***
          const clinet_format_regdate = res.reg_date ? this.changeDateFormat(res.reg_date) : null;

          // *** clear recent data secondhand car info ****
          this.productForm.controls.detailForm.controls.interestRateField.setValue(null, { emitEvent: false })
          this.productForm.controls.detailForm.controls.paymentRoundCountValueField.setValue(null, { emitEvent: false })
          this.productForm.controls.detailForm.controls.loanAmountField.setValue(null, { emitEvent: false })
          this.productForm.controls.detailForm.controls.priceincludevatField.setValue(null, { emitEvent: false })
          this.productForm.controls.detailForm.controls.paymentValueField.setValue(null, { emitEvent: false })
          this.productForm.controls.secondHandCarForm.controls.reg_mile.setValue(null, { emitEvent: false })
          this.productForm.controls.secondHandCarForm.controls.isovermaxltvField.setValue(null, { emitEvent: false })
          this.productForm.controls.secondHandCarForm.controls.overmaxltvreasonField.setValue('', { emitEvent: false })

          // *** basic car field binding ***
          this.productForm.controls.detailForm.controls.carBrandField.setValue(res.brand_code)
          this.productForm.controls.detailForm.controls.carModelField.setValue(res.model_code)
          this.productForm.controls.detailForm.controls.engineNoField.setValue(res.engine_number)
          this.productForm.controls.detailForm.controls.runningengineNoField.setValue(res.engine_no_running, { emitEvent: false })
          this.productForm.controls.detailForm.controls.chassisNoField.setValue(res.chassis_number)
          this.productForm.controls.detailForm.controls.runningchassisNoField.setValue(res.chassis_no_running, { emitEvent: false })
          this.productForm.controls.detailForm.controls.carColorField.setValue(res.color, { emitEvent: false })

          // *** secondhand car field binding ***
          this.productForm.controls.secondHandCarForm.controls.cc.setValue(res.cc, { emitEvent: false })
          this.productForm.controls.secondHandCarForm.controls.model_year.setValue(res.model_year, { emitEvent: false })
          this.productForm.controls.secondHandCarForm.controls.grade_moto.setValue(res.grade_moto, { emitEvent: false })
          this.productForm.controls.secondHandCarForm.controls.prov_code.setValue(res.prov_code, { emitEvent: false })
          this.productForm.controls.secondHandCarForm.controls.prov_name.setValue(res.prov_name, { emitEvent: false })
          this.productForm.controls.secondHandCarForm.controls.reg_date.setValue(clinet_format_regdate, { emitEvent: false })
          this.productForm.controls.secondHandCarForm.controls.reg_no.setValue(res.reg_no, { emitEvent: false })
          this.productForm.controls.secondHandCarForm.controls.moto_year.setValue(res.moto_year) // *** check valueChange of moto_year ***

          // *** lock all detail field when stamp data finish ***
          this.productForm.controls.detailForm.controls.carBrandField.disable({ onlySelf: true, emitEvent: false })
          this.productForm.controls.detailForm.controls.carModelField.disable({ onlySelf: true, emitEvent: false })
          this.productForm.controls.detailForm.controls.engineNoField.disable({ onlySelf: true, emitEvent: false })
          this.productForm.controls.detailForm.controls.runningengineNoField.disable({ onlySelf: true, emitEvent: false })
          this.productForm.controls.detailForm.controls.chassisNoField.disable({ onlySelf: true, emitEvent: false })
          this.productForm.controls.detailForm.controls.runningchassisNoField.disable({ onlySelf: true, emitEvent: false })
          this.productForm.controls.detailForm.controls.carColorField.disable({ onlySelf: true, emitEvent: false })

          this.productForm.controls.secondHandCarForm.controls.cc.disable({ onlySelf: true, emitEvent: false })
          this.productForm.controls.secondHandCarForm.controls.grade_moto.disable({ onlySelf: true, emitEvent: false })
          this.productForm.controls.secondHandCarForm.controls.model_year.disable({ onlySelf: true, emitEvent: false })
          this.productForm.controls.secondHandCarForm.controls.prov_name.disable({ onlySelf: true, emitEvent: false })
          this.productForm.controls.secondHandCarForm.controls.reg_date.disable({ onlySelf: true, emitEvent: false })
          this.productForm.controls.secondHandCarForm.controls.reg_no.disable({ onlySelf: true, emitEvent: false })

        } else {
          // handle error or null data parse back
        }
      })
    } else {
      this.dialog.open(MainDialogComponent, {
        data: {
          header: `ไม่พบรายการ`,
          message: 'ไม่พบรายการชื่อ dealer, กรุณาเลือก "รหัสร้านค้า" ก่อนค้นหารถ',
          button_name: `ปิด`
        }
      })
    }
  }

  onKeyDown(event: KeyboardEvent) {
    // Check if the key pressed is not the space bar
    // if (event.keyCode !== 32) {
    event.preventDefault(); // Disable default behavior
    // }
  }

  handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
    }
  }

  getDealerNamebyCode(dl_code: string, ListDealer: IResMasterDealerData[]): string {

    const dealerValue = ListDealer.find((items: { dl_code: string }) => {
      return items.dl_code === dl_code
    })

    if (typeof dealerValue !== 'undefined') {
      return dealerValue.dl_name
    } else {
      return ''
    }
  }

}
