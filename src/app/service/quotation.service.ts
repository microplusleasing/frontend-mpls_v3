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
import { IReqOtpLog } from '../interface/i-req-otp-log';
import { IResOtpLog } from '../interface/i-res-otp-log';
import { IResPhonenumberValid } from '../interface/i-res-phonenumber-valid';
import { IReqValidationPhonenumber } from '../interface/i-req-validation-phonenumber';
import { IResValidationPhonenumber } from '../interface/i-res-validation-phonenumber';
import { IReqPhoneupdate } from '../interface/i-req-phoneupdate';
import { IResPhoneUpdate } from '../interface/i-res-phone-update';
import { IResCreateApplicationNo } from '../interface/i-res-create-application-no';
import { IResCheckApplicationNo } from '../interface/i-res-check-application-no';
import { IResEconsentValid } from '../interface/i-res-econsent-valid';
import { IResValidastionEconsent } from '../interface/i-res-validastion-econsent';
import { IReqValidationEconsent } from '../interface/i-req-validation-econsent';
import { IResGetServerTime } from '../interface/i-res-get-server-time';
import { IReqCreateCredit } from '../interface/i-req-create-credit';
import { IResCreateOrUpdateCitizenInfoData } from '../interface/i-res-create-or-update-citizen-info-data';


@Injectable({
  providedIn: 'root'
})
export class QuotationService {

  dopastatus: {
    message: string,
    messageheader: string,
    status: boolean
  } = {
    message: '',
    status: false,
    messageheader: ''
  }

