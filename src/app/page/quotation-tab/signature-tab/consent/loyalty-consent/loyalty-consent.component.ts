import { IResInsurance } from 'src/app/interface/i-res-insurance';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Observable, of, Subject } from 'rxjs';
import { IResQuotationDetail } from 'src/app/interface/i-res-quotation-detail';

@Component({
    selector: 'app-loyalty-consent',
    templateUrl: './loyalty-consent.component.html',
    styleUrls: ['./loyalty-consent.component.scss'],
    standalone: false
})
export class LoyaltyConsentComponent implements OnInit {

  @Output() someEvent = new EventEmitter<string>();
  @Output() PersonalDisclosureChange = new EventEmitter<boolean>();

  // === add new emit value of new PDPA consent (21/07/2022) ==== 
  @Output() is_check_sale_sheet_explain_value_change = new EventEmitter<boolean>();
  @Output() is_check_product_detail_value_change = new EventEmitter<boolean>();
  @Output() is_check_payment_rule_value_change = new EventEmitter<boolean>();
  @Output() is_check_contract_explain_value_change = new EventEmitter<boolean>();
  @Output() is_check_total_loss_explain_value_change = new EventEmitter<boolean>();
  @Output() is_check_total_loss_company_value_change = new EventEmitter<boolean>();

  labelPosition: 'before' | 'after' = 'after';

  quotationresultData = {} as IResQuotationDetail;

  netfinance$: Observable<number> = of(0)
  term$: Observable<number> = of(0)
  rate$: Observable<number> = of(0)
  monthly$: Observable<number> = of(0)

  insurancecompany$: Observable<string> = of('')
  insuranceyear$: Observable<number> = of(0)
  tl_t1$: Observable<number> = of(0) // deprecate field
  coverage_total_loss$: Observable<number> = of(0) // === use replace t1_l1 field (30/08/2022) ===
  first_due$: Observable<Date> = of()

  is_check_sale_sheet_explain_value = new FormControl<number | null>(null, Validators.required)
  is_check_product_detail_value = new FormControl<number | null>(null, Validators.required)
  is_check_payment_rule_value = new FormControl<number | null>(null, Validators.required)
  is_check_contract_explain_value = new FormControl<number | null>(null, Validators.required)
  is_check_total_loss_explain_value = new FormControl<number | null>(null, Validators.required)
  is_check_total_loss_company_value = new FormControl<number | null>(null, Validators.required)
  is_check_life_insurance_value = new FormControl<number | null>(null)
  is_check_l_insur_detail_value = new FormControl<number | null>(null)
  is_check_l_insur_plan_value = new FormControl<number | null>(null)
  is_check_l_insur_company_value = new FormControl<number | null>(null)
  is_check_l_insur_refund_value = new FormControl<number | null>(null)
  is_check_l_insur_cancle_d_value = new FormControl<number | null>(null)

  loyaltyform = this.fb.group({
    is_check_sale_sheet_explain_value: this.is_check_sale_sheet_explain_value,
    is_check_product_detail_value: this.is_check_product_detail_value,
    is_check_payment_rule_value: this.is_check_payment_rule_value,
    is_check_contract_explain_value: this.is_check_contract_explain_value,
    is_check_total_loss_explain_value: this.is_check_total_loss_explain_value,
    is_check_total_loss_company_value: this.is_check_total_loss_company_value,
    is_check_life_insurance_value: this.is_check_life_insurance_value,
    is_check_l_insur_detail_value: this.is_check_l_insur_detail_value,
    is_check_l_insur_plan_value: this.is_check_l_insur_plan_value,
    is_check_l_insur_company_value: this.is_check_l_insur_company_value,
    is_check_l_insur_refund_value: this.is_check_l_insur_refund_value,
    is_check_l_insur_cancle_d_value: this.is_check_l_insur_cancle_d_value
  })


  constructor(
    private fb: FormBuilder
  ) {

  }

  @Input() quotationRequest = {} as Subject<IResQuotationDetail>;
  @Input() insureData = {} as Subject<IResInsurance>

  ngOnInit(): void {

    this.insureData.subscribe(event => {
      if (event.data === undefined) {
        // do nothing
      } else {

        this.netfinance$ = of(event.data[0].net_finance)
        this.term$ = of(event.data[0].term)
        this.rate$ = of(event.data[0].rate_charge)
        this.monthly$ = of(event.data[0].monthly)
        this.insurancecompany$ = of(event.data[0].insurer_name)
        this.insuranceyear$ = of(event.data[0].insurance_years)
        this.tl_t1$ = of(event.data[0].tl_t1) // deprecate
        this.coverage_total_loss$ = of(event.data[0].coverage_total_loss) // === use replace t1_l1 field (30/08/2022) ===
        this.first_due$ = of(event.data[0].first_due)
      }
    })

  }

  callParent(): void {
    this.someEvent.next('onNextStep');
  }

}
