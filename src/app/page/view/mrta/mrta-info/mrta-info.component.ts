import { MatDialog } from '@angular/material/dialog';
import { MasterDataService } from 'src/app/service/master.service';
import { IResBtwMrtaInfo, IResBtwMrtaInfoData } from '../../../../interface/i-res-btw-mrta-info';
import { lastValueFrom, map, Observable } from 'rxjs';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { BtwService } from 'src/app/service/btw.service';
import { Component, OnInit } from '@angular/core';
import { IMartaPaymentInsurance } from 'src/app/interface/i-mrta-payment-insurance'; // replace for Mrtapaymentisurance
import { IReqSaveQrMrta } from 'src/app/interface/i-req-save-qr-mrta';
import { MainDialogComponent } from 'src/app/widget/dialog/main-dialog/main-dialog.component';
import { BreakpointObserver } from '@angular/cdk/layout';
import { LoadingService } from 'src/app/service/loading.service';
@Component({
  selector: 'app-mrta-info',
  templateUrl: './mrta-info.component.html',
  styleUrls: ['./mrta-info.component.scss']
})
export class MrtaInfoComponent implements OnInit {

  menu_id: string
  loaddatafinish: boolean
  application_num: string = '';
  mrtainfodata = {} as IResBtwMrtaInfoData

  qrTabIndex: number
  lockqrpage: boolean
  MRTAdata = {} as IMartaPaymentInsurance
  _ireqsaveqrmrta = {} as IReqSaveQrMrta
  age: number
  gender: number

  out_stand: number = 0
  insurance_code: string = ''
  insurance_year: number = 0
  insurance_seller: string = ''
  active_status: number = 0
  pay_status: number = 0

  textnotfound: string

  cardLayout = this.breakpointObserver
    .observe('(min-width: 800px)')
    .pipe(
      map(({ matches }) => {
        if (matches) {
          return {
            columns: 12,
            list: { maxcols: 12, cols6: 6, cols4: 4, cols3: 3, cols2: 2, col: 1 },
            rowHeight: 50
          };
        }

        return {
          columns: 1,
          list: { maxcols: 1, cols6: 1, cols4: 1, cols3: 1, cols2: 1, col: 1 },
          rowHeight: 30
        };
      })
    );

  constructor(
    private btwService: BtwService,
    private actRoute: ActivatedRoute,
    private router: Router,
    private masterDataService: MasterDataService,
    private matDialog: MatDialog,
    private loadingService: LoadingService,
    private breakpointObserver: BreakpointObserver
  ) {
    this.loaddatafinish = false
    this.menu_id = 'M108'
    this.qrTabIndex = 0
    this.lockqrpage = true
    this.pay_status = 0
    this.age = 0
    this.gender = 0
    this.textnotfound = ''
  }

  async ngOnInit() {

    this.loadingService.showLoader()
    // === get mrta info service === 
    const rolepermis = await this.btwService.checkmenuidpermission(this.menu_id)
    if (!rolepermis) {
      this.loadingService.hideLoader()
      this.matDialog.open(MainDialogComponent, {
        panelClass: 'custom-dialog-container',
        data: {
          header: 'ไม่สามารถเข้าถึงข้อมูล',
          message: 'คุณไม่มีสิทธิ์ในการเข้าถึงหน้าขายประกัน MRTA',
          button_name: 'ตกลง'
        }
      }).afterClosed().subscribe(result => {
        // === clear token and go to login page === 
        this.router.navigate(['/home'])
      });
    } else {
      this.actRoute.queryParams.subscribe(params => {
        this.application_num = params['id'];
        this.getmrtainfo(this.application_num)
      });
    }
  }

  async getmrtainfo(application_num: string) {
    this.btwService.getmrtainfo(application_num).subscribe({
      next: async (result) => {
        this.loadingService.hideLoader()
        // === clear mrtaparam before map new === 
        this.out_stand = 0
        this.age = 0
        this.gender = 0

        if (result.data.length !== 0) {
          this.loaddatafinish = true
          this.mrtainfodata = result.data[0]
          this.gender = this.mrtainfodata.sex

          const formatbirthdatenew = this.mrtainfodata.birth_date_th
          if (formatbirthdatenew) {
            const agecalcualte = await lastValueFrom(this.masterDataService.getagefrombirthdate(formatbirthdatenew))
            // const agecalcualte = await lastValueFrom(this.masterDataService.calculateage_db(formatbirthdatenew))
            this.age = agecalcualte.data[0].age_year

          }
          const checkmrtarecent = await lastValueFrom(this.masterDataService.checkmrtarecent(this.mrtainfodata.quo_key_app_id))

          if (checkmrtarecent.status == 200) {
            if (checkmrtarecent.data.length !== 0) {
              const recentmrtavalue = checkmrtarecent.data[0]
              this.pay_status = recentmrtavalue.pay_status
              this.active_status = recentmrtavalue.active_status
              this.insurance_seller = recentmrtavalue.seller_id
              this.insurance_code = recentmrtavalue.insurance_code
              this.insurance_year = recentmrtavalue.insurance_year
              this.out_stand = recentmrtavalue.out_stand
            } else {
              this.out_stand = this.mrtainfodata.out_stand
            }
          } else {
            this.out_stand = this.mrtainfodata.out_stand
          }
        } else {
          this.loaddatafinish = false
          this.textnotfound = 'ไม่พบรายการตามเลขที่ใบสมัคร (application_num)'
        }


      }, error: (e) => {
        this.loadingService.hideLoader()
        this.loaddatafinish = false
        console.log(`this is error with message : ${e}`)
      }
    })
  }

