import { IResBasic } from '../interface/i-res-basic';
import { Observable } from 'rxjs';
import { IReqSms } from '../interface/i-req-sms';
import { Inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SmsService {

  constructor(
    @Inject(DOCUMENT) private document: any,
    private http: HttpClient
  ) { }

  domain = this.document.location.hostname;

  sendsmsapi(data: IReqSms) {
    // const url = `${environment.httpheader}${this.domain}:${environment.apiport}/sendsmscheck?quotationid=${data.quotationid}&phone_no=${data.phone_no}&sms_message=${data.sms_message}&sender=${data.sender}&force=${data.force}`
    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/sendsmscheck?quotationid=${data.quotationid}&phone_no=${data.phone_no}&sms_message=${data.sms_message}&sender=${data.sender}&force=${data.force}&smsserviceallow=${environment.smsserviceallow}`
    return this.http.get<any>(url)
  }

  sendsmsconfirmpayment(data: IReqSms) {
    // const url = `${environment.httpheader}${this.domain}:${environment.apiport}/sendsmscheck?quotationid=${data.quotationid}&phone_no=${data.phone_no}&sms_message=${data.sms_message}&sender=${data.sender}&force=${data.force}`
    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/sendsmsconfirmpayment?phone_no=${data.phone_no}&sms_message=${data.sms_message}&sender=${data.sender}&force=${data.force}&smsserviceallow=${environment.smsserviceallow}`
    return this.http.get<any>(url)
  }

  activequotationepaperstatus(quotationid: string):Observable<IResBasic> {
    // const url = `${environment.httpheader}${this.domain}:${environment.apiport}/activeepaper?quotationid=${quotationid}`
    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/activeepaper?quotationid=${quotationid}`
    return this.http.get<IResBasic>(url)
  }

}