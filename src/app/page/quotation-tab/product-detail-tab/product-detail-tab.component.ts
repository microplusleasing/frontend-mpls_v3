import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { combineLatest, lastValueFrom, Subject } from 'rxjs';
import { IResQuotationDetail } from 'src/app/interface/i-res-quotation-detail';
import { BaseService } from 'src/app/service/base/base.service';
import { LoadingService } from 'src/app/service/loading.service';
import { MasterDataService } from 'src/app/service/master.service';
import { MainDialogComponent } from 'src/app/widget/dialog/main-dialog/main-dialog.component';

@Component({
  selector: 'app-product-detail-tab',
  templateUrl: './product-detail-tab.component.html',
  styleUrls: ['./product-detail-tab.component.scss']
})
export class ProductDetailTabComponent extends BaseService implements OnInit, AfterViewInit {

  @Input() quotationReq = {} as Subject<IResQuotationDetail>;

  quotationdatatemp: IResQuotationDetail = {} as IResQuotationDetail
  productForm: FormGroup

  dealerCode = new FormControl('', Validators.required)
  carBrandField = new FormControl('', Validators.required)
  carBrandNameField = new FormControl('', Validators.required)
  carModelField = new FormControl('', Validators.required)
  carModelNameField = new FormControl('', Validators.required)
  carColorField = new FormControl('')
  loanAmountField = new FormControl(null, Validators.minLength(1))
  productValueField = new FormControl('', Validators.required)
  downPaymentField = new FormControl('')
  interestRateField = new FormControl('', Validators.required)
  paymentRoundCountValueField = new FormControl('', Validators.required)
  insurerCodeField = new FormControl('', Validators.required)
  insurerNameField = new FormControl('', Validators.required)
  insuranceCodeField = new FormControl('', Validators.required)
  insuranceNameField = new FormControl('', Validators.required)
  insuranceYearField = new FormControl('', Validators.required)
  inssurancePlanPriceField = new FormControl('', Validators.required)
  paymentValueField = new FormControl('', Validators.required)
  isincludeloanamount = new FormControl(true)
  factoryPriceValueField = new FormControl()
  sizeModelField = new FormControl()
  // === new field max ltv (24.08/2022) ===
  maxltvField = new FormControl()
  // === new field (29/08/2022) ===
  engineNoField = new FormControl()
  chassisNoField = new FormControl()
  runningengineNoField = new FormControl()
  runningchassisNoField = new FormControl()
  priceincludevatField = new FormControl(null, Validators.required)
  value1 = new FormControl()
  value2 = new FormControl()
  value3 = new FormControl()


  constructor(
    private fb: FormBuilder,
    private cdRef: ChangeDetectorRef,
    private masterDataService: MasterDataService,
    private loadingService: LoadingService,
    private dialog: MatDialog,
    private _snackbar: MatSnackBar
  ) {
    super()
    this.productForm = this.fb.group({
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
      inssurancePlanPriceField: this.inssurancePlanPriceField,
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
  }

  async ngOnInit() {


  }

  ngAfterViewInit(): void {
    this.cdRef.detectChanges();
  }

  onStageChageFormStepper() {
    // this.loadingService.showLoader()

    this.quotationReq.subscribe({
      next: (res) => {
        this.quotationdatatemp = res

      }, error: (e) => {

      }, complete: () => {

      }
    })




  }

}
