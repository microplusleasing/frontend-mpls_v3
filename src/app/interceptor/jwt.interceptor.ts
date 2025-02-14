
import { Inject, Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

import { MatDialog } from '@angular/material/dialog';
import { MainDialogComponent } from './../widget/dialog/main-dialog/main-dialog.component';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth/auth.service';
import { LoadingService } from '../service/loading.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog,
    private loadingService: LoadingService
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    // === set except some service that didn't use token === 
    const re = /thai-national-id-card|login | activeepaper/gi;
    const alloworacleauth = /getquotationbyid|MasterTitle|getMasterProvince|getMariedStatus|getHouseType|getHouseOwnerType|/gi
    // const token = this.authService.getAuthToken();
    let currentUser = this.authService.currentUserValue;
    // *** oracle token auth (JWT) ***
    let agentcurrentUser = this.authService.agentcurrentUserValue;

    if (request.url.search(re) === -1) {
      if (currentUser && currentUser.token) {
        request = request.clone({
          setHeaders: { Authorization: `Bearer ${currentUser.token}` }
        });
      } else {
        // *** oracle token auth (JWT) ***
        // ==== not in list of agent ====
        if (request.url.search(alloworacleauth) !== -1) {
          if (agentcurrentUser && agentcurrentUser.token) {
            request = request.clone({
              setHeaders: { Authorization: `Bearer ${agentcurrentUser.token}` }
            })
          }
        }
      }
    }

    return next.handle(request).pipe(
      catchError((err) => {
        if (err instanceof HttpErrorResponse) {
          console.log(`this err status : ${err.status}`)
          if (err.status === 401) {
            // redirect user to the logout page
            this.loadingService.hideLoader()
            this.dialog.open(MainDialogComponent, {
              panelClass: 'custom-dialog-container',
              data: {
                header: 'Token Expire',
                // message: `${err.error.message}`,
                message: 'Token was expire, please login',
                button_name: 'Ok'
              }
            }).afterClosed().subscribe(result => {
              // === clear token and go to login page === 
              // localStorage.clear();
              localStorage.removeItem('currentUser');
              this.router.navigate(['/login'])
            });
          } else if (err.status === 403) {
            // === permission not allowed (FOrbinden set in api) === (31/01/2023)
            this.dialog.open(MainDialogComponent, {
              panelClass: `custom-dialog-container`,
              data: {
                header: `No Permission`,
                message: `ไม่ม่สิทธิ์ในการทำรายการดังกล่าว`,
                button_name: `Close`
              }
            }).afterClosed().subscribe(result => {
              // === handle next step ===
            })
          } else {
            // Customize as you wish:
            return throwError(() => err);
          }
        }
        return throwError(() => {
          // ==== no code error for rest api handle === 
          new Error('Error out of status')
        })
      })
    )
  }
}