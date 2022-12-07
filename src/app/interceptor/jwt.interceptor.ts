
import { Inject, Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
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
    // const token = this.authService.getAuthToken();
    let currentUser = this.authService.currentUserValue;

    if (request.url.search(re) === -1) {
      if (currentUser && currentUser.token) {
        request = request.clone({
          setHeaders: { Authorization: `Bearer ${currentUser.token}` }
        });
      }

    }

    return next.handle(request).pipe(
      catchError((err) => {
        if (err instanceof HttpErrorResponse) {
          console.log(`this err status : ${err.error.status}`)
          if (err.error.status === 401) {
            // redirect user to the logout page
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