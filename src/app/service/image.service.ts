import { IImageData } from 'src/app/interface/i-image';
import { IConsent } from '../interface/i-consent';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { IImageList } from '../interface/i-image-list';
import { IImage } from 'src/app/interface/i-image';
import { DOCUMENT } from '@angular/common';
import { IMrtaQrBarcode } from '../interface/i-mrta-qr-barcode';
import { IQrAdvancePayment } from 'src/app/interface/i-qr-advance-payment';
import { IQrTotalLoss } from 'src/app/interface/i-qr-total-loss';
import { IResCheckImageRequire } from 'src/app/interface/i-res-check-image-require';
import { IResGetsalesheetimage } from '../interface/i-res-mpls_get_salesheet_image';
import { IResGetsalesheetimagecount } from '../interface/i-res-mpls_get_salesheet_image_count';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor(
    @Inject(DOCUMENT) private document: any,
    private http: HttpClient
  ) { }

  domain = this.document.location.hostname;

  getimagebyid(quotation_id: string): Observable<IImage> {
    // const url = `${environment.httpheader}${this.domain}:${environment.apiport}/getimagebyid/${quotation_id}`
    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/getimagebyid/${quotation_id}`
    return this.http.get<IImage>(url)
  }

  getimagelistbyid(quotation_id: string): Observable<IImageList> {
    // const url = `${environment.httpheader}${this.domain}:${environment.apiport}/getimagelistbyid/${quotation_id}`
    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/getimagelistbyid/${quotation_id}`
    return this.http.get<IImageList>(url)
  }

  getsignimage(quotation_id: string): Observable<IConsent> {
    // const url = `${environment.httpheader}${this.domain}:${environment.apiport}/getsignImgbyid/${quotation_id}`
    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/getsignImgbyid/${quotation_id}`
    return this.http.get<IConsent>(url)
  }


  getdealersignimage(quotation_id: string): Observable<IImage> {
    // const url = `${environment.httpheader}${this.domain}:${environment.apiport}/getDealerSignaturebyid/${quotation_id}`
    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/getdealersignimage/${quotation_id}`
    return this.http.get<IImage>(url)
  }

  genmrtaqr(application_num: string, premium_mrta: number): Observable<IMrtaQrBarcode> {
    // const url = `${environment.httpheader}${this.domain}:${environment.apiport}/getDealerSignaturebyid/${quotation_id}`
    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/genmrtaqr?application_num=${application_num}&premium_mrta=${premium_mrta}`
    return this.http.get<IMrtaQrBarcode>(url)
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

  checkimagerequire(quotationid: string): Observable<IResCheckImageRequire> {
    // const url = `${environment.httpheader}${this.domain}:${environment.apiport}/getattachimagedeliverbyid/${quotation_id}`
    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/checkimagerequire?quotationid=${quotationid}`
    return this.http.get<IResCheckImageRequire>(url)
  }
  
  MPLS_get_salesheet_image(): Observable<IResGetsalesheetimage> {
    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/MPLS_get_salesheet_image`
    return this.http.get<IResGetsalesheetimage>(url)
  }

  MPLS_get_salesheet_image_count(): Observable<IResGetsalesheetimagecount> {
    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/MPLS_get_salesheet_image_count`
    return this.http.get<IResGetsalesheetimagecount>(url)
  }


}
