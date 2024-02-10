import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IResChecksendcarimagelist } from '../interface/i-res-checksendcarimagelist';
import { IReqChecksendcarimagelist } from '../interface/i-req-checksendcarimagelist';
import { IReqChecksendcarimagelistexcel } from '../interface/i-req-checksendcarimagelistexcel';
import { IResChecksendcarimagelistexcel } from '../interface/i-res-checksendcarimagelistexcel';

@Injectable({
  providedIn: 'root'
})
export class OraclemenuService {

  constructor(
    private http: HttpClient
  ) { }

  checksendcarimagelist(data: IReqChecksendcarimagelist): Observable<IResChecksendcarimagelist> {
    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/checksendcarimagelist`;
    // return this.http.post<IResChecksendcarimagelist>(url, data)
    return this.http.post<IResChecksendcarimagelist>(url, data).pipe(
      map((res) => {
        if (res.data.length !== 0) {
          res.data.forEach((item) => {
            switch (item.ac_status_text) {
              case 'ACTIVE': item.ac_status_text = 'บัญชีปกติ';
                break;
            }
          });

        }
        return res;
      })
    )
  }

  checksendcarimagelistexcel(data: IReqChecksendcarimagelistexcel): Observable<IResChecksendcarimagelistexcel> {
    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/checksendcarimagelistexcel`;
    return this.http.post<IResChecksendcarimagelistexcel>(url, data);
  }
}
