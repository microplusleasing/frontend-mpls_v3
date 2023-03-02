import { IReqFacevalidV2 } from '../interface/i-req-facevalid-v2'; // v1 IfacevalidApiReq
import { IResFacevalidV2 } from '../interface/i-res-facevalid-v2'; // v1 IfacevalidApi
// import { IfaceApi } from './../../interface/iface-api'; // v1 IfaceApi
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


;
@Injectable({
  providedIn: 'root'
})
export class IappService {

  constructor(
    private httpClient: HttpClient,
    private http: HttpClient
  ) { }

  apikey = environment.iappapikey;
  faceRecongApiEndpoint = environment.faceRecogApi;
  faceValidApiEndpoint = environment.faceValidApi;

    // getDataCitizenPic(file: FormData) {
    //   const url = this.faceRecongApiEndpoint; 
    //   const headers = {
    //     headers: new HttpHeaders({
    //       'apikey': this.apikey
    //     })
    //   }
      
    //   return this.httpClient.post<IfaceApi>(url,file,headers);
    // }

    getfacevalidation(file: FormData) {
      const url = this.faceValidApiEndpoint; 
      const headers = {
        headers: new HttpHeaders({
          'apikey': this.apikey
        })
      }

      return this.httpClient.post<IResFacevalidV2>(url,file,headers);
    }

    getimagetocompareiapp(quotationid: string) {
      // const url = `${environment.httpheader}${this.domain}:${environment.apiport}/getnegomasterstatus`
      const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/getimagetocompareiapp/${quotationid}`
      return this.http.get<IReqFacevalidV2>(url)
    }

    getimagetocompareiappbuffer(quotationid: string) {
      // const url = `${environment.httpheader}${this.domain}:${environment.apiport}/getnegomasterstatus`
      const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/getimagetocompareiapp/${quotationid}`
      return this.http.get<IReqFacevalidV2>(url)
    }

    // testapiservice() {
    //   const url = 'http://localhost:4000/testiappservice';
    //   return this.httpClient.get<IfaceApi>(url)
    // }

    
}