  phonevalidstatus: string = ''

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
    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/updateQuotationImageonlyinsert`
    return this.http.post<IResQuotationView>(url, formData)
  }

  canclequotation(quotationid: string) {
    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/canclequotation/${quotationid}`;
    return this.http.get<IResBasic>(url);
  }

  getquotationbyid(id: string) {
    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/quotationbyid/${id}`;
    return this.http.get<IResQuotationDetail>(url);
  }


  bypasssignature(formData: FormData) {
    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/bypassquotation`
    return this.http.post<IResBasic>(url, formData)
  }

  bypasssignaturebychecker(formData: FormData) {

    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/bypassquotationbychecker`
    return this.http.post<IResBasic>(url, formData)
  }

  sendcardeliver(formData: FormData) {
    // === deprecate replace by sendcardeliverandconsent (19/08/2022) ===
    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/attachdeliverapprove`
    return this.http.post<IResBasic>(url, formData)
  }

  sendcardeliverandconsent(formData: FormData) {
    // === new function replace sendcardeliver (19/08/2022) ===
    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/attachdeliverapproveandconsent`
    return this.http.post<IResBasic>(url, formData)
  }

  getsendcardeliverbyid(quotation_id: string): Observable<IResBasicImage> {
    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/getattachimagedeliverbyid/${quotation_id}`
    return this.http.get<IResBasicImage>(url)
  }

  getinsurancedetailbyid(applicationid: string): Observable<IResInsurance> {
    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/getinsurancedetailbyid?applicationid=${applicationid}`
    return this.http.get<IResInsurance>(url)
  }

  saveqrpayment(formData: IReqSaveQrMrta) {
    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/saveqrpayment`
    return this.http.post<IResSaveQrMrta>(url, formData)
  }


  getdipchiptoken(): Observable<IResBasic> {
    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/getdipchiptoken`
    return this.http.get<IResBasic>(url)
  }


  getdopastatusbyid(quotationid: string): Observable<IResDopaStatus> {
    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/getdopastatusbyid?quotationid=${quotationid}`
    return this.http.get<IResDopaStatus>(url)
  }

  MPLS_dipchip(formData: FormData) {
    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/MPLS_dipchip`
    return this.http.post<IResBasic>(url, formData)
  }

  MPLS_create_or_update_citizendata(formData: FormData) {
    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/MPLS_create_or_update_citizendata`
    return this.http.post<IResCreateOrUpdateCitizenInfoData>(url, formData)
  }

  // *** update cancle status (quo_status = '3') ***
  MPLS_cancle_quotation(quotationid: string) {
    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/MPLS_cancle_quotation?quotationid=${quotationid}`
    return this.http.get<IResBasic>(url)

  }
  // *** update phone number when close phone validation dialog (OTP validation phone number) ***
  MPLS_update_phone_number(data: IReqPhoneupdate) {
    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/MPLS_update_phone_number?quotationid=${data.quotationid}&phone_number=${data.phone_number}`
    return this.http.get<IResPhoneUpdate>(url)
  }

  // *** OTP Phone ***

  MPLS_check_phonevalid(quotationid: string) {
    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/MPLS_check_phonevalid?quotationid=${quotationid}`
    return this.http.get<IResPhonenumberValid>(url)
  }

  MPLS_create_otp_phoneno(data: IReqOtpLog) {
    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/MPLS_create_otp_phoneno?quotationid=${data.quotationid}&refid=${data.refid}&phone_no=${data.phone_no}`
    return this.http.get<IResOtpLog>(url)
  }

  MPLS_validation_otp_phonenumber(data: IReqValidationPhonenumber) {
    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/MPLS_validation_otp_phonenumber?quotationid=${data.quotationid}&otp_value=${data.otp_value}&phone_no=${data.phone_no}`
    return this.http.get<IResValidationPhonenumber>(url)
  }

  // *** check before open ECONSENT dialog ***

  MPLS_check_application_no(quotationid: string) {
    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/MPLS_check_application_no?quotationid=${quotationid}`
    return this.http.get<IResCheckApplicationNo>(url)
  }

  MPLS_gen_application_no(quotationid: string) {
    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/MPLS_gen_application_no?quotationid=${quotationid}`
    return this.http.get<IResCreateApplicationNo>(url)
  }

  MPLS_getservertime() {
    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/MPLS_getservertime`
    return this.http.get<IResGetServerTime>(url)
  }

  // *** OTP ECONSENT ***

  MPLS_check_econsent(quotationid: string) {
    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/MPLS_check_econsent?quotationid=${quotationid}`
    return this.http.get<IResEconsentValid>(url)
  }

  MPLS_create_otp_econsent(data: IReqOtpLog) {
    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/MPLS_create_otp_econsent?quotationid=${data.quotationid}&refid=${data.refid}&phone_no=${data.phone_no}`
    return this.http.get<IResOtpLog>(url)
  }

  MPLS_validation_otp_econsent(formdata: FormData) {
    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/MPLS_validation_otp_econsent`
    return this.http.post<IResValidastionEconsent>(url, formdata)
  }

  MPLS_create_or_update_credit(data: IReqCreateCredit) {
    const fd = new FormData();
    fd.append('item', JSON.stringify(data));
    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/MPLS_create_or_update_credit`
    return this.http.post<IResValidastionEconsent>(url, fd)
  }







  setstatusdopa(quotationid: string) {
    this.getdopastatusbyid(quotationid).subscribe({
      next: (result) => {

        if (result.status == 200) {
          const resultdata = result.data[0]

          if (resultdata.status_code !== '0') {

            if (resultdata.status_desc == '' || resultdata.status_desc == null || resultdata.status_desc == '500') {
              this.dopastatus = {
                message: `❌ ไม่สามารถเชื่อมต่อกับระบบฐานข้อมูลกรมการปกครองได้`,
                messageheader: `ไม่สามารถเชื่อมต่อกับระบบฐานข้อมูลกรมการปกครองได้`,
                status: false
              }
            } else {
              this.dopastatus = {
                message: `❌ สถานะการตรวจข้อมูลบัตรประชาชนคุณ ${resultdata.first_name} ${resultdata.last_name} : ${resultdata.status_desc ? resultdata.status_desc : ''}`,
                messageheader: `สถานะการตรวจข้อมูลบัตรประชาชนคุณ ${resultdata.first_name} ${resultdata.last_name} : ${resultdata.status_desc ? resultdata.status_desc : ''}`,
                status: false
              }
            }
          } else {
            // === valid citizenid card ===
            this.dopastatus = {
              message: `✅ สถานะการตรวจข้อมูลบัตรประชาชนคุณ ${resultdata.first_name} ${resultdata.last_name} : ${resultdata.status_desc}`,
              messageheader: '',
              status: true
            }
          }
        } else {
          this.dopastatus = {
            message: ``,
            messageheader: ``,
            status: false
          }
        }
      }, error: (e) => {
        this.dopastatus = {
          message: ``,
          messageheader: ``,
          status: false
        }
      }, complete: () => {

      }
    })
  }

  cleardopastatus() {
    this.dopastatus = {
      message: ``,
      messageheader: ``,
      status: false
    }
  }

}
