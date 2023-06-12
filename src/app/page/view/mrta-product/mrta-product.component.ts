import { forkJoin, map, Observable, startWith } from 'rxjs';
import { IResMasterMrtaSellerData } from 'src/app/interface/i-res-master-mrta-seller';
import { IResMrtaProductData } from 'src/app/interface/i-res-mrta-product';
import { MasterDataService } from 'src/app/service/master.service';
import { AbstractControl, FormBuilder, FormControl, ValidatorFn } from '@angular/forms';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { IMartaPaymentInsurance } from 'src/app/interface/i-mrta-payment-insurance';

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

  constructor(
    private fb: FormBuilder,
    private masterDataService: MasterDataService
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

  getmrtainsurance(out_stand: number, age: number, gender: number) {
    this.paymentvalue = 0
    this.showmrtapayment = false
    this.mrtaForm.controls.mrtafieldValue.setValue('');
    this.mrtaForm.controls.mrtayearfieldValue.setValue('');
    this.mrtaForm.controls.mrtayearfieldValue.disable();

    forkJoin(
      [
        this.masterDataService.getmrtainsurance(out_stand, age, gender),
        this.masterDataService.getmrtaseller()
      ]
    ).subscribe((results) => {
      // === for mrta product ====
      this.mrtamainresult = results[0].data

      if (results[0].data.length !== 0) {
        this.valuevalid = true;
        const filterresult = results[0].data.filter((value, index, self) =>
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
      this.out_stand &&
      this.age &&
      this.gender
    ) {
      this.getmrtainsurance(this.out_stand, this.age, this.gender)
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
    this.mrtaForm.controls.mrtayearfieldValue.setValue('')
    this.mrtainsurancedatayear = this.mrtamainresult.filter((items) => {
      return items.insurance_code === $event
    })

    if (this.pay_status !== 1) {
      this.mrtaForm.controls.mrtayearfieldValue.enable();
    }
  }

  onchangemrtayearinsurance($event: any) {
    // === get premium_insur from list ===
    const insurance_code = this.mrtaForm.controls.mrtafieldValue.value
    const insur_year = $event

    const selectPlan = this.mrtamainresult.find((items) => {
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
      insurer_code: this.insurer_code
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
