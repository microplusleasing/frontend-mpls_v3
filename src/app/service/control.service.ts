import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IResuploadfacecompareeditimage } from '../interface/i-res-uploadfacecompareeditimage';
import { IResGetcustomerfaceimage } from '../interface/i-res-getcustomerfaceimage';
import { IResCheckloanresultbyquotationid } from '../interface/i-res-checkloanresultbyquotationid';

@Injectable({
  providedIn: 'root'
})
export class ControlService {

  constructor(
    private http: HttpClient
  ) { }

  getcustomerfaceimage(quotationid: string) {
    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/getcustomerfaceimage?quotationid=${quotationid}`
    return this.http.get<IResGetcustomerfaceimage>(url)
  }
  
  uploadfacecompareeditimage(formData: FormData) {
    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/uploadfacecompareeditimage`
    return this.http.post<IResuploadfacecompareeditimage>(url, formData)
  }

  checkloanresultbyquotationid(quotationid: string) {
    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/checkloanresultbyquotationid?quotationid=${quotationid}`
    return this.http.get<IResCheckloanresultbyquotationid>(url)
  }


}
