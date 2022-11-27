
import { catchError, lastValueFrom, Observable, switchMap, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IResDipchip } from '../interface/i-res-dipchip';
import { IReqDipchip } from '../interface/i-req-dipchip';
import { IDipchipToken } from '../interface/i-dipchip-token';

@Injectable({
  providedIn: 'root'
})
export class DipchipService {

  errmsg: IResDipchip = {
    number: 400,
    message: 'การยืนยันตนไม่สำเร็จ (Missing Token)',
    data: []
  }

  // dipchipendpoint: string = `${environment.httpheadercert}${environment.carcheck}${environment.apiportsign}${environment.carcheckport}`
  dipchipendpoint: string = `${environment.httpheadercert}${environment.carcheck}`

  constructor(
    private http: HttpClient
  ) { }

  getdipchipinfo(datasend: IReqDipchip): Observable<IResDipchip> {

    return this.getdipchiptoken().
      pipe(
        switchMap(value => {
          datasend.token = value.data[0].token_key ? value.data[0].token_key : '';
          // const newbuild = this.stampvalidtoken(datasend);
          const url = `${environment.httpheadercert}${environment.apidipchip}/CardReader/Get_Personal_Info`;
          return this.http.put<IResDipchip>(url, datasend);
        }),
        catchError((err) => {
          return throwError(() => this.errmsg)
        })
      );

  }

  updatedipchipflag(datasend: IReqDipchip): Observable<IResDipchip> {

    return this.getdipchiptoken().pipe
      (
        switchMap(value => {
          datasend.token = value.data[0].token_key ? value.data[0].token_key : ''
          // const newbuild = this.stampvalidtoken(datasend)
          const url = `${environment.httpheadercert}${environment.apidipchip}/CardReader/Update_Personal_Flag`
          return this.http.put<IResDipchip>(url, datasend)
        }),
        catchError((err) => {
          return throwError(() => this.errmsg)
        })
      )
  }

  updatedipchipstatus(datasend: IReqDipchip): Observable<IResDipchip> {
    return this.getdipchiptoken().pipe
      (
        switchMap(value => {
          datasend.token = value.data[0].token_key ? value.data[0].token_key : ''
          // const newbuild = this.stampvalidtoken(datasend)
          const url = `${environment.httpheadercert}${environment.apidipchip}/CardReader/Update_Personal_Info`
          return this.http.put<IResDipchip>(url, datasend)
        }),
        catchError((err) => {
          return throwError(() => this.errmsg)
        })
      )
  }

  addtimetokendipchip() {
    return this.getdipchiptoken().pipe(
      switchMap(value => {
        const datasend = {token: value.data[0].token_key ? value.data[0].token_key : ''}
        const url = `${environment.httpheadercert}${environment.apidipchip}/Varidation_Login/GetToken_Add_Time`
        return this.http.put<any>(url, datasend)
      }),
      catchError((err) => {
        return throwError(() => this.errmsg)
      })
    )
  }

  addtimetokenEst() {
    return this.getdipchiptoken().pipe(
      switchMap(value => {
        const datasend = {token: value.data[0].token_key ? value.data[0].token_key : ''}
        const url = `${environment.httpheadercert}${environment.carcheckapi}/Varidation_Login/GetToken_Add_Time`
        return this.http.put<any>(url, datasend)
      }),
      catchError((err) => {
        return throwError(() => this.errmsg)
      })
    )
  }

  getdipchiptoken() {
    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/getdipchiptoken`
    return this.http.get<IDipchipToken>(url)
  }
  

}
