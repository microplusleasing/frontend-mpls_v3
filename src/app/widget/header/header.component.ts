import { IUserToken, IUserTokenData } from './../../interface/i-user-token';
import { IInfoDialog } from './../../interface/i-info-dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Component, OnInit } from '@angular/core';
// import { MrtaListComponent } from 'src/app/page/view/mrta/mrta-list/mrta-list.component';
import { BaseService } from 'src/app/service/base/base.service';
import { DipchipService } from 'src/app/service/dipchip.service';
import { InformationDialogComponent } from '../dialog/information-dialog/information-dialog.component';
import { MainDialogComponent } from '../dialog/main-dialog/main-dialog.component';
import { MrtaListComponent } from 'src/app/page/view/mrta/mrta-list/mrta-list.component';
import { environment } from 'src/environments/environment';
import { lastValueFrom } from 'rxjs';
import { BtwService } from 'src/app/service/btw.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  usersession: IUserTokenData = {} as IUserTokenData
  dialogData: IInfoDialog = {} as IInfoDialog
  username: string = '';




  constructor(
    public dialog: MatDialog,
    private router: Router,
    private baseService: BaseService,
    private dipchipService: DipchipService,
    private btwService: BtwService
  ) {

  }

  ngOnInit(): void {

    // const pageid = this.route.snapshot.paramMap.get('id');

    const userdata = localStorage.getItem('currentUser')
    if (userdata) {
      const userdataObj = (JSON.parse(userdata) as IUserToken).data;
      this.usersession = userdataObj
      this.username = userdataObj.FULLNAME ? userdataObj.FULLNAME : 'NO USER NAME'

      // === set data for send to dialog === 
      this.dialogData.header = 'Account Information';
      this.dialogData.fullname = userdataObj.FULLNAME ? userdataObj.FULLNAME : '-';
      this.dialogData.email = userdataObj.EMAIL ? userdataObj.EMAIL : '-';
      this.dialogData.role = userdataObj.ROLE ? userdataObj.ROLE : '-';
      this.dialogData.channal = userdataObj.channal ? userdataObj.channal : '-'
      this.dialogData.button_name = 'Close';
    }
  }

  getUserCurrentData(): IInfoDialog {

    try {

      const userdata = localStorage.getItem('currentUser')
      if (userdata) {
        const userdataObj = (JSON.parse(userdata) as IUserToken).data;
        this.usersession = userdataObj
        this.username = userdataObj.FULLNAME ? userdataObj.FULLNAME : 'NO USER NAME'

        // === set data for send to dialog === 
        this.dialogData.header = 'Account Information';
        this.dialogData.fullname = userdataObj.FULLNAME ? userdataObj.FULLNAME : '-';
        this.dialogData.email = userdataObj.EMAIL ? userdataObj.EMAIL : '-';
        this.dialogData.role = userdataObj.ROLE ? userdataObj.ROLE : '-';
        this.dialogData.channal = userdataObj.channal ? userdataObj.channal : '-'
        this.dialogData.button_name = 'Close';

        return this.dialogData
      } else {
        return {} as IInfoDialog
      }
    } catch (e) {
      return {} as IInfoDialog
    }

  }

  logoutClick() {
    this.dialog.open(MainDialogComponent, {
      panelClass: 'custom-dialog-container',
      data: {
        header: 'Confirm Logout',
        message: `Are You sure to Logout ?`,
        button_name: 'Yes'
      }
    }).afterClosed().subscribe(result => {
      if (result) {
        localStorage.clear()
        this.router.navigate(['/login'])
      }
    });
  }

  openUserInfo() {
    this.dialog.open(InformationDialogComponent, {
      panelClass: 'custom-dialog-component',
      width: '400px',
      // data: this.dialogData
      data: this.getUserCurrentData()
    }).afterClosed().subscribe((result) => {
      if (result) {
        // === not stage here ===
      }
    })
  }



  opendialogMrta() {
    this.dialog.open(MrtaListComponent, {
      height: '90%',
      width: '80%',
      // data: this.dialogData
      data: this.getUserCurrentData()
    }).afterClosed().subscribe((result) => {
      if (result) {
        // === not stage here ===
      }
    })
    // this.router.navigate(['mrta-list']);
  }

  openrepohistory() {

    this.dipchipService.addtimetokenEst().subscribe({
      next: (value) => {
        this.dipchipService.getdipchiptoken().subscribe((value) => {
          const token = value.data[0].token_key ? value.data[0].token_key : ''
          const param = this.baseService.Hash(`Username=${this.usersession.USERNAME}&Token=${token}&AccType=Checker`)
          const url = this.dipchipService.dipchipendpoint + `/Mpls-Repo-History?Key=${param}`
          window.open(url, '_blank');
        })
      }, error: (e) => {
        console.log(e)
      }
    })
  }

  async openWelcomeCallService() {

    // === check permistion on menuid ===

    const presult = await this.btwService.checkmenuidpermission('W03')
    if (presult) {
      // === insert token in btw database ===
      const tokenCreate = this.baseService.generateToken()

      // === call some service ===

      const result_insert_token = await lastValueFrom(this.btwService.generatetokenWelcomeCall(`W03`, tokenCreate))

      if (result_insert_token.status == 200) {
        // === create token success === 
        // === open welcome call with query token === 
        const url = `${environment.httpheadercert}${environment.welcome_call_fcr_web}?Token=${tokenCreate}`
        window.open(url, '_blank');

      } else {
        // === insert token fail 
        this.dialog.open(MainDialogComponent, {
          panelClass: 'custom-dialog-container',
          data: {
            header: `ผิดพลาด`,
            message: `สร้าง TOken ไม่สำเร็จ : ${result_insert_token.message ? result_insert_token.message : 'NO return message'}`,
            button_name: 'Close'
          }
        }).afterClosed().subscribe(result => {
          // === handle next step === 
        });
      }



    } else {
      // === no permission ===
      this.dialog.open(MainDialogComponent, {
        panelClass: 'custom-dialog-container',
        data: {
          header: `ผิดพลาด`,
          message: `ไม่มีสิทธิ์ในหน้า W03`,
          button_name: 'Close'
        }
      }).afterClosed().subscribe(result => {
        // === handle next step === 
      });
    }
  }

  gohome() {
    const channal = this.usersession.channal
    if (channal == 'seller' || channal == 'checker') {
      this.router.navigate(['home'])
    } else if (channal == 'collector') {
      this.router.navigate(['collector'])
    }
  }

  godashboard() {
    this.router.navigate([''])
  }

  goquotationview() {
    this.router.navigate(['/quotation-view'])
  }
}
