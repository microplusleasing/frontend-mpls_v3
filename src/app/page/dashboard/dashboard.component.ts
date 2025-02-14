import { MainDialogComponent } from 'src/app/widget/dialog/main-dialog/main-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from 'src/app/service/auth/user.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/service/auth/auth.service';
import { IUserToken } from 'src/app/interface/i-user-token';
import { LoadingService } from 'src/app/service/loading.service';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    standalone: false
})
export class DashboardComponent implements OnInit {
  currentUser: IUserToken;

  constructor(
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
    private loadingService: LoadingService,
    private dialog: MatDialog
  ) {
    this.currentUser = this.authService.currentUserValue
  }

  ngOnInit(): void {
    // === check token expire ===
    const user = localStorage.getItem('currentUser')
    if (user) {
      const userObj = JSON.parse(user);
      const token = userObj.token ? userObj.token : '';
      if (token) {
        if (this.authService.tokenExpired(token)) {
          // === token was expire ===
          this.loadingService.hideLoader()
          this.dialog.open(MainDialogComponent, {
            panelClass: 'custom-dialog-container',
            data: {
              header: 'Token Expire',
              message: 'Token was expire, please login',
              button_name: 'Ok'
            }
          }).afterClosed().subscribe(result => {
            // === clear token and go to login page === 
            // localStorage.clear();
            localStorage.removeItem('currentUser');
            this.router.navigate(['/login'])
          });
        } else {
          // === token valid === 
          console.log(`non expire`)
        }
      }
    }
  }

  navigatetopage(page: string, pagelabel: string) {
    const channal = this.currentUser.data.channal
    const isallow = this.userService.checkpermissionbyrole(page, channal)
    if (isallow) {
      this.router.navigate([page])
    } else {
      this.dialog.open(MainDialogComponent, {
        data: {
          header: ``,
          message: `คุณ ไม่มีสิทธิ์ในการใช้งานหน้า ${pagelabel}`,
          button_name: `ok`
        }
      }).afterClosed().subscribe((result) => {
        // === do not thing ===
      })
    }
  }

}
