import { forkJoin, map, Observable, startWith } from 'rxjs';
import { IResMasterMrtaSellerData } from 'src/app/interface/i-res-master-mrta-seller';
import { IResMrtaProductData } from 'src/app/interface/i-res-mrta-product';
import { MasterDataService } from 'src/app/service/master.service';
import { AbstractControl, FormBuilder, FormControl, ValidatorFn } from '@angular/forms';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { IMartaPaymentInsurance } from 'src/app/interface/i-mrta-payment-insurance';
import { MrtaService } from 'src/app/service/mrta.service';
import { IReqMrtaAge } from 'src/app/interface/i-req-mrta-age';
import { IResMrtaMasterData } from 'src/app/interface/i-res-mrta-master';
import * as moment from 'moment';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatDialog } from '@angular/material/dialog';
import { MainDialogComponent } from 'src/app/widget/dialog/main-dialog/main-dialog.component';

@Component({
  selector: 'app-mrta-product',
  templateUrl: './mrta-product.component.html',
  styleUrls: ['./mrta-product.component.scss']
})
export class MrtaProductComponent {

  valuevalid: boolean = false;
  mrtamainresult = [] as IResMrtaProductData[]
  mrtainsurancedata = [] as IResMrtaProductData[]
  mrtainsurancedatayear = [] as IResMrtaProductData[]
  mrtasellerdata = [] as IResMasterMrtaSellerData[]
  filterSellerList?: Observable<IResMasterMrtaSellerData[]>
  SellerSelectText = ''

  // *** new master mrta list new requirement (14/06/2023) ****
  mrtamasterresult = [] as IResMrtaMasterData[]
  current_insur_code = {} as IResMrtaMasterData | undefined




  textshow: string = 'ข้อมูลไม่เพียงพอในการเลือกประกัน MRTA';
  // calculatebtnvisible: boolean = false
  showmrtapayment: boolean = false
  paymentvalue: number = 0
  showgenQRbtn: boolean = false
  insurer_code: string = ''

  @Input() pay_status: number = 0
  @Input() active_status: number = 0
  @Input() insurance_code: string = ''
  @Input() insurance_year: number = 0
  @Input() insurance_seller: string = ''
  @Input() out_stand: number = 0
  @Input() age: number = 0
  @Input() gender: number = 0
  @Input() showseller: boolean = false
  // *** new input for new cal age for mrta (14/06/2023) ***
  @Input() birth_date: Date | null = null;
  // @Input() busi_code: string = '001'; // *** waiting send busi_code from product-detail page (14/06/2023) ***
  @Input() busi_code: string | null = null; // *** waiting send busi_code from product-detail page (14/06/2023) ***

  @Output() emitqrtoparentclickbtn = new EventEmitter<IMartaPaymentInsurance>()
  @Output() emitqrtoparentshowqr = new EventEmitter<IMartaPaymentInsurance>()

  mrtafieldValue = new FormControl()
  mrtayearfieldValue = new FormControl()
  mrtasellerfieldValue = new FormControl()

