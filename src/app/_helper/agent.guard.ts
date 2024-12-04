import { Observable, lastValueFrom } from 'rxjs';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, NavigationExtras, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from '../service/auth/auth.service';
import { MainDialogComponent } from '../widget/dialog/main-dialog/main-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class AgentGuard {
  constructor(
    private router: Router,
    private authService: AuthService,
    private dialog: MatDialog
  ) { }

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Promise<boolean | Promise<boolean> | Observable<boolean> | UrlTree>  {

    const param_token = route.queryParams['token']

    if (!param_token) {
      // *** normal handle (normal auth) ****
      const agentcurrentUser = this.authService.agentcurrentUserValue
      if (agentcurrentUser) {
        // logged in so return true
        return true;
      }
      this.router.navigate(['/login']);
      return false;

    } else {
      const agentcurrentUser = this.authService.agentcurrentUserValue
      const resSignTokenOracle = await lastValueFrom(this.authService.stampuserfromtoken(param_token))
      if (resSignTokenOracle) {
        if (resSignTokenOracle.status == 200) {

          const agentcurrentUser = this.authService.agentcurrentUserValue

          if (agentcurrentUser) {

            // logged in so return true
            let queryParams = route.queryParams

            queryParams = { ...queryParams, token: null }

            // Clear only the 'token' query parameter after performing checks
            const navigationExtras: NavigationExtras = {
              queryParams: {
                // token: null, // Set the 'token' query parameter to null
                ...queryParams
              },
              queryParamsHandling: 'merge' // Merge with existing query params
            };

            // this.router.navigate([`/agent-call-view`], navigationExtras);
            this.router.navigate([`${route.routeConfig?.path}`], navigationExtras);

            return true;

          } else {
            this.dialog.open(MainDialogComponent, {
              panelClass: `custom-dialog-container`,
              data: {
                header: ``,
                message: `ยืนยัน Token ไม่สำเร้จ : ${resSignTokenOracle.message}`,
                button_name: `ตกลง`
              }
            }).afterClosed().subscribe((res) => {
              
            })
            // this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
            // return false
            return this.router.createUrlTree(['/login']);
          }
        } else {
          localStorage.removeItem('agentcurrentUser');
          this.dialog.open(MainDialogComponent, {
            panelClass: `custom-dialog-container`,
            data: {
              header: ``,
              message: `ยืนยัน Token ไม่สำเร้จ : ${resSignTokenOracle.message}`,
              button_name: `ตกลง`
            }
          })
          // this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
          // return false
          return this.router.createUrlTree(['/login']);
        }
      } else {
        this.dialog.open(MainDialogComponent, {
          panelClass: `custom-dialog-container`,
          data: {
            header: ``,
            message: `ยืนยัน Token ไม่สำเร้จ }`,
            button_name: `ตกลง`
          }
        })
        return false
      }
    }

  }
}