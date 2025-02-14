import { SmsService } from 'src/app/service/sms.service';
import { MasterDataService } from 'src/app/service/master.service';
import { IMartaPaymentInsurance } from 'src/app/interface/i-mrta-payment-insurance';
import { ImageUtilService } from 'src/app/service/image-util.service';
import { ImageService } from 'src/app/service/image.service';
import { Component, Input, OnInit, Output, SimpleChanges, EventEmitter } from '@angular/core';
import { IUserToken } from 'src/app/interface/i-user-token';

@Component({
    selector: 'app-qr-barcode-mrta',
    templateUrl: './qr-barcode-mrta.component.html',
    styleUrls: ['./qr-barcode-mrta.component.scss'],
    standalone: false
})
export class QrBarcodeMrtaComponent {

  @Input() qrpaymentdata = <IMartaPaymentInsurance>{}

  @Output() genfinish = new EventEmitter<boolean>(false)
  @Output() updatepaymentstatus = new EventEmitter<boolean>(false)

  image_qr$: Promise<string> | null = null;
  image_barcode$: Promise<string> | null = null;
  showconfirmbtn: boolean = false
  showtxtpayment: boolean = false
  lockconfirmbtn: boolean = false




  constructor(
    private imageService: ImageService,
    private imageUtilService: ImageUtilService,
    private masterDataService: MasterDataService,
    private smsService: SmsService
  ) {
    this.qrpaymentdata.pay_status = undefined
    this.qrpaymentdata.age = undefined
    this.qrpaymentdata.application_num = undefined
    this.qrpaymentdata.gender = undefined
    this.qrpaymentdata.out_stand = undefined
    this.qrpaymentdata.pay_status = undefined
    this.qrpaymentdata.premium_insur = undefined
    this.qrpaymentdata.sellerid = undefined
    this.qrpaymentdata.first_name = undefined
    this.qrpaymentdata.last_name = undefined
    this.qrpaymentdata.premium_insur = undefined
    this.qrpaymentdata.phone_number = undefined
    this.qrpaymentdata.quotationid = undefined
    this.qrpaymentdata.contract_no = undefined
  }


  ngOnChanges(changes: SimpleChanges) {

    try {

      this.qrpaymentdata.pay_status = changes['qrpaymentdata'].currentValue.pay_status
      this.qrpaymentdata.age = changes['qrpaymentdata'].currentValue.age
      this.qrpaymentdata.application_num = changes['qrpaymentdata'].currentValue.application_num
      this.qrpaymentdata.gender = changes['qrpaymentdata'].currentValue.gender
      this.qrpaymentdata.out_stand = changes['qrpaymentdata'].currentValue.out_stand
      this.qrpaymentdata.pay_status = changes['qrpaymentdata'].currentValue.pay_status
      this.qrpaymentdata.sellerid = changes['qrpaymentdata'].currentValue.sellerid
      this.qrpaymentdata.first_name = changes['qrpaymentdata'].currentValue.first_name
      this.qrpaymentdata.last_name = changes['qrpaymentdata'].currentValue.last_name
      this.qrpaymentdata.premium_insur = changes['qrpaymentdata'].currentValue.premium_insur
      this.qrpaymentdata.phone_number = changes['qrpaymentdata'].currentValue.phone_number
      this.qrpaymentdata.quotationid = changes['qrpaymentdata'].currentValue.quotationid
      this.qrpaymentdata.contract_no = changes['qrpaymentdata'].currentValue.contract_no

      const isFin = this.checkfinancerole()
      if (isFin === 'FI') {
        if (this.qrpaymentdata.pay_status !== 1) {
          this.showconfirmbtn = true
        } else {
          this.showtxtpayment = true
          this.lockconfirmbtn = true
          this.showconfirmbtn = false
        }
      } else {
        // === checker === 
        if (this.qrpaymentdata.pay_status !== 1) {

        } else {
          this.showtxtpayment = true
        }
      }
      this.checkqrpaymentvalue()


    } catch (e) {
      // === do nothing === 
    }

  }

