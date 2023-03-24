import { IMrtaQrBarcode } from '../interface/i-mrta-qr-barcode'; // replace IQrPaymentType
import { Iphonenocustlist } from '../interface/iphonenocustlist';
import { IResGetaddressncblist } from '../interface/i-res-getaddressncblist'; // replace ICustomerNcbAddressList
import { IResGetmotocycle, IResGetmotocycleData } from '../interface/i-res-getmotocycle'; // replace ICollectorMotor , ICollectorMotorList
import { IResGetlalon } from '../interface/i-res-getlalon'; // replace Ilocation
import { IResGetphonenolist } from '../interface/i-res-getphonenolist'; // replace Iphonenolist
import { IResGetviewcontractlist } from '../interface/i-res-getviewcontractlist'; // replace Iviewcontractlist
import { IResGetaddresscustlist } from '../interface/i-res-getaddresscustlist'; // replace ICustomerAddressList
import { IResGethistorypaymentlist } from '../interface/i-res-gethistorypaymentlist'; // re place IHistoryPaymentlist
import { IResGetnegotiationbyid } from '../interface/i-res-getnegotiationbyid'; // replace InegotiationInfo
import { IResGetcontractlist } from '../interface/i-res-getcontractlist'; // replace Icontractlist
import { IResGetnegotiationlist } from '../interface/i-res-getnegotiationlist'; // replace InegotiationList
import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IResGetfollowuppaymentlist } from '../interface/i-res-getfollowuppaymentlist'; // replace ICustomerFollowupPaymentlist
import * as moment from 'moment';
import { IResGetaddressinfo } from '../interface/i-res-getaddressinfo'; // replace Iaddressinfo
import { Observable } from 'rxjs';
import { IReqUpdatenegolalon } from '../interface/i-req-updatenegolalon'; // replace IReqUpdateNegoLalon
import { IResUpdatenegolalon } from '../interface/i-res-updatenegolalon'; // add new res (old use basic.ts)
import { IReqCreateaddressinfo } from '../interface/i-req-createaddressinfo';
import { IResBasic } from '../interface/i-res-basic';
import { IResHolderName } from '../interface/i-res-holder-name';

@Injectable({
  providedIn: 'root'
})
export class NegotiationService {

  constructor(
    @Inject(DOCUMENT) private document: any,
    private http: HttpClient
  ) { }

  domain = this.document.location.hostname;


