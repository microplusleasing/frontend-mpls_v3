import { IResBtwMrtaInfo } from '../interface/i-res-btw-mrta-info';
import { IResBtwMrtaList } from '../interface/i-res-btw-mrta-list';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { IResBtwRole } from '../interface/i-res-btw-role';
import { Observable, lastValueFrom } from 'rxjs';
import { Inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { IReqBtwMrtaList } from '../interface/i-req-btw-mrta-list';

@Injectable({
  providedIn: 'root'
})
export class BtwService {

  constructor(
    @Inject(DOCUMENT) private document: any,
    private http: HttpClient,
    private router: Router
  ) { }

  domain = this.document.location.hostname;

  getpremrolemenu(menu_id: string): Observable<IResBtwRole> {

    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/getpremrolemenu?menu_id=${menu_id}`
    return this.http.get<IResBtwRole>(url)
  }

  getsearchmrta(data: IReqBtwMrtaList): Observable<IResBtwMrtaList> {

    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/getsearchmrta?customername=${data.customername}&customersname=${data.customersname}&idcardnum=${data.idcardnum}&application_no=${data.application_no}&contractno=${data.contractno}&pageno=${data.pageno}`
    return this.http.get<IResBtwMrtaList>(url)
  }

  getmrtainfo(application_num: string): Observable<IResBtwMrtaInfo> {

    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/getmrtainfo?application_num=${application_num}`
    return this.http.get<IResBtwMrtaInfo>(url)
  }




  async checkmenuidpermission(menu_id: string): Promise<boolean> {
    const rolemenucheck = await lastValueFrom(this.getpremrolemenu(menu_id))
    if (rolemenucheck.data.length !== 0) {
      if (rolemenucheck.data[0].role !== 'Y') {
        return false
      } else {
        return true
      }
    } else {
      return false
    }

  }


}