  onclickconfirmqrpaymentbtn() {
    if (this.qrpaymentdata.application_num) {
      this.masterDataService.confirmqrpayment(
        this.qrpaymentdata.application_num,
        (this.qrpaymentdata.contract_no) ? this.qrpaymentdata.contract_no : ''
      ).subscribe((result) => {
        console.log(`return confirm qr payment value : ${JSON.stringify(result)}`)

        if (result.status == 200) {

          // === flag pay_status back to send-car service === 

          this.updatepaymentstatus.emit(true)

          // == send sms ===

          const phoneNo = this.qrpaymentdata.phone_number
          if (phoneNo) {
            this.smsService.sendsmsconfirmpayment({
              quotationid: '',
              phone_no: phoneNo,
              sms_message: `เรียน คุณ ${this.qrpaymentdata.first_name} ${this.qrpaymentdata.last_name} ขอบคุณที่ชำระค่าเบี้ยประกันคุ้มครองสินเชื่อจำนวน ${this.qrpaymentdata.premium_insur} บาท`,
              sender: 'MICROPLUS',
              force: 'Corporate'
            }).subscribe(({
              next: (resultsms) => {
                console.log(`results sms status : ${resultsms}`)

                if (result.data[0].pay_status !== 1) {
                  this.showconfirmbtn = true
                } else {
                  this.showtxtpayment = true
                  this.lockconfirmbtn = true
                  this.showconfirmbtn = false
                }
              }, error: (e) => {
                console.log(`error sms status : ${e}`)

                if (result.data[0].pay_status !== 1) {
                  this.showconfirmbtn = true
                } else {
                  this.showtxtpayment = true
                  this.lockconfirmbtn = true
                  this.showconfirmbtn = false
                }
              }, complete: () => {
                if (result.data[0].pay_status !== 1) {
                  this.showconfirmbtn = true
                } else {
                  this.showtxtpayment = true
                  this.lockconfirmbtn = true
                  this.showconfirmbtn = false
                }
              }
            }))

            // ==== end send sms ====
          }

          if (result.data[0].pay_status !== 1) {
            this.showconfirmbtn = true
          } else {
            this.showtxtpayment = true
            this.lockconfirmbtn = true
            this.showconfirmbtn = false
          }
        }
      })
    }

  }
  onclickconfirmqrpaymentbtn_no_sms() {

    // *** clone from onclickconfirmqrpaymentbtn but no send sms (add-on 20/02/2023) ***

    if (this.qrpaymentdata.application_num) {
      this.masterDataService.confirmqrpayment(
        this.qrpaymentdata.application_num,
        (this.qrpaymentdata.contract_no) ? this.qrpaymentdata.contract_no : ''
      ).subscribe({
        next: (result) => {
          {
            console.log(`return confirm qr payment value : ${JSON.stringify(result)}`)

            if (result.status === 200) {

              this.updatepaymentstatus.emit(true)

              if (result.data[0].pay_status !== 1) {
                this.showconfirmbtn = true
              } else {
                this.showtxtpayment = true
                this.lockconfirmbtn = true
                this.showconfirmbtn = false
              }
            }
          }
        }, error: (e) => {
          console.log(`Error confirmqrpayment : ${e.message ? e.message : 'No return error message !'}`)
        }, complete: () => {
          console.log(`Complete confirmqrpayment!`)
        }
      })
    }
  }


  checkqrpaymentvalue() {
    if (
      this.qrpaymentdata.premium_insur &&
      this.qrpaymentdata.application_num
    ) {
      this.genqrpayment(this.qrpaymentdata.application_num, this.qrpaymentdata.premium_insur)
    }
  }

  genqrpayment(application_num: string, premium_insur: number) {
    this.imageService.genmrtaqr(application_num, premium_insur).subscribe((result) => {

      if (result.status === 200) {
        this.genfinish.emit(true)
      }
      this.image_qr$ = new Promise((resolve) => {
        resolve(this.imageUtilService.getUrlImage(result.data[0].image_file[1].data))
      })
      this.image_barcode$ = new Promise((resolve) => {
        resolve(this.imageUtilService.getUrlImage(result.data[0].image_file[0].data))
      })
    })
  }

  checkfinancerole() {
    const userdata = localStorage.getItem('currentUser')

    if (userdata) {
      const userdataObj = (JSON.parse(userdata) as IUserToken).data;
      return userdataObj.RADMIN
    }
    return ''
  }
}