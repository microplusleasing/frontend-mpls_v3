import { IViewsign } from '../interface/i-viewsign';
// import { IUpdateViewsign } from 'src/app/interface/i-update-viewsign';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ViewsignService {

  constructor(private http: HttpClient) { }

  getviewsignimage(quotation_id: string):Observable<IViewsign> {
    // const url = `${environment.httpheader}${this.domain}:${environment.apiport}/getsignImgbyid/${quotation_id}`
    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/getviewsignimage?quotationid=${quotation_id}`
    return this.http.get<IViewsign>(url)
  }

  verifyviewsignimage(quotationid: string, userid: string ) {
    // const url = `${environment.httpheader}${this.domain}:${environment.apiport}/updatequotationimage`
    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/verifyviewsignimage?quotationid=${quotationid}&userid=${userid}`
    return this.http.get<any>(url)
  }
}
