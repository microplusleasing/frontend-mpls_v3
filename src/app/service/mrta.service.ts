import { IQrTotalLoss } from '../interface/i-qr-total-loss';
import { IQrAdvancePayment } from '../interface/i-qr-advance-payment';
import { IResMasterMrtaInsurance } from '../interface/i-res-master-mrta-insurance';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IResMrtaProduct } from '../interface/i-res-mrta-product';
import { environment } from 'src/environments/environment';
import { IResMasterMrtaSeller } from '../interface/i-res-master-mrta-seller';
import { DOCUMENT } from '@angular/common';
import { IMrtaQrBarcode } from '../interface/i-mrta-qr-barcode';
import { IReqMrtaAge } from '../interface/i-req-mrta-age';
import { IResMrtaAge } from '../interface/i-res-mrta-age';
import { IReqMrtaMaster } from '../interface/i-req-mrta-master';
import { IResMrtaMaster } from '../interface/i-res-mrta-master';
import { IReqGetMasterMrtaInsurance } from '../interface/i-req-get-master-mrta-insurance';
import { IResGetMasterMrtaInsurance } from '../interface/i-res-get-master-mrta-insurance';
import { IReqMplsCheckBusiCode } from '../interface/i-req-mpls-check-busi-code';
import { IResMplsCheckBusiCode } from '../interface/i-res-mpls-check-busi-code';

@Injectable({
  providedIn: 'root'
})
export class MrtaService {

  constructor(
    @Inject(DOCUMENT) private document: any,
    private http: HttpClient
  ) { }

  domain = this.document.location.hostname;

  getmrtainsurance(out_stand: number, age: number, gender: number): Observable<IResMrtaProduct> {

    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/getmrtainsurance?out_stand=${out_stand}&age=${age}&gender=${gender}`
    return this.http.get<IResMrtaProduct>(url)
  }

  checkmrtarecent(quotationid: string): Observable<IResMasterMrtaInsurance> {

    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/checkmrtarecent?quotationid=${quotationid}`
    return this.http.get<IResMasterMrtaInsurance>(url)
  }


  getmrtaseller(): Observable<IResMasterMrtaSeller> {

    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/getmrtaseller`
    return this.http.get<IResMasterMrtaSeller>(url)
  }

  genadvanceqrpayment(application_num: string): Observable<IQrAdvancePayment> {
    // const url = `${environment.httpheader}${this.domain}:${environment.apiport}/getDealerSignaturebyid/${quotation_id}`
    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/genadvanceqrpayment?application_num=${application_num}`
    return this.http.get<IQrAdvancePayment>(url)
  }

  gentotallossqrpayment(application_num: string): Observable<IQrTotalLoss> {
    // const url = `${environment.httpheader}${this.domain}:${environment.apiport}/getDealerSignaturebyid/${quotation_id}`
    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/gentotallossqrpayment?application_num=${application_num}`
    return this.http.get<IQrTotalLoss>(url)
  }

  getmrtaage(formData: IReqMrtaAge): Observable<IResMrtaAge> {
    // const url = `${environment.httpheader}${this.domain}:${environment.apiport}/getDealerSignaturebyid/${quotation_id}`
    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/getmrtaage`
    return this.http.post<IResMrtaAge>(url, formData)
  }

  getmrtamaster(formData: IReqMrtaMaster): Observable<IResMrtaMaster> {
    // const url = `${environment.httpheader}${this.domain}:${environment.apiport}/getDealerSignaturebyid/${quotation_id}`
    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/getmrtamaster`
    return this.http.post<IResMrtaMaster>(url, formData)
  }
  
  // *** for new senario of mrta insurance (12/07/2023) ***
  
  getmastermrtainsurance(formData: IReqGetMasterMrtaInsurance): Observable<IResGetMasterMrtaInsurance> {
    // const url = `${environment.httpheader}${this.domain}:${environment.apiport}/getDealerSignaturebyid/${quotation_id}`
    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/getmastermrtainsurance`
    return this.http.post<IResGetMasterMrtaInsurance>(url, formData)
  }

  MPLS_check_busi_code(formData: IReqMplsCheckBusiCode): Observable<IResMplsCheckBusiCode> {
    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/MPLS_check_busi_code`
    return this.http.post<IResMplsCheckBusiCode>(url, formData)
  }


}
