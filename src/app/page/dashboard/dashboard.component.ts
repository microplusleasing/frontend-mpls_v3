import { MainDialogComponent } from 'src/app/widget/dialog/main-dialog/main-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from 'src/app/service/auth/user.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/service/auth/auth.service';
import { IUserToken } from 'src/app/interface/i-user-token';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  currentUser: IUserToken;

  constructor(
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
    private dialog: MatDialog
  ) { 
    this.currentUser = this.authService.currentUserValue
  }

  ngOnInit(): void {
  }

  navigatetopage(page: string, pagelabel: string)  {
    const channal = this.currentUser.data.channal
    const isallow = this.userService.checkpermissionbyrole(page, channal)
    if(isallow) {
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
