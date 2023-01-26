import { UntypedFormGroup, UntypedFormControl, Validators, FormBuilder, FormControl } from '@angular/forms';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { IResQuotationDetail } from 'src/app/interface/i-res-quotation-detail';
import { IInfoEconsentCustomerData } from 'src/app/interface/i-info-econsent-customer-data';
import { LoadingService } from 'src/app/service/loading.service';
import { BaseService } from 'src/app/service/base/base.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BreakpointObserver } from '@angular/cdk/layout';

@Component({
  selector: 'app-e-paper-consent',
  templateUrl: './e-paper-consent.component.html',
  styleUrls: ['./e-paper-consent.component.scss']
})
export class EPaperConsentComponent extends BaseService implements OnInit {

  @Input() quotationReq = {} as Observable<IResQuotationDetail>;
  quotationdatatemp: IResQuotationDetail = {} as IResQuotationDetail
  disableNextBtn: boolean = true
  @Output() epaperConsentValid = new EventEmitter<boolean>();

  @Output() someEvent = new EventEmitter<string>();
  @Output() e_paper_consent_value_change = new EventEmitter<boolean>();
  disable_edit_btn: boolean = false;

  epaperconsentvalue = new FormControl<number | null>(null, Validators.required)
  epaperform = this.fb.group({
    epaperconsentvalue: this.epaperconsentvalue
  });

  title$: Observable<string> = of('')
  fname$: Observable<string> = of('')
  lname$: Observable<string> = of('')
  birthdate$: Observable<string> = of('')
  cizid$: Observable<string> = of('')
  phoneno$: Observable<string> = of('')
  email$: Observable<string> = of('')

  constructor(
    private fb: FormBuilder,
    private loadingService: LoadingService,
    public override dialog: MatDialog,
    public override _snackBar: MatSnackBar,
    private breakpointObserver: BreakpointObserver
  ) {
    super(dialog, _snackBar)

  }

  @Input() cusData = {} as Subject<IInfoEconsentCustomerData>

  ngOnInit(): void {

    this.quotationReq.subscribe({
      next: (resquo) => {
        // this.loadingService.showLoader();
        this.quotationdatatemp = resquo

        // === handle page where resquo load === 
        if (this.quotationdatatemp.data) {

          this.title$ = of(resquo.data[0].title_name)
          this.fname$ = of(resquo.data[0].first_name)
          this.lname$ = of(resquo.data[0].last_name)
          this.birthdate$ = of(resquo.data[0].birth_date_text_th)
          this.cizid$ = of(resquo.data[0].idcard_num)
          this.phoneno$ = of(resquo.data[0].phone_number)
          this.email$ = of(resquo.data[0].email)

          // === new condition lock next button (11/09/2022) === 
          // if (this.quotationdatatemp.data[0].quo_status == 4 && this.quotationdatatemp.data[0].cs_is_disclosure_consent == 0) {
          //   this.disable_edit_btn = false
          // } else {
          //   this.disable_edit_btn = true
          // }

          // === set e-paper consent value ===
          if (this.quotationdatatemp.data[0].cs_app_key_id !== '' && this.quotationdatatemp.data[0].cs_app_key_id !== null) {
            this.epaperform.controls.epaperconsentvalue.setValue(this.quotationdatatemp.data[0].e_paper_consent_value ? this.quotationdatatemp.data[0].e_paper_consent_value : null)
            this.epaperform.updateValueAndValidity()
            this.disableNextBtn = false
            this.epaperConsentValid.emit(true)
          }

          if (this.quotationdatatemp.data[0].quo_status == 1 || this.quotationdatatemp.data[0].e_paper_consent_value !== null) {
            this.epaperform.disable();
          }

          // === value Change ===

          this.epaperform.valueChanges.subscribe((value) => {
            if (this.epaperform.valid) {
              this.disableNextBtn = false
              this.epaperConsentValid.emit(true)
            } else {
              this.disableNextBtn = true
              this.epaperConsentValid.emit(true)
            }
          })


          // *** epaperconsentvalue *** 
          this.epaperform.controls.epaperconsentvalue.valueChanges.subscribe((value) => {
            this.e_paper_consent_value_change.emit(true)
          })
        }
      }, error: (err) => {
        // this.loadingService.hideLoader()
        this.snackbarfail(`${err.message}`)
      }, complete: () => {
        // this.loadingService.hideLoader();
      }
    })

  }


  onStageChageFormStepper() {

  }

  callParent(): void {
    this.someEvent.next('onNextStep');
  }

}