import { IResInsurance } from './../interface/i-res-insurance';
import { IResBasicImage } from './../interface/i-res-basic-image';
import { IResQuotationDetail } from './../interface/i-res-quotation-detail';
import { IResBasic } from './../interface/i-res-basic';
import { IResQuotationView } from './../interface/i-res-quotation-view';
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { environment } from "src/environments/environment";
import { ISearchQuotation } from "../interface/i-search-quotation";
import { Injectable } from '@angular/core';
import { IResDopaStatus } from '../interface/i-res-dopa-status';
import { IReqSaveQrMrta } from '../interface/i-req-save-qr-mrta';
import { IResSaveQrMrta } from '../interface/i-res-save-qr-mrta';


@Injectable({
  providedIn: 'root'
})
export class QuotationService {

  dopastatus: string = '';

  constructor(
    private http: HttpClient
  ) { }



  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
    }
    // Return an observable with a user-facing error message.
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }

  getquotationbypage(pageno: number, status: string, params: ISearchQuotation) {

    let url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/quotation?pageno=${pageno}&status=${status}&searchname=${params.searchname}&searchidcardnum=${params.searchidcard}&searchrefpaynum=${params.searchrefpaynum}&searchpaystatus=${params.searchpaystatus}`
    return this.http.get<IResQuotationView>(url)
  }

  createquotation(formData: FormData) {
    // const url = `${environment.httpheader}${this.domain}:${environment.apiport}/quotation`
    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/quotation`
    return this.http.post<IResQuotationView>(url, formData)
  }

  updatequotationimage(formData: FormData) {
    // const url = `${environment.httpheader}${this.domain}:${environment.apiport}/updatequotationimage`
    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/updatequotationimage`
    return this.http.post<IResQuotationView>(url, formData)
    // .pipe(
    //   catchError(this.handleError)
    // );
  }
  updatedraft(formData: FormData) {
    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/updatedraft`
    return this.http.post<IResQuotationView>(url, formData)

  }

  updatequotationimageonlyinsert(formData: FormData) {
    // const url = `${environment.httpheader}${this.domain}:${environment.apiport}/updateQuotationImageonlyinsert`
    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/updateQuotationImageonlyinsert`
    return this.http.post<IResQuotationView>(url, formData)
  }

  canclequotation(quotationid: string) {
    // const url = `${environment.httpheader}${this.domain}:${environment.apiport}/canclequotation/${quotationid}`;
    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/canclequotation/${quotationid}`;
    return this.http.get<IResBasic>(url);
  }

  getquotationbyid(id: string) {
    // const url = `${environment.httpheader}${this.domain}:${environment.apiport}/quotationbyid/${id}`;
    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/quotationbyid/${id}`;
    return this.http.get<IResQuotationDetail>(url);
  }


  bypasssignature(formData: FormData) {
    // const url = `${environment.httpheader}${this.domain}:${environment.apiport}/bypassquotation`
    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/bypassquotation`
    return this.http.post<IResBasic>(url, formData)
  }

  bypasssignaturebychecker(formData: FormData) {
    // const url = `${environment.httpheader}${this.domain}:${environment.apiport}/bypassquotationbychecker`
    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/bypassquotationbychecker`
    return this.http.post<IResBasic>(url, formData)
  }

  sendcardeliver(formData: FormData) {
    // === deprecate replace by sendcardeliverandconsent (19/08/2022) ===
    // const url = `${environment.httpheader}${this.domain}:${environment.apiport}/attachdeliverapprove`
    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/attachdeliverapprove`
    return this.http.post<IResBasic>(url, formData)
  }

  sendcardeliverandconsent(formData: FormData) {
    // === new function replace sendcardeliver (19/08/2022) ===
    // const url = `${environment.httpheader}${this.domain}:${environment.apiport}/attachdeliverapprove`
    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/attachdeliverapproveandconsent`
    return this.http.post<IResBasic>(url, formData)
  }

  getsendcardeliverbyid(quotation_id: string): Observable<IResBasicImage> {
    // const url = `${environment.httpheader}${this.domain}:${environment.apiport}/getattachimagedeliverbyid/${quotation_id}`
    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/getattachimagedeliverbyid/${quotation_id}`
    return this.http.get<IResBasicImage>(url)
  }

  getinsurancedetailbyid(applicationid: string): Observable<IResInsurance> {
    // const url = `${environment.httpheader}${this.domain}:${environment.apiport}/getattachimagedeliverbyid/${quotation_id}`
    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/getinsurancedetailbyid?applicationid=${applicationid}`
    return this.http.get<IResInsurance>(url)
  }

  saveqrpayment(formData: IReqSaveQrMrta) {
    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/saveqrpayment`
    return this.http.post<IResSaveQrMrta>(url, formData)
  }


  getdipchiptoken(): Observable<IResBasic> {
    // const url = `${environment.httpheader}${this.domain}:${environment.apiport}/getattachimagedeliverbyid/${quotation_id}`
    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/getdipchiptoken`
    return this.http.get<IResBasic>(url)
  }


  getdopastatusbyid(quotationid: string): Observable<IResDopaStatus> {
    // const url = `${environment.httpheader}${this.domain}:${environment.apiport}/getattachimagedeliverbyid/${quotation_id}`
    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/getdopastatusbyid?quotationid=${quotationid}`
    return this.http.get<IResDopaStatus>(url)
  }

  setstatusdopa(quotationid: string) {
    this.getdopastatusbyid(quotationid).subscribe({
      next: (result) => {

        if (result.status == 200) {
          const resultdata = result.data[0]
          if (resultdata.status_desc == '' || resultdata.status_desc == null) {
            this.dopastatus = `ไม่สามารถเชื่อมต่อกับระบบฐานข้อมูลกรมการปกครองได้`
          } else {
            this.dopastatus = `สถานะการตรวจข้อมูลบัตรประชาชนคุณ ${resultdata.first_name} ${resultdata.last_name} : ${resultdata.status_desc}`
          }
        } else {
          this.dopastatus = ``
        }
      }, error: (e) => {
        this.dopastatus = ``
      }, complete: () => {

      }
    })
  }

  cleardopastatus() {
    this.dopastatus = ``
  }

}