  receiveEmitChildClickBtn($event: IMartaPaymentInsurance) {

    // === get return MRTA value from child (mrta-product.component.ts) ===
    let mrtadataincludeapp = $event
    mrtadataincludeapp.application_num = this.mrtainfodata.application_num
    mrtadataincludeapp.first_name = this.mrtainfodata.first_name
    mrtadataincludeapp.last_name = this.mrtainfodata.last_name
    mrtadataincludeapp.phone_number = this.mrtainfodata.phone_number
    mrtadataincludeapp.contract_no = this.mrtainfodata.contract_no


    // === save qr mrta gen ===

    this._ireqsaveqrmrta.pay_status = $event.pay_status
    this._ireqsaveqrmrta.age = $event.age
    this._ireqsaveqrmrta.application_num = this.mrtainfodata.application_num
    this._ireqsaveqrmrta.gender = $event.gender
    this._ireqsaveqrmrta.insurance_code = $event.insurance_code
    this._ireqsaveqrmrta.insurance_seller = $event.insurance_seller
    this._ireqsaveqrmrta.insurance_year = $event.insurance_year
    this._ireqsaveqrmrta.insurer_code = $event.insurer_code
    this._ireqsaveqrmrta.out_stand = $event.out_stand
    this._ireqsaveqrmrta.premium_mrta = $event.premium_insur
    this._ireqsaveqrmrta.quotationid = this.mrtainfodata.quo_key_app_id
    this._ireqsaveqrmrta.phone_number = this.mrtainfodata.phone_number

    this.masterDataService.saveqrpayment(this._ireqsaveqrmrta).subscribe((results) => {
      if (results.status == 200) {
        this.MRTAdata = mrtadataincludeapp
      }
    })
  }

  receiveEmitChildShowQR($event: IMartaPaymentInsurance) {
    // === get return MRTA value from child (mrta-product.component.ts) ===
    let mrtadataincludeapp = $event
    mrtadataincludeapp.application_num = this.mrtainfodata.application_num
    mrtadataincludeapp.first_name = this.mrtainfodata.first_name
    mrtadataincludeapp.last_name = this.mrtainfodata.last_name
    mrtadataincludeapp.phone_number = this.mrtainfodata.phone_number
    mrtadataincludeapp.contract_no = this.mrtainfodata.contract_no

    // === save qr mrta gen ===
    this._ireqsaveqrmrta.pay_status = $event.pay_status
    this._ireqsaveqrmrta.age = $event.age
    this._ireqsaveqrmrta.application_num = this.mrtainfodata.application_num
    this._ireqsaveqrmrta.gender = $event.gender
    this._ireqsaveqrmrta.insurance_code = $event.insurance_code
    this._ireqsaveqrmrta.insurance_seller = $event.insurance_seller
    this._ireqsaveqrmrta.insurance_year = $event.insurance_year
    this._ireqsaveqrmrta.insurer_code = $event.insurer_code
    this._ireqsaveqrmrta.out_stand = $event.out_stand
    this._ireqsaveqrmrta.premium_mrta = $event.premium_insur
    this._ireqsaveqrmrta.quotationid = this.mrtainfodata.quo_key_app_id
    this._ireqsaveqrmrta.phone_number = this.mrtainfodata.phone_number


    this.MRTAdata = mrtadataincludeapp
  }

  checkqrgenfinish($event: boolean) {

    if ($event) {
      // === go to page gen qr ===
      this.lockqrpage = false
      this.qrTabIndex = 1;
    } else {
      // === do nothing ===
    }
  }

  updatepaymentStatus($event: boolean) {
    if ($event) {
      this.pay_status = 1
    }
  }

}
