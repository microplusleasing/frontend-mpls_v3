import { MrtaService } from 'src/app/service/mrta.service';
import { ImageUtilService } from 'src/app/service/image-util.service';
import { Component, Input, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-total-loss-qr-code',
  templateUrl: './total-loss-qr-code.component.html',
  styleUrls: ['./total-loss-qr-code.component.scss']
})
export class TotalLossQrCodeComponent {

  showqr: boolean = false
  first_name_txt: string = ''
  last_name_txt: string = ''
  item_price: number = 0
  image_qr$: Promise<string> | null = null;
  texthandle: string = ''
  @Input() application_num: string = ''

  constructor(
    private mrtaService: MrtaService,
    private imageUtilService: ImageUtilService
  ) { }

  ngOnChanges($event: SimpleChanges) {
    if (this.application_num) {
      this.mrtaService.gentotallossqrpayment(this.application_num).subscribe({
        next: (results) => {

          if (results.status == 200) {
            // === success stage ===
            this.first_name_txt = results.data[0].name
            this.last_name_txt = results.data[0].sname
            this.item_price = results.data[0].item_price
            this.image_qr$ = new Promise((resolve) => {
              resolve(this.imageUtilService.getUrlImage(results.data[0].image_file[1].data))
              this.showqr = true
            })
          } else {
            console.log(`fail to gentotallossqrpayment with err message : ${results.message ? results.message : 'No return msg'}`)
          }
        }, error: (e) => {

        }, complete: () => {

        }
      })
    }
  }
}