  mrtaForm = this.fb.group({
    mrtafieldValue: this.mrtafieldValue,
    mrtayearfieldValue: this.mrtayearfieldValue,
    mrtasellerfieldValue: this.mrtasellerfieldValue
  })

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
    private masterDataService: MasterDataService,
    private mrtaService: MrtaService,
    private breakpointObserver: BreakpointObserver,
    public dialog: MatDialog
  ) {

    this.mrtaForm.valueChanges.subscribe((value) => {
      this.checkshowgenQRbtn()
    })

  }

  private _filterSeller(value: string): IResMasterMrtaSellerData[] {
    const filterValue = value.toLowerCase();

    return this.mrtasellerdata.filter(value => value.emp_id.includes(filterValue) || value.fullname.includes(filterValue))
  }

  validateSellerformat(listitem: IResMasterMrtaSellerData[]): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const index = listitem.findIndex(items => {
        return (new RegExp('\^' + items.emp_id + '\$')).test(control.value);
      })
      return index < 0 ? { 'wrongFormatSeller': { value: control.value } } : null;
    };
  }

  getmrtainsurance(out_stand: number, gender: number, birth_date: Date | null) {
    this.paymentvalue = 0
    this.showmrtapayment = false
    this.mrtaForm.controls.mrtafieldValue.setValue('');
    this.mrtaForm.controls.mrtayearfieldValue.setValue('');
    this.mrtaForm.controls.mrtayearfieldValue.disable();

    forkJoin(
      [
        // this.masterDataService.getmrtainsurance(out_stand, age, gender),
        this.mrtaService.getmrtamaster({ busi_code: this.busi_code ? this.busi_code : '' }),
        this.masterDataService.getmrtaseller()
      ]
    ).subscribe((results) => {

      // *** mrta master new list (14/06/2023) ***
      this.mrtamasterresult = results[0].data
      if (results[0].data) {

        // *** calculate age by insur_code (new requirment 14/06/2023) ***

        // *** create request_date , birth_date and set to string (now date) ***
        const request_date_str = moment().format('DD/MM/yyyy')
        const birth_date_str = moment(this.birth_date).format('DD/MM/yyyy')

        if (
          this.current_insur_code !== undefined &&
          (this.current_insur_code && Object.keys(this.current_insur_code).length > 0) &&
          birth_date_str !== null &&
          request_date_str !== null
        ) {
          this.mrtaService.getmrtaage({
            insur_code: this.current_insur_code.insurer_code,
            busi_code: this.busi_code ? this.busi_code : '',
            birth_date: birth_date_str,
            request_date: request_date_str
          }).subscribe({
            next: (res_age) => {
              const mrta_age = res_age.data.mrta_age

              if (mrta_age !== 0 && mrta_age !== null && mrta_age !== undefined && out_stand !== 0) {

                // *** get getmrtainsurance and filter result with insurance_code ***
                this.masterDataService.getmrtainsurance(
                  out_stand, mrta_age, gender
                ).subscribe({
                  next: (res_mrta_insurance_list) => {

                    if (res_mrta_insurance_list.data.length !== 0) {
                      this.valuevalid = true;
                      const filterresult = res_mrta_insurance_list.data.filter((value, index, self) =>
                        index === self.findIndex((t) => (
                          t.insurance_code === value.insurance_code
                        ))
                      )
                      this.mrtainsurancedata = filterresult

                      this.mrtainsurancedata = this.mrtainsurancedata.sort((a, b) => {
                        if (a.plan > b.plan) {
                          return 1; // swap positions if 'a' comes after 'b'
                        }
                        if (a.plan < b.plan) {
                          return -1; // keep positions if 'a' comes before 'b'
                        }
                        return 0; // keep positions if 'a' and 'b' are equal
                      })

                    } else {
                      this.textshow = 'ไม่พบประกัน MRTA ตามเงื่อนไขที่กำหนด'
                      this.valuevalid = false
                    }
                  }, error: (e) => {
                    // handle get mrta insurance missing here
                    // *******************************
                  }, complete: () => {

                  }
                })

              } else {
                // handle calculate age missing here
                // *******************************
                console.log(`Ja ja`)
              }
            }, error: (e) => {

            }, complete: () => {

            }
          })
        } else {
          this.valuevalid = true
        }
      }


      // === for seller ==== 
      this.mrtasellerdata = results[1].data

      if (this.mrtasellerdata) {
        this.filterSellerList = this.mrtaForm.controls.mrtasellerfieldValue.valueChanges.pipe(
          startWith(''),
          map(value => this._filterSeller(value)),
        )
      }
      let selectValue = this.mrtasellerdata.find((items: { emp_id: string }) => {
        return items.emp_id == this.insurance_seller
      })

      if (selectValue) {
        this.SellerSelectText = selectValue.fullname
      }

      this.stampmrtarecent()

    })
  }

  ngOnChanges(changes: SimpleChanges) {
    if (
      this.out_stand && this.out_stand !== 0 &&
      this.age &&
      this.gender &&
      // this.busi_code &&
      this.birth_date &&
      this.busi_code
    ) {
      this.getmrtainsurance(this.out_stand, this.gender, this.birth_date)
    } else {
      this.textshow = 'ข้อมูลไม่เพียงพอในการเลือกประกัน MRTA'
      this.paymentvalue = 0
      this.showmrtapayment = false
      this.valuevalid = false
    }

    // === check pay_staus (1/10/2022) ===
    if (this.pay_status == 1) {
      this.mrtaForm.disable()
      this.showgenQRbtn = false
    }
  }

  stampmrtarecent() {

    // *** create request_date , birth_date and set to string (now date) ***
    const request_date = moment().format('DD/MM/yyyy')
    const birth_date = moment(this.birth_date).format('DD/MM/yyyy')

    this.mrtaService.getmrtaage({
      insur_code: this.insurance_code,
      busi_code: this.busi_code ? this.busi_code : '',
      birth_date: birth_date,
      request_date: request_date
    }).subscribe({
      next: (res_age) => {
        const mrta_age = res_age.data.mrta_age

        if (mrta_age !== 0 && mrta_age !== null && mrta_age !== undefined && this.out_stand !== 0) {

          // *** get getmrtainsurance and filter result with insurance_code ***
          this.masterDataService.getmrtainsurance(
            this.out_stand, mrta_age, this.gender
          ).subscribe({
            next: (res_mrta_insurance_list) => {

              if (res_mrta_insurance_list.data.length !== 0) {
                this.valuevalid = true;
                const filterresult = res_mrta_insurance_list.data.filter((value, index, self) =>
                  index === self.findIndex((t) => (
                    t.insurance_code === value.insurance_code
                  ))
                )
                this.mrtamasterresult = filterresult
                this.mrtainsurancedata = res_mrta_insurance_list.data

                // *** old stage *** 
                this.mrtaForm.controls.mrtafieldValue.setValue(this.insurance_code);
                if (this.mrtaForm.controls.mrtafieldValue.value) {
                  this.mrtaForm.controls.mrtayearfieldValue.setValue('')
                  this.mrtainsurancedatayear = this.mrtainsurancedata.filter((items) => {
                    return items.insurance_code === this.insurance_code
                  })

                  if (this.pay_status !== 1) {
                    this.mrtaForm.controls.mrtayearfieldValue.enable();
                  }
                }
                this.mrtaForm.controls.mrtayearfieldValue.setValue(this.insurance_year);

                const selectPlan = this.mrtainsurancedata.find((items) => {
                  return items.insurance_code == this.insurance_code && items.years_insur == this.insurance_year
                })

                if (selectPlan) {
                  this.paymentvalue = selectPlan.premium_insur
                  this.insurer_code = selectPlan.insurer_code
                  this.mrtaForm.controls.mrtasellerfieldValue.setValue(this.insurance_seller);
                  if (
                    this.mrtaForm.controls.mrtafieldValue.value &&
                    this.mrtaForm.controls.mrtayearfieldValue.value &&
                    this.mrtaForm.controls.mrtasellerfieldValue.value
                  ) {
                    this.showmrtapayment = true
                    // this.onclickgenqrpayment()

                    this.showqrcoderecord()
                  }
                }

                console.log('end')

              } else {
                this.textshow = 'ไม่พบประกัน MRTA ตามเงื่อนไขที่กำหนด'
                this.valuevalid = false
              }
            }, error: (e) => {
              // handle get mrta insurance missing here
              // *******************************
              console.log(`error : ${e.message}`)
            }, complete: () => {
              console.log('complete!')
            }
          })

        } else {
          // handle calculate age missing here
          // *******************************
          console.log(`jajastamp`)
        }
      }, error: (e) => {

      }, complete: () => {

      }
    })


    // *****************************************************************
    this.mrtaForm.controls.mrtafieldValue.setValue(this.insurance_code);
    if (this.mrtaForm.controls.mrtafieldValue.value) {
      this.mrtaForm.controls.mrtayearfieldValue.setValue('')
      this.mrtainsurancedatayear = this.mrtamainresult.filter((items) => {
        return items.insurance_code === this.insurance_code
      })

      if (this.pay_status !== 1) {
        this.mrtaForm.controls.mrtayearfieldValue.enable();
      }
    }
    this.mrtaForm.controls.mrtayearfieldValue.setValue(this.insurance_year);

    const selectPlan = this.mrtamainresult.find((items) => {
      return items.insurance_code == this.insurance_code && items.years_insur == this.insurance_year
    })

    if (selectPlan) {
      this.paymentvalue = selectPlan.premium_insur
      this.insurer_code = selectPlan.insurer_code
      this.mrtaForm.controls.mrtasellerfieldValue.setValue(this.insurance_seller);
      if (
        this.mrtaForm.controls.mrtafieldValue.value &&
        this.mrtaForm.controls.mrtayearfieldValue.value &&
        this.mrtaForm.controls.mrtasellerfieldValue.value
      ) {
        this.showmrtapayment = true
        // this.onclickgenqrpayment()

        this.showqrcoderecord()
      }
    }
  }

  onchagemrtainsurance($event: any) {
    this.showmrtapayment = false

    // *** set current insur_code for use calculate age (14/06/2023) ***
    this.current_insur_code = this.mrtamasterresult.find((item) => {
      return item.insurance_code === $event
    })
    // *****************************************************************

    // this.mrtaForm.controls.mrtayearfieldValue.setValue('')
    // this.mrtainsurancedatayear = this.mrtamainresult.filter((items) => {
    //   return items.insurance_code === $event
    // })

    if (this.pay_status !== 1) {
      this.mrtaForm.controls.mrtayearfieldValue.enable();
    }

    // *** new call list of mrta by new 4 field (insur_code, busi_code, birth_date, request_date) (14/06/2023) (P Angon) ***
    const fd: IReqMrtaAge = {
      insur_code: $event,
      busi_code: this.busi_code ? this.busi_code : '',
      birth_date: '',
      request_date: ''
    }

    // *** create request_date , birth_date and set to string (now date) ***
    const request_date = moment().format('DD/MM/yyyy')
    const birth_date = moment(this.birth_date).format('DD/MM/yyyy')

    this.mrtaService.getmrtaage({
      insur_code: $event,
      busi_code: this.busi_code ? this.busi_code : '',
      birth_date: birth_date,
      request_date: request_date
    }).subscribe({
      next: (res_age) => {
        const mrta_age = res_age.data.mrta_age

        if (mrta_age !== 0 && mrta_age !== null) {

          // *** get getmrtainsurance and filter result with insurance_code ***
          this.masterDataService.getmrtainsurance(
            this.out_stand, mrta_age, this.gender
          ).subscribe({
            next: (res_mrta_insurance_list) => {

              if (res_mrta_insurance_list.data.length !== 0) {
                this.valuevalid = true;
                let filterresult = res_mrta_insurance_list.data.filter((value, index, self) =>
                  index === self.findIndex((t) => (
                    t.insurance_code === value.insurance_code
                  ))
                )

                filterresult = filterresult.sort((a, b) => {
                  if (a.plan > b.plan) {
                    return 1; // swap positions if 'a' comes after 'b'
                  }
                  if (a.plan < b.plan) {
                    return -1; // keep positions if 'a' comes before 'b'
                  }
                  return 0; // keep positions if 'a' and 'b' are equal
                })

                // *** check insurance is enable in master mrta (11/07/2023) ***

                const checkmrtainclude = filterresult.some((x) => x.insurance_code == $event)

                if (checkmrtainclude) {
                  // *** mrta insurance is enable ***
                  // this.mrtamasterresult = filterresult

                  this.mrtainsurancedata = res_mrta_insurance_list.data

                  this.mrtaForm.controls.mrtayearfieldValue.setValue('')
                  this.mrtainsurancedatayear = this.mrtainsurancedata.filter((items) => {
                    return items.insurance_code === $event
                  })

                  console.log('end')
                } else {
                  // *** mrta insurance not found with condition ****
                  this.dialog.open(MainDialogComponent, {
                    panelClass: `custom-dialog-container`,
                    data: {
                      header: ``,
                      message: `ประกันที่เลือกไม่อยู่ในเงื่อนไขที่กำหนด`,
                      button_name: `ตกลง`
                    }
                  }).afterClosed().subscribe((results) => {
                    // *** handle dialog close here ***
                    this.mrtaForm.controls.mrtafieldValue.setValue(null, {emitEvent: false})
                    this.mrtaForm.controls.mrtayearfieldValue.setValue(null, {emitEvent: false})
                  })
                }

              } else {
                this.textshow = 'ไม่พบประกัน MRTA ตามเงื่อนไขที่กำหนด'
                this.valuevalid = false
              }
            }, error: (e) => {
              // handle get mrta insurance missing here
              // *******************************
              console.log(`error : ${e.message}`)
            }, complete: () => {
              console.log('complete!')
            }
          })

        } else {
          // handle calculate age missing here
          // *******************************
        }
      }, error: (e) => {

      }, complete: () => {

      }
    })

  }

  onchangemrtayearinsurance($event: any) {
    // *** can use this.mrtaForm.controls.mrtayearfieldValue.valuechange().subscribe(item) instead ***
    // === get premium_insur from list ===
    const insurance_code = this.mrtaForm.controls.mrtafieldValue.value
    const insur_year = $event

    const selectPlan = this.mrtainsurancedata.find((items) => {
      return items.insurance_code == insurance_code && items.years_insur == insur_year
    })

    if (selectPlan) {
      this.paymentvalue = selectPlan.premium_insur
      this.insurer_code = selectPlan.insurer_code
      this.showmrtapayment = $event ? true : false
    }
  }

  onChangeSeller($event: any) {
    const value = $event
    let selectValue = this.mrtasellerdata.find((items: { emp_id: string }) => {
      return items.emp_id == value
    })

    // === set validate format dealer code === 
    this.mrtaForm.controls.mrtasellerfieldValue.setValidators(this.validateSellerformat(this.mrtasellerdata))

    if (typeof selectValue !== 'undefined') {
      // === set text of dealer select === 
      this.SellerSelectText = selectValue.fullname;
    } else {
      this.SellerSelectText = ''
    }
  }

  checkshowgenQRbtn() {
    if (
      this.mrtaForm.controls.mrtafieldValue.value &&
      this.mrtaForm.controls.mrtayearfieldValue.value &&
      this.mrtaForm.controls.mrtasellerfieldValue.value &&
      this.mrtaForm.controls.mrtasellerfieldValue.valid
    ) {
      this.showgenQRbtn = true
    } else {
      this.showgenQRbtn = false
    }
  }

  onclickgenqrpayment() {
    this.emitqrtoparentclickbtn.emit({
      out_stand: this.out_stand,
      age: this.age,
      gender: this.gender,
      sellerid: this.mrtaForm.controls.mrtasellerfieldValue.value,
      premium_insur: this.paymentvalue,
      pay_status: 0,
      // application_num: '', // === set application_num on send-car component (27/09/2022) ===
      insurance_code: this.mrtaForm.controls.mrtafieldValue.value,
      insurance_year: this.mrtaForm.controls.mrtayearfieldValue.value,
      insurance_seller: this.mrtaForm.controls.mrtasellerfieldValue.value,
      insurer_code: this.insurer_code,
      busi_code: this.busi_code ? this.busi_code : ''
    })
  }

  showqrcoderecord() {
    this.emitqrtoparentshowqr.emit({
      out_stand: this.out_stand,
      age: this.age,
      gender: this.gender,
      sellerid: this.mrtaForm.controls.mrtasellerfieldValue.value,
      premium_insur: this.paymentvalue,
      pay_status: this.pay_status,
      // application_num: '', // === set application_num on send-car component (27/09/2022) ===
      insurance_code: this.mrtaForm.controls.mrtafieldValue.value,
      insurance_year: this.mrtaForm.controls.mrtayearfieldValue.value,
      insurance_seller: this.mrtaForm.controls.mrtasellerfieldValue.value,
      insurer_code: this.insurer_code
    })
  }




}