  getcontractlist(pageno: number, name: string, surname: string, applicationid: string) {
    // const url = `${environment.httpheader}${this.domain}:${environment.apiport}/getcontractlist?pageno=${pageno}&name=${name}&surname=${surname}&applicationid=${applicationid}`
    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/getcontractlist?pageno=${pageno}&name=${name}&surname=${surname}&applicationid=${applicationid}`
    return this.http.get<IResGetcontractlist>(url);
  }

  // getviewcontractlist(pageno: number, name: string, surname: string, applicationid: string, due: string, branchcode: string, billcode: string, trackcode: string, carcheckstatus: string, holder: string, apd: Date | string) {
  //   let url;
  //   if (!due) {
  //     //  url = `${environment.httpheader}${this.domain}:${environment.apiport}/getviewcontractlist?pageno=${pageno}&name=${name}&surname=${surname}&applicationid=${applicationid}&branchcode=${branchcode}`
  //     url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/getviewcontractlist?pageno=${pageno}&name=${name}&surname=${surname}&applicationid=${applicationid}&branchcode=${branchcode}&billcode=${billcode}&trackcode=${trackcode}&carcheckstatus=${carcheckstatus}&holder=${holder}&apd=${apd}`
  //   } else {
  //     // const dueValueDtype = moment(due, "DD/MM/YYYY")
  //     // const dateObject = dueValueDtype.toDate(); 
  //     //  url = `${environment.httpheader}${this.domain}:${environment.apiport}/getviewcontractlist?pageno=${pageno}&name=${name}&surname=${surname}&applicationid=${applicationid}&due=${dateObject}`
  //     // url = `${environment.httpheader}${this.domain}:${environment.apiport}/getviewcontractlist?pageno=${pageno}&name=${name}&surname=${surname}&applicationid=${applicationid}&due=${due}&branchcode=${branchcode}`
  //     url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/getviewcontractlist?pageno=${pageno}&name=${name}&surname=${surname}&applicationid=${applicationid}&due=${due}&branchcode=${branchcode}&billcode=${billcode}&trackcode=${trackcode}&carcheckstatus=${carcheckstatus}&holder=${holder}`
  //   }
  //   return this.http.get<IResGetviewcontractlist>(url);
  // }

  getviewcontractlist(pageno: number, name: string, surname: string, applicationid: string, due: string, branchcode: string, billcode: string, trackcode: string, carcheckstatus: string) {
    let url;
    if (!due) {
      //  url = `${environment.httpheader}${this.domain}:${environment.apiport}/getviewcontractlist?pageno=${pageno}&name=${name}&surname=${surname}&applicationid=${applicationid}&branchcode=${branchcode}`
      url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/getviewcontractlist?pageno=${pageno}&name=${name}&surname=${surname}&applicationid=${applicationid}&branchcode=${branchcode}&billcode=${billcode}&trackcode=${trackcode}&carcheckstatus=${carcheckstatus}`
    } else {
      // const dueValueDtype = moment(due, "DD/MM/YYYY")
      // const dateObject = dueValueDtype.toDate(); 
      //  url = `${environment.httpheader}${this.domain}:${environment.apiport}/getviewcontractlist?pageno=${pageno}&name=${name}&surname=${surname}&applicationid=${applicationid}&due=${dateObject}`
      // url = `${environment.httpheader}${this.domain}:${environment.apiport}/getviewcontractlist?pageno=${pageno}&name=${name}&surname=${surname}&applicationid=${applicationid}&due=${due}&branchcode=${branchcode}`
      url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/getviewcontractlist?pageno=${pageno}&name=${name}&surname=${surname}&applicationid=${applicationid}&due=${due}&branchcode=${branchcode}&billcode=${billcode}&trackcode=${trackcode}&carcheckstatus=${carcheckstatus}`
    }
    return this.http.get<IResGetviewcontractlist>(url);
  }

  getholdermaster() {
    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/getholdermaster`;
    return this.http.get<IResHolderName>(url)
  }

  getnegotiationbyid(applicationid: string) {
    // const url = `${environment.httpheader}${this.domain}:${environment.apiport}/getnegotiationbyid?applicationid=${applicationid}`;
    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/getnegotiationbyid?applicationid=${applicationid}`;
    return this.http.get<IResGetnegotiationbyid>(url);
  }

  getmotocyclenego(hp_no: string) {
    // const url = `${environment.httpheader}${this.domain}:${environment.apiport}/getmotocycle?hp_no=${hp_no}`;
    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/getmotocyclenego?hp_no=${hp_no}`;
    return this.http.get<IResGetmotocycle>(url);
  }

  getnegotiationlist(pageno: number) {
    // const url = `${environment.httpheader}${this.domain}:${environment.apiport}/getnegotiationlist?pageno=${pageno}`;
    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/getnegotiationlist?pageno=${pageno}`;
    return this.http.get<IResGetnegotiationlist>(url);
  }

  gethistorypaymentlist(pageno: number, applicationid: string) {
    // const url = `${environment.httpheader}${this.domain}:${environment.apiport}/gethistorypaymentlist?pageno=${pageno}&applicationid=${applicationid}`;
    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/gethistorypaymentlist?pageno=${pageno}&applicationid=${applicationid}`;
    return this.http.get<IResGethistorypaymentlist>(url);
  }

  getaddresscustlist(pageno: number, applicationid: string) {
    // const url = `${environment.httpheader}${this.domain}:${environment.apiport}/getaddresscustlist?pageno=${pageno}&applicationid=${applicationid}`;
    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/getaddresscustlist?pageno=${pageno}&applicationid=${applicationid}`;
    return this.http.get<IResGetaddresscustlist>(url);
  }

  getaddressncblist(pageno: number, idcode: string) {
    // const url = `${environment.httpheader}${this.domain}:${environment.apiport}/getaddresscustlist?pageno=${pageno}&applicationid=${applicationid}`;
    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/getaddressncblist?pageno=${pageno}&idcode=${idcode}`;
    return this.http.get<IResGetaddressncblist>(url);
  }

  getfollowuppaymentlist(pageno: number, applicationid: string) {
    // const url = `${environment.httpheader}${this.domain}:${environment.apiport}/getfollowuppaymentlist?pageno=${pageno}&applicationid=${applicationid}`;
    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/getfollowuppaymentlist?pageno=${pageno}&applicationid=${applicationid}`;
    return this.http.get<IResGetfollowuppaymentlist>(url);
  }

  insertnegolist(items: any) {
    // const url = `${environment.httpheader}${this.domain}:${environment.apiport}/insertnegolist`;
    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/insertnegolist`;
    return this.http.post<any>(url, items);
  }


  getphonenolist(pageno: number, cust_id: string) {
    // const url = `${environment.httpheader}${this.domain}:${environment.apiport}/getphonenolist?pageno=${pageno}&cust_id=${cust_id}`;
    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/getphonenolist?pageno=${pageno}&cust_id=${cust_id}`;
    return this.http.get<IResGetphonenolist>(url);
  }

  getphonenolistcust(pageno: number, cust_id: string) {
    // const url = `${environment.httpheader}${this.domain}:${environment.apiport}/getphonenolist?pageno=${pageno}&cust_id=${cust_id}`;
    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/getphonenolistcust?pageno=${pageno}&cust_id=${cust_id}`;
    return this.http.get<Iphonenocustlist>(url);
  }

  getlalon(application_id: string) {
    // const url = `${environment.httpheader}${this.domain}:${environment.apiport}/getlalon?application_id=${application_id}`;
    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/getlalon?application_id=${application_id}`;
    return this.http.get<IResGetlalon>(url);
  }

  getaddressinfo(contract_no: string) {
    // const url = `${environment.httpheader}${this.domain}:${environment.apiport}/getlalon?application_id=${application_id}`;
    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/getaddressinfo?contract_no=${contract_no}`;
    return this.http.get<IResGetaddressinfo>(url);
  }


  genqrcodenego(ref_pay_num: string, type: string, contract_no: string): Observable<IMrtaQrBarcode> {
    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/genqrcodenego?ref_pay_num=${ref_pay_num}&type=${type}&contract_no=${contract_no}`
    return this.http.get<IMrtaQrBarcode>(url)
  }

  updatenegolalon(data: IReqUpdatenegolalon): Observable<IResUpdatenegolalon> {
    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/updatenegolalon`;
    return this.http.post<IResUpdatenegolalon>(url, data);
  }

  createaddressInfo(data: IReqCreateaddressinfo): Observable<IResBasic> {
    // const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/createaddressInfo?application_no=${data.application_no}&address=${data.address}&sub_district=${data.sub_district}district=${data.district}&province_name=${data.province_name}&province_code=${data.province_code}&postal_code=${data.postal_code}&la=${data.la}&lon=${data.lon}&lalon=${data.lalon}`;
    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/createaddressInfo`;
    return this.http.post<IResBasic>(url, data);
  }



}
