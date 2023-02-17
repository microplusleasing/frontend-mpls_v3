import { BreakpointObserver } from '@angular/cdk/layout';
import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, combineLatest, debounceTime, lastValueFrom, map, Observable, of, startWith, Subject } from 'rxjs';
import { IResMasterBranchData } from 'src/app/interface/i-res-master-branch';
import { IResMasterBrandData } from 'src/app/interface/i-res-master-brand';
import { IResMasterDealer, IResMasterDealerData } from 'src/app/interface/i-res-master-dealer';
import { IResMasterInsuranceYearsData } from 'src/app/interface/i-res-master-insurance-years';
import { IResMasterInsurerData } from 'src/app/interface/i-res-master-insurer';
import { IResMasterModel, IResMasterModelData } from 'src/app/interface/i-res-master-model';
import { IResQuotationDetail } from 'src/app/interface/i-res-quotation-detail';
import { BaseService } from 'src/app/service/base/base.service';
import { LoadingService } from 'src/app/service/loading.service';
import { MasterDataService } from 'src/app/service/master.service';

@Component({
  selector: 'app-product-detail-tab',
  templateUrl: './product-detail-tab.component.html',
  styleUrls: ['./product-detail-tab.component.scss']
})
export class ProductDetailTabComponent extends BaseService implements OnInit, AfterViewInit {

  @Input() quotationReq = {} as Subject<IResQuotationDetail>;
  quotationdatatemp: IResQuotationDetail = {} as IResQuotationDetail
  lockallbtn: boolean = false

  // *** check econsent verify ***
  consentVerify = new FormControl<boolean>(false, Validators.requiredTrue)

  dealerCode = new FormControl('', Validators.required)
  carBrandField = new FormControl<string | ''>('', Validators.required)
  carBrandNameField = new FormControl('', Validators.required)
  carModelField = new FormControl<string | ''>('', Validators.required)
  carModelNameField = new FormControl('', Validators.required)
  carColorField = new FormControl('')
  loanAmountField = new FormControl<number | null>(null, Validators.minLength(1))
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

