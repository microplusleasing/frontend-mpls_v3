import { IPermission } from './../../interface/i-permission';
import { IUserToken, IUserTokenData } from './../../interface/i-user-token';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { MainDialogComponent } from 'src/app/widget/dialog/main-dialog/main-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  pagepermission = {
    dealer: ['/main', '/home', '/quotation', '/bypass', '/quotation', '/quotation-view', 'quotation-detail', 'mrta-list'],
    checker: ['/main', '/home', '/quotation', '/bypass', '/quotation', '/quotation-view', 'quotation-detail', 'mrta-list'],
    collector: ['/main', '/collector-view', '/collector-detail']
  };
  constructor(
    private router: Router,
    private dialog: MatDialog
  ) { }


  checkrolelogin() {
    // const pagerouter = this.router.url
    const pagerouter = this.router.url.split('?')[0] 
    const userdata = localStorage.getItem('currentUser')
    if (userdata) {
      const userdataObj = (JSON.parse(userdata) as IUserToken).data;


      const chkpermit = this.checkpermissionbyrole(pagerouter, userdataObj.channal)
      if (!chkpermit) {
        this.dialog.open(MainDialogComponent, {
          panelClass: 'custom-dialog-container',
          data: {
            header: '',
            message: `คุณกำลังอยู่ใน stage ${userdataObj.channal} อยู่ \n หากต้องการใช้งาน stage อื่นกรุณา logout และ login ตามแถบของ stage นั้น`,
            button_name: 'Ok'
          }
        }).afterClosed().subscribe(result => {
          // === not stage here ===
          if (userdataObj.channal == 'collector') {
            this.router.navigate(['/collector'])
          } else {
            this.router.navigate(['/main'])
          }
        });
      } else {
        return;
      }
    }
  }

  checkpermissionbyrole(pagename: string, role: string) {

    let chkrole = false;
    for (const [key, value] of Object.entries(this.pagepermission)) {
      // console.log(`${key}: ${value}`);
      if (key == role) {
        for (let i = 0; i < value.length; i++) {
          if (pagename == '/') {
            if (pagename == value[i]) {
              chkrole = true
            }
          } else {
            if (pagename.includes('collector-detail') || pagename.includes('collector')) {
              if (role.includes('collector')) {
                if (pagename.includes(value[i])) {
                  chkrole = true
                }
              }
            } else if (pagename.includes('quotation') || pagename.includes('home')) {
              if (pagename.includes(value[i])) {
                chkrole = true
              }
            } else {
              if (pagename == value[i]) {
                chkrole = true
              }
            }
          }

        }
      }
    }

    return chkrole;

  }



}
