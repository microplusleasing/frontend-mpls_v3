import { MatDialog } from '@angular/material/dialog';
import { BtwService } from 'src/app/service/btw.service';
import { BaseService } from 'src/app/service/base/base.service';
import { DipchipService } from 'src/app/service/dipchip.service';
import { AuthService } from 'src/app/service/auth/auth.service';
import { Router } from '@angular/router';
import { Component, Input, SimpleChanges } from '@angular/core';
import { MainDialogComponent } from '../dialog/main-dialog/main-dialog.component';


@Component({
    selector: 'app-backward-bar',
    templateUrl: './backward-bar.component.html',
    styleUrls: ['./backward-bar.component.scss'],
    standalone: false
})
export class BackwardBarComponent {

  disablecarcheckbtn: boolean = true;


  @Input() fname: string = ''
  @Input() lname: string = ''
  @Input() hpno: string = ''
  @Input() due: string = ''
  @Input() branch: string = ''
  @Input() bill: string = ''
  @Input() status: string = ''
  @Input() pageno: string = ''
  @Input() carcheckstatus: string = ''
  @Input() holder: string = ''
  @Input() apd: string = ''

  @Input() ContractNo: string = ''
  @Input() Username: string = ''
  @Input() menu_id: string = ''

  constructor(
    private router: Router,
    private dipchipService: DipchipService,
    private baseService: BaseService,
    private btwService: BtwService,
    private dialog: MatDialog
  ) {
    this.menu_id = 'I148'
  }

  ngOnChanges($event: SimpleChanges) {
    if (this.ContractNo && this.Username) {
      this.disablecarcheckbtn = false
    } else {
      this.disablecarcheckbtn = true
    }
  }

  onclickbackward() {
    // this.router.navigate(['collector'])
    this.router.navigate(
      ['/collector-view'],
      {
        queryParams: {
          fname: this.fname,
          lname: this.lname,
          hpno: this.hpno,
          due: this.due,
          branch: this.branch,
          bill: this.bill,
          status: this.status,
          pageno: this.pageno,
          carcheckstatus: this.carcheckstatus,
          holder: this.holder,
          apd: this.apd
        }
      }
    );
  }

  async onclickcarcheck() {
    // === get token form user login (10/07/2022) === 

    const rolecheck = await this.btwService.checkmenuidpermission(this.menu_id)

    if(rolecheck) {
      if (this.Username) {
        this.dipchipService.addtimetokenEst().subscribe({
          next: (value) => {
            this.dipchipService.getdipchiptoken().subscribe((value) => {
              const token = value.data[0].token_key ? value.data[0].token_key : ''
              const param = this.baseService.Hash(`ContractNo=${this.ContractNo}&Username=${this.Username}&Token=${token}&AccType=Checker`)
              const url = this.dipchipService.dipchipendpoint + `/Mpls-CustomerInfo?Key=${param}`
              window.open(url, '_blank');
            })
          }, error: (e) => {
            console.log(e)
          }
        })
      }
    } else {
      this.dialog.open(MainDialogComponent, {
        panelClass: 'custom-dialog-container',
        data: {
          header: `คุณไม่มีสิทธิ์`,
          message: `ไม่มีสิทธิ์เข้าใช้เมนูดังกล่าว`,
          button_name: 'ตกลง'
        }
      }).afterClosed().subscribe(result => {
        // === not stage here ==== 
      });
    }

  }


}
