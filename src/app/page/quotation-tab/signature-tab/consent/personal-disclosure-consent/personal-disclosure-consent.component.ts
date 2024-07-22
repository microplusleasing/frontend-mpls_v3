import { UntypedFormGroup, UntypedFormControl, Validators, FormControl, FormBuilder } from '@angular/forms';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { IResQuotationDetail } from 'src/app/interface/i-res-quotation-detail';
import { LoadingService } from 'src/app/service/loading.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BaseService } from 'src/app/service/base/base.service';
import { MatDialog } from '@angular/material/dialog';
import { BreakpointObserver } from '@angular/cdk/layout';

@Component({
  selector: 'app-personal-disclosure-consent',
  templateUrl: './personal-disclosure-consent.component.html',
  styleUrls: ['./personal-disclosure-consent.component.scss']
})
export class PersonalDisclosureConsentComponent extends BaseService implements OnInit {

  @Input() quotationReq = {} as Observable<IResQuotationDetail>;
  quotationdatatemp: IResQuotationDetail = {} as IResQuotationDetail
  disableNextBtn: boolean = true

  @Output() personalDisclosureValid = new EventEmitter<boolean>();

  @Output() someEvent = new EventEmitter<string>();

  disable_edit_btn: boolean = false;

  labelPosition: 'before' | 'after' = 'after';

  identity_approve_consent_value = new FormControl<number | null>(null, Validators.required)
  motor_insurance_consent_value = new FormControl<number | null>(null, Validators.required)
  nmotor_insurance_consent_value = new FormControl<number | null>(null, Validators.required)
  analyze_consent_value = new FormControl<number | null>(null, Validators.required)
  info_consent_value = new FormControl<number | null>(null, Validators.required)
  info_party_consent_value = new FormControl<number | null>(null, Validators.required)
  analyze_party_consent_value = new FormControl<number | null>(null, Validators.required)
  prdt_info_party_consent_value = new FormControl<number | null>(null, Validators.required)
  followup_consent_value = new FormControl<number | null>(null, Validators.required)
  info_develop_consent_value = new FormControl<number | null>(null, Validators.required)

  formPersonalDisclosureConsent = this.fb.group({
    identity_approve_consent_value: this.identity_approve_consent_value,
    motor_insurance_consent_value: this.motor_insurance_consent_value,
    nmotor_insurance_consent_value: this.nmotor_insurance_consent_value,
    analyze_consent_value: this.analyze_consent_value,
    info_consent_value: this.info_consent_value,
    info_party_consent_value: this.info_party_consent_value,
    analyze_party_consent_value: this.analyze_party_consent_value,
    prdt_info_party_consent_value: this.prdt_info_party_consent_value,
    followup_consent_value: this.followup_consent_value,
    info_develop_consent_value: this.info_develop_consent_value
  })

  constructor(
    private fb: FormBuilder,
    private loadingService: LoadingService,
    public override dialog: MatDialog,
    public override _snackBar: MatSnackBar,
    private breakpointObserver: BreakpointObserver
  ) {
    super(dialog, _snackBar)
  }


  ngOnInit(): void {
    this.quotationReq.subscribe({
      next: (resquo) => {
        // this.loadingService.showLoader();
        this.quotationdatatemp = resquo

        // === handle page where resquo load === 
        if (this.quotationdatatemp.data) {

          // === stamp field with save or fix value ====
          // const ispersonaldisclosureselect = this.quotationdatatemp.data[0].cs_is_disclosure_consent

          // if (this.quotationdatatemp.data[0].quo_status == 4 && this.quotationdatatemp.data[0].cs_is_disclosure_consent == 0) {
          //   this.disable_edit_btn = false
          // } else {
          //   this.disable_edit_btn = true
          // }

          // === set consent Value ===
          if (this.quotationdatatemp.data[0].cs_app_key_id !== '' && this.quotationdatatemp.data[0].cs_app_key_id !== null) {
            this.formPersonalDisclosureConsent.controls.identity_approve_consent_value.setValue(this.quotationdatatemp.data[0].identity_approve_consent_value ? this.quotationdatatemp.data[0].identity_approve_consent_value : 0)
            this.formPersonalDisclosureConsent.controls.motor_insurance_consent_value.setValue(this.quotationdatatemp.data[0].motor_insurance_consent_value ? this.quotationdatatemp.data[0].motor_insurance_consent_value : 0)
            this.formPersonalDisclosureConsent.controls.nmotor_insurance_consent_value.setValue(this.quotationdatatemp.data[0].nmotor_insurance_consent_value ? this.quotationdatatemp.data[0].nmotor_insurance_consent_value : 0)
            this.formPersonalDisclosureConsent.controls.analyze_consent_value.setValue(this.quotationdatatemp.data[0].analyze_consent_value ? this.quotationdatatemp.data[0].analyze_consent_value : 0)
            this.formPersonalDisclosureConsent.controls.info_consent_value.setValue(this.quotationdatatemp.data[0].info_consent_value ? this.quotationdatatemp.data[0].info_consent_value : 0)
            this.formPersonalDisclosureConsent.controls.info_party_consent_value.setValue(this.quotationdatatemp.data[0].info_party_consent_value ? this.quotationdatatemp.data[0].info_party_consent_value : 0)
            this.formPersonalDisclosureConsent.controls.analyze_party_consent_value.setValue(this.quotationdatatemp.data[0].analyze_party_consent_value ? this.quotationdatatemp.data[0].analyze_party_consent_value : 0)
            this.formPersonalDisclosureConsent.controls.prdt_info_party_consent_value.setValue(this.quotationdatatemp.data[0].prdt_info_party_consent_value ? this.quotationdatatemp.data[0].prdt_info_party_consent_value : 0)
            this.formPersonalDisclosureConsent.controls.followup_consent_value.setValue(this.quotationdatatemp.data[0].followup_consent_value ? this.quotationdatatemp.data[0].followup_consent_value : 0)
            this.formPersonalDisclosureConsent.controls.info_develop_consent_value.setValue(this.quotationdatatemp.data[0].info_develop_consent_value ? this.quotationdatatemp.data[0].info_develop_consent_value : 0)
            this.formPersonalDisclosureConsent.updateValueAndValidity()
            this.disableNextBtn = false
            this.personalDisclosureValid.emit(true)
          }

          if (this.quotationdatatemp.data[0].quo_status == 1 || this.quotationdatatemp.data[0].identity_approve_consent_value !== null) {
            // === lock form when send data Pthep ===
            this.formPersonalDisclosureConsent.disable();
          }

          // === value Change ===

          // === main form (check valid) ===
          this.formPersonalDisclosureConsent.valueChanges.subscribe((value) => {
            if (this.formPersonalDisclosureConsent.valid) {
              this.disableNextBtn = false
              this.personalDisclosureValid.emit(true)
            } else {
              this.disableNextBtn = true
              this.personalDisclosureValid.emit(false)
            }
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

  onStageChangeFormStepper() {

  }


  callParent(): void {
    this.someEvent.next('onNextStep');
  }



}
