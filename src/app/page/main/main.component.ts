import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { IUserToken, IUserTokenData } from './../../interface/i-user-token';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  usersession: IUserTokenData = {} as IUserTokenData

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
    const userdata = localStorage.getItem('currentUser')
    if (userdata) {
      const userdataObj = (JSON.parse(userdata) as IUserToken).data;
      this.usersession = userdataObj
      
      switch(this.usersession.channal) {
        case (`checker`): {
          this.router.navigate(['/home']);
        }
          break;
        case ('seller'): {
          this.router.navigate(['/home']);
        }
          break;
        case ('collector'): {
          this.router.navigate(['/collector']);
        }
          break;
        default:
      }

    } else {
      localStorage.clear()
      this.router.navigate(['/login'])
    }
  }

}
