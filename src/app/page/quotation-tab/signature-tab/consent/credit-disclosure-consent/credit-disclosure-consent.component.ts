import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, of } from 'rxjs';
import { IResQuotationDetail } from 'src/app/interface/i-res-quotation-detail';
import { BaseService } from 'src/app/service/base/base.service';
import { LoadingService } from 'src/app/service/loading.service';
import { QuotationService } from 'src/app/service/quotation.service';

@Component({
    selector: 'app-credit-disclosure-consent',
    templateUrl: './credit-disclosure-consent.component.html',
    styleUrls: ['./credit-disclosure-consent.component.scss'],
    standalone: false
})
export class CreditDisclosureConsentComponent extends BaseService implements OnInit {

  @Input() quotationReq = {} as Observable<IResQuotationDetail>;
  quotationdatatemp: IResQuotationDetail = {} as IResQuotationDetail
  disableNextBtn: boolean = true

  @Output() creditConsentValid = new EventEmitter<boolean>();
  @Output() someEvent = new EventEmitter<string>();

  is_credit_disclosure = new FormControl<number | null>(null, Validators.required)

  creditdisclosureForm = this.fb.group({
    is_credit_disclosure: this.is_credit_disclosure
  })


  titlename: string = ''
  firstname: string = ''
  lastname: string = ''
  citizenid: string = ''
  dateValue: Date | null = null

  constructor(
    private fb: FormBuilder,
    private quotationService: QuotationService,
    private loadingService: LoadingService,
    public override dialog: MatDialog,
    public override _snackBar: MatSnackBar,
  ) {
    super(dialog, _snackBar)
  }

  ngOnInit(): void {

    this.quotationReq.subscribe({
      next: (result) => {

        this.quotationdatatemp = result

        if (this.quotationdatatemp.data) {

          const quodata = this.quotationdatatemp.data[0]
          // === get date from server ===

          this.quotationService.MPLS_getservertime().subscribe({
            next: (res) => {
              if (res.status === 200) {


                this.dateValue = res.date ? res.date : null

                // === set txt from quotation data ===
                this.firstname = quodata.first_name
                this.lastname = quodata.last_name
                this.citizenid = quodata.idcard_num
                this.titlename = quodata.title_name

                // === set e-paper consent value ===
                if (this.quotationdatatemp.data[0].cs_app_key_id !== '' && this.quotationdatatemp.data[0].cs_app_key_id !== null) {
                  this.creditdisclosureForm.controls.is_credit_disclosure.setValue(this.quotationdatatemp.data[0].cs_is_credit_consent ? this.quotationdatatemp.data[0].cs_is_credit_consent : null)
                  this.creditdisclosureForm.updateValueAndValidity()
                  this.disableNextBtn = false
                  this.creditConsentValid.emit(true)
                }

                if (this.quotationdatatemp.data[0].quo_status === 1 || this.quotationdatatemp.data[0].cs_is_credit_consent !== null) {
                  this.creditdisclosureForm.disable();
                }

                // === value Change ===
                this.creditdisclosureForm.controls.is_credit_disclosure.valueChanges.subscribe((res) => {
                  if (this.creditdisclosureForm.controls.is_credit_disclosure.valid) {
                    this.disableNextBtn = false
                    this.creditConsentValid.emit(true)
                  } else {
                    this.disableNextBtn = true
                    this.creditConsentValid.emit(true)
                  }
                })

              } else {
                // === error from api ===
                console.log(`error in get server time : ${res.message ? res.message : 'No return message'}`)
              }
            }, error: (e) => {
              console.log(`error : ${e.message ? e.message : 'No return message'}`)

            }, complete: () => {
            }
          })
        }

      }, error: (e) => {
        console.log(`Error : ${e.message ? e.message : 'No return message'}`)

      }, complete: () => {
        console.log(`trigger complete credit disclosure consent !`)
      }
    })
  }

  callParent(): void {
    this.someEvent.next('onNextStep');
  }

}
