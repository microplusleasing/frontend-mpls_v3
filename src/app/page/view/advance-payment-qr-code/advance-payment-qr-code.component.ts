import { MrtaService } from 'src/app/service/mrta.service';
import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { ImageUtilService } from 'src/app/service/image-util.service';
import * as moment from 'moment';

@Component({
    selector: 'app-advance-payment-qr-code',
    templateUrl: './advance-payment-qr-code.component.html',
    styleUrls: ['./advance-payment-qr-code.component.scss'],
    standalone: false
})
export class AdvancePaymentQrCodeComponent {


  showqr: boolean = false
  first_name_txt: string = ''
  last_name_txt: string = ''
  due: string = ''
  first_due: string = ''
  monthly: string = ''
  term: string = ''
  billpayment: string = ''
  image_qr$: Promise<string> | null = null;
  image_barcode$: Promise<string> | null = null;
  texthandle: string = ''
  logo: string = 'assets/image/logo.png';
  @Input() application_num: string = ''

  constructor(
    private mrtaService: MrtaService,
    private imageUtilService: ImageUtilService
  ) { }

  ngOnChanges($event: SimpleChanges) {
    if (this.application_num) {
      this.mrtaService.genadvanceqrpayment(this.application_num).subscribe({
        next: (results) => {
          // === success stage ===
          this.first_name_txt = results.data[0].name
          this.last_name_txt = results.data[0].sname
          this.due = results.data[0].due
          this.billpayment = results.data[0].bill_payment
          this.first_due = moment(results.data[0].first_due).format('DD/MM/yyyy')
          this.monthly = (results.data[0].monthly) ? (results.data[0].monthly).toString() : '-'
          this.term = (results.data[0].term) ? (results.data[0].term).toString() : '-'

          this.image_qr$ = new Promise((resolve) => {
            resolve(this.imageUtilService.getUrlImage(results.data[0].image_file[1].data))
            this.showqr = true
          })

          this.image_barcode$ = new Promise((resolve) => {
            resolve(this.imageUtilService.getUrlImage(results.data[0].image_file[0].data))
            this.showqr = true
          })
        }, error: (e) => {

        }, complete: () => {

        }
      })
    }
  }
}