  detailForm = this.fb.group({
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


  // *** main Form ***
  productForm = this.fb.group({
    consentVerify: this.consentVerify,
    detailForm: this.detailForm
  })

  showPrice: boolean = false;

  brandList = [] as IResMasterBrandData[];
  modelList = [] as IResMasterModelData[];
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
  showBrandModelLoan$: Observable<boolean> = new Observable<boolean>()
  showInsuranceSelect$: Observable<boolean> = new Observable<boolean>()
  isChecker: boolean = false;
  sellerCode: string = '';
  countload: number = 0;
  is_edit: boolean = true
  // === show chasis and engine (29/08/2022) === 
  showchassisandengine: boolean = false

  // === variable (out_stand) (22/09/2022) ===
  out_stand: number = 0

  @Input() cusage: number = 0
  @Input() gender: number = 0



  warningMsgPaymentValueField: boolean = false;// === subscribe on paymentValueField (valueChange) to show or hide === 

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
    private cdRef: ChangeDetectorRef,
    private masterDataService: MasterDataService,
    private loadingService: LoadingService,
    public override dialog: MatDialog,
    public override _snackBar: MatSnackBar,
    private breakpointObserver: BreakpointObserver
  ) {
    super(dialog, _snackBar)

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


  async onStageChageFormStepper() {
    // this.loadingService.showLoader()
    if (this.countload == 0) {
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
              this.masterDataService.getDealer('01'),
              this.masterDataService.MPLS_getbrand(),
              this.masterDataService.MPLS_getmodel()
            ]).subscribe(async (res) => {
              // console.log(`this is master Data : ${JSON.stringify(res)}`)
              // === set master to variable ===

              const priceincludevatValue = this.productForm.controls.detailForm.controls.priceincludevatField.value
              if (!priceincludevatValue) {
                this.productForm.controls.detailForm.controls.priceincludevatField.setValue(0)
              }

              // *** dealer ***
              if (res[0]) {
                this.dealerList = res[0].data
                // === set validate format dealer code === 
                this.productForm.controls.detailForm.controls.dealerCode.setValidators(this.validateDealerformat(this.dealerList))
                this.productForm.controls.detailForm.controls.dealerCode.valueChanges.pipe(
                  startWith(''),
                  map(value => this._filterDealer(value))
                ).subscribe(async (value: IResMasterDealerData[]) => {
                  this.filterDealerList = of(value)

                  const selectValue = this.dealerList.find((items: { dl_code: string }) => {
                    return items.dl_code == value[0].dl_code
                  })

                  if (typeof selectValue !== 'undefined') {
                    // === set text of dealer select === 
                    this.dealerSelectText = of(selectValue.dl_name);
                  }

                  this.productForm.controls.detailForm.controls.carModelField.setValue('', { emitEvent: false });
                  this.productForm.controls.detailForm.controls.carBrandField.setValue('', { emitEvent: false })
                  this.productForm.controls.detailForm.controls.insurerCodeField.setValue('', { emitEvent: false })
                  this.productForm.controls.detailForm.controls.insuranceYearField.setValue(null, { emitEvent: false })

                  // this.checkChangeMaxValuePrice();
                })
              }

              // *** brand ***
              if (res[1]) {
                this.brandList = res[1].data
                this.productForm.controls.detailForm.controls.carBrandField.valueChanges.pipe(
                  startWith(''),
                  map(value => this._filterBrand(value))
                ).subscribe(async (value: IResMasterBrandData[]) => {
                  this.filterBrandList = of(value)

                  this.productForm.controls.detailForm.controls.carModelField.setValue(null, { emitEvent: false })
                  this.productForm.controls.detailForm.controls.productValueField.setValue(null, { emitEvent: false })
                  this.productForm.controls.detailForm.controls.factoryPriceValueField.setValue(null, { emitEvent: false })
                  this.productForm.controls.detailForm.controls.interestRateField.setValue(null, { emitEvent: false })
                  this.productForm.controls.detailForm.controls.paymentRoundCountValueField.setValue(null, { emitEvent: false })
                  this.productForm.controls.detailForm.controls.insurerCodeField.setValue(null, { emitEvent: false })

                  this.maxlvtmessage$ = of('');

                  this.rateSelect = [];
                  this.paymentCountSelect = [];
                  const selectValue = value
                  if (selectValue != null) {
                    this.modelSelect = this.modelList.filter((items: { brand_code: any; }) => {
                      return items.brand_code == selectValue[0].brand_code
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
                        return items.brand_code == selectValue[0].brand_code
                      })

                      this.productForm.controls.detailForm.controls.carModelField.setValue('')
                      this.productForm.controls.detailForm.controls.carModelField.disable();
                    }

                    // === set child list (model) === 
                    this.modelListFilter = this.modelList.filter((items: { brand_code: string }) => {
                      return items.brand_code == selectValue[0].brand_code
                    })

                    // === set validate Brand === 

                    this.productForm.controls.detailForm.controls.carModelField.setValidators(this.validateModelformat(this.modelListFilter))
                    this.productForm.controls.detailForm.controls.carModelField.setValue('')
                    this.productForm.controls.detailForm.controls.carModelField.enable({ emitEvent: false })
                    this.showBrandModelLoan$ = of(false)

                    // === stamp car brand by code ===

                    const result = this.brandList.find((x: { brand_code: string; }) => x.brand_code === selectValue[0].brand_code);
                    if (result) {
                      const carBrandNameSelect = result.brand_name
                      if (carBrandNameSelect) {
                        this.productForm.controls.detailForm.controls.carBrandNameField.setValue(carBrandNameSelect)
                      }
                    }

                  }
                })
              }

              // *** model ***
              if (res[2]) {
                this.modelList = res[2].data
                this.productForm.controls.detailForm.controls.carModelField.valueChanges.pipe(
                  startWith(''),
                  map(value => this._filterModel(value))
                ).subscribe(async (value: IResMasterModelData[]) => {
                  this.filterModelList = of(value)

                  this.productForm.controls.detailForm.controls.interestRateField.enable()
                  this.productForm.controls.detailForm.controls.interestRateField.setValue(null, { emitEvent: false })
                  this.productForm.controls.detailForm.controls.paymentRoundCountValueField.setValue(null, { emitEvent: false })
                  this.productForm.controls.detailForm.controls.insurerCodeField.setValue(null, { emitEvent: false })
                  this.productForm.controls.detailForm.controls.productValueField.setValue(null, { emitEvent: false })
                  this.productForm.controls.detailForm.controls.factoryPriceValueField.setValue(null, { emitEvent: false })
                  this.productForm.controls.detailForm.controls.engineNoField.setValue(null, { emitEvent: false })
                  this.productForm.controls.detailForm.controls.chassisNoField.setValue(null, { emitEvent: false })
                  this.productForm.controls.detailForm.controls.runningengineNoField.setValue(null, { emitEvent: false })
                  this.productForm.controls.detailForm.controls.runningchassisNoField.setValue(null, { emitEvent: false })
                  this.coverage = 0
                  this.factoryprice = 0

                  const selectValue = value
                  if (selectValue.length !== 0) {

                    // ==== get model price from model select value ===
                    let modelprice = this.modelListFilter.filter((items: { model_code: any; brand_code: any }) => {
                      return items.model_code == selectValue[0].model_code && items.brand_code == this.productForm.controls.detailForm.controls.carBrandField.value
                    })


                    /// ==== set price (productValueField) from master of model code ==== 
                    if (modelprice.length == 1) {
                      // === set text of model select === 
                      this.modelSelectText = of(modelprice[0].model);
                      const valuePrice = modelprice[0].price
                      this.productForm.controls.detailForm.controls.productValueField.setValue(valuePrice)
                      this.productForm.controls.detailForm.controls.factoryPriceValueField.setValue(valuePrice)

                      // === set chassis and engine to field (29/08/2022) ===
                      this.productForm.controls.detailForm.controls.engineNoField.setValue(modelprice[0].engine_no)
                      this.productForm.controls.detailForm.controls.chassisNoField.setValue(modelprice[0].chassis_no)

                      //=== call max lvt vaue === 
                      const resultMaxLtv = await lastValueFrom(this.masterDataService.getMaxLtv(
                        valuePrice,
                        '001',
                        '01',
                        this.productForm.controls.detailForm.controls.carBrandField.value ? this.productForm.controls.detailForm.controls.carBrandField.value : '',
                        selectValue[0].model_code,
                        this.productForm.controls.detailForm.controls.dealerCode.value ? this.productForm.controls.detailForm.controls.dealerCode.value : ''
                      ))

                      console.log(`this is max ltv value : ${resultMaxLtv.data[0].maxltv}`)
                      const maxlvtnumber = (resultMaxLtv.data[0].maxltv ?? 0).toString();
                      const maxlvtsetFormat = this.numberWithCommas(resultMaxLtv.data[0].maxltv)
                      const maxlvttext = `(สูงสุด ${maxlvtsetFormat} บาท)`
                      this.maxltvValue$ = of(resultMaxLtv.data[0].maxltv)
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
                      this.masterDataService.getInsurance(
                        valuePrice,
                        '001', // bussi_code
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

                    if (bcSelect && bmSelect && modelPrice) {

                      this.masterDataService.getSizeModel(
                        '01',
                        bcSelect,
                        bmSelect,
                        this.productForm.controls.detailForm.controls.dealerCode.value ? this.productForm.controls.detailForm.controls.dealerCode.value : '',
                        '001',
                        modelPrice
                      ).subscribe((result) => {
                        this.productForm.controls.detailForm.controls.sizeModelField.setValue(result.data[0].size);
                        // this.masterDataService.getTerm('01', result.data[0].size).subscribe((resPayment) => {
                        //   console.log(`sol1 : ${JSON.stringify(resPayment.data)}`)
                        //   this.paymentCountSelect = resPayment.data
                        //   this.masterDataService.getRate('01', result.data[0].size).subscribe((resRate) => {
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

                        this.masterDataService.getRate('01', result.data[0].size).subscribe((resRate) => {
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
                })
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
              this.productForm.controls.detailForm.controls.loanAmountField.valueChanges.pipe(debounceTime(500)).subscribe((res) => {
                this.loanAmountFieldSubjet.next(res)

                // === clear payment value (31/05/2022) === 
                this.productForm.controls.detailForm.controls.paymentValueField.setValue(null)
                this.showpaymentvalue$.next(false);
                this.paymentvalue$.next(0);
                this.out_stand = 0
                console.log(`chagne loanAmountField`)
                this.checkforstamppaymentvalue();
                this.checkvalidpaymentCount();
              })

              // *** insurerCodeField ***
              this.productForm.controls.detailForm.controls.insurerCodeField.valueChanges.subscribe((res) => {
                if (res) {
                  // === set Insurance Year === 
                  this.InsuranceListFilter = this.InsuranceListTemp.filter((items: { insurer_code: any; }) => {
                    return items.insurer_code == res
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
                    return value.years_insur == yearInt
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
                  const resultCoveragetotalloss = await lastValueFrom(this.masterDataService.getcoverageTotalloss
                    (
                      this.productForm.controls.detailForm.controls.insuranceCodeField.value ? this.productForm.controls.detailForm.controls.insuranceCodeField.value : '',
                      '001',
                      this.productForm.controls.detailForm.controls.carBrandField.value ? this.productForm.controls.detailForm.controls.carBrandField.value : '',
                      this.productForm.controls.detailForm.controls.carModelField.value ? this.productForm.controls.detailForm.controls.carModelField.value : '',
                      this.productForm.controls.detailForm.controls.dealerCode.value ? this.productForm.controls.detailForm.controls.dealerCode.value : '',
                      this.productForm.controls.detailForm.controls.factoryPriceValueField.value ? this.productForm.controls.detailForm.controls.factoryPriceValueField.value : 0
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


              // ==== new check MPLS record already exits ====

              // *** check for stamp record data to form ====
              if (!recordExists) {

                // === no record exist ===
              } else {

                // === already have record (have quo_key_app_id) ===

                // ==== show all condition validtor === 
                this.showPrice = true;
                this.showchassisandengine = true
                this.showBrandModelLoan$ = of(true);
                this.showInsuranceSelect$ = of(true);
                // === load and call master data ===


                // === parameter for call api master === 
                const qcarbrandcode = quoitem.cd_brand_code ?? '';
                const qcarbrandname = quoitem.cd_brand_name ?? '';
                const qcarmodelcode = quoitem.cd_model_code ?? '';
                const qcarmodelname = quoitem.cd_model_name ?? '';
                const qcolor = quoitem.cd_color_name ?? ''
                const qcarmodel = quoitem.cd_model_code ?? '';
                const qsizemodel = quoitem.cd_size_model ?? '';
                const qfactoryprice = quoitem.cd_factory_price ?? null
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

                // === unlock field === 
                if (qrate) this.productForm.controls.detailForm.controls.interestRateField.enable({ emitEvent: false });
                // if (qterm) this.productForm.controls.detailForm.controls.paymentRoundCountValueField.enable();
                // if (qinsuranceplan) this.productForm.controls.detailForm.controls.inssurancePlanPriceField.enable();

                this.productForm.controls.detailForm.controls.carModelField.setValue(quoitem.cd_model_code ?? '', { emitEvent: false })

                if (qfactoryprice && qcarbrandcode && qcarmodel && qterm && qsizemodel && qloanamount && qinsureplanpricevalue && qrate) {


                  const resultRateMaster = await lastValueFrom(this.masterDataService.getRate(`01`, qsizemodel));

                  // ==== change parameter for get insurance from factory_price to max_ltv (24/08/2022) ===

                  const resultMaxLtv = await lastValueFrom(this.masterDataService.getMaxLtv(
                    qfactoryprice,
                    '001',
                    '01',
                    qcarbrandcode,
                    qcarmodelcode,
                    qdealercode
                  ))
                  this.maxltvCurrent = resultMaxLtv.data[0].maxltv
                  // === set max ltv field (29/08/2022) ===
                  this.productForm.controls.detailForm.controls.maxltvField.setValue(this.maxltvCurrent)

                  // const resultInsuranceMaster = await lastValueFrom(this.masterDataService.getInsuranceold2((resultMaxLtv.data[0].maxltv.toString())));
                  const resultInsuranceMaster = await lastValueFrom(this.masterDataService.getInsurance(qfactoryprice, '001', qcarbrandcode, qcarmodelcode, qdealercode));

                  // === chage from getTerm to getTermNew 03/01/2023 ===
                  // const resultTerm = await lastValueFrom(this.masterDataService.getTerm(`01`, qsizemodel))

                  const net_finance = qloanamount + (qinsuranceplan ?? 0)
                  const resultTerm = await lastValueFrom(this.masterDataService.getTermNew(`01`, qsizemodel, qrate, net_finance))

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
                  this.brandList = res[1].data
                  this.modelList = res[2].data


                  // === set model select 
                  this.modelSelect = this.modelList.filter((items: { brand_code: any; }) => {
                    return items.brand_code == qcarbrandcode
                  });

                  // === set text of brand select === 
                  this.brandSelectText = of(this.modelSelect[0].brand_name);

                  // === set child list (model) === 
                  this.modelListFilter = this.modelList.filter((items: { brand_code: any; }) => {
                    return items.brand_code == qcarbrandcode
                  })

                  // === set validate Brand (auto data stamp on this.quotationdatatemp) === 
                  this.productForm.controls.detailForm.controls.carModelField.setValidators(this.validateModelformat(this.modelListFilter))
                  // this.productForm.controls.detailForm.controls.carModelField.setValue('')
                  // this.productForm.controls.detailForm.controls.carModelField.enable({ emitEvent: false })

                  this.productForm.controls.detailForm.controls.carBrandNameField.setValue(qcarbrandcode, { emitEvent: false })
                  this.productForm.controls.detailForm.controls.carBrandField.setValue(qcarbrandcode, { emitEvent: false });

                  // ***==== Car Model ====***

                  // ==== get model price from model select value ===
                  let modelprice = this.modelListFilter.filter((items: { model_code: any; brand_code: any }) => {
                    return items.model_code == qcarmodelcode && items.brand_code == this.productForm.controls.detailForm.controls.carBrandField.value
                  })
                  if (modelprice.length == 1) {
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
                    return items.insurer_code == qinsurercode
                  })

                  // // === stamp dealer code ==== 
                  // const sessionData = this.userSessionQuotation
                  // // === checker ===
                  // if (sessionData.channal == 'checker') {
                  //   if (quoitem.sl_code) {
                  //     this.productForm.controls.detailForm.controls.dealerCode.setValue(quoitem.sl_code);
                  //   }
                  // } else {
                  //   // === store ==== 
                  //   if (this.userSessionQuotation.SELLER_ID) {
                  //     this.productForm.controls.detailForm.controls.dealerCode.setValue(this.userSessionQuotation.SELLER_ID);
                  //     this.productForm.controls.detailForm.controls.dealerCode.disable();
                  //   }
                  // }

                  // === stamp value to field ==== 
                  this.productForm.controls.detailForm.controls.dealerCode.setValue(qdealercode, { emitEvent: false })
                  // this.productForm.controls.detailForm.controls.carBrandField.setValue(qcarbrandcode, { emitEvent: false });
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
                  // === for show coverage (24/08/2022) ===
                  // this.coverage = qfactoryprice;
                  // === new coverage total loss from DB function (29/08/2022) ===
                  // const resultCoveragetotalloss = await lastValueFrom(this.masterDataService.getcoverageTotalloss(qinsurancecode, (resultMaxLtv.data[0].maxltv)))
                  const resultCoveragetotalloss = await lastValueFrom(this.masterDataService.getcoverageTotalloss(
                    qinsurancecode,
                    '001',
                    qcarbrandcode,
                    qcarmodelcode,
                    qdealercode,
                    qfactoryprice
                  ))
                  this.coverage = resultCoveragetotalloss.data[0].coverage_total_loss ? resultCoveragetotalloss.data[0].coverage_total_loss : 0
                  this.factoryprice = qfactoryprice


                  // === stamp new field form total-loss phase to field (29/08/2022) ===
                  this.coverage = qcoveragetotalloss
                  this.productForm.controls.detailForm.controls.maxltvField.setValue(qmaxltv, { emitEvent: false })
                  // this.productForm.controls.detailForm.controls.engineNoField.setValue(qenginenumber, { emitEvent: false })
                  // this.productForm.controls.detailForm.controls.chassisNoField.setValue(qchassisnumber, { emitEvent: false })
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
    if (
      this.productForm.controls.detailForm.controls.factoryPriceValueField.value &&
      this.productForm.controls.detailForm.controls.interestRateField.value &&
      this.productForm.controls.detailForm.controls.paymentRoundCountValueField.value &&
      this.productForm.controls.detailForm.controls.loanAmountField.value &&
      this.productForm.controls.detailForm.controls.insurerCodeField.value
    ) {
      this.lockbtncalculate$.next(false)
    }
    else {
      // === clear payment value when condition out match ===
      this.lockbtncalculate$.next(true)
      console.log('975')
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

      if (isincludeloanamount) {
        netfinance = paymentvalue + insuranceplan
      } else {
        netfinance = paymentvalue
      }
      this.masterDataService.getTermNew('01', size_model, rate, netfinance).subscribe((resPayment) => {
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

    const test = this.productForm.valid;
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

      if (isincludeloanamount) {
        netfinance = paymentvalue + insuranceplan
      } else {
        netfinance = paymentvalue
      }
      this.masterDataService.getTermNew('01', size_model, rate, netfinance).subscribe((resPayment) => {
        // === manage data here ===
        this.loadingService.hideLoader()

        this.paymentCountSelect = resPayment.data


        // === *** extra add on for disalbe paymentRoundCountValue (เพิ่มเงื่่อนไขพิเศษในการ lock field จำนวนงวด เนื่องจาก trigger และ condition เยอะ) *** ===
        if (this.quotationdatatemp.data) {
          if (this.quotationdatatemp.data[0].quo_status == 1) {
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

}
