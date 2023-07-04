import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { IUserToken } from './../interface/i-user-token';
import { DOCUMENT } from '@angular/common';
import { IReqUserlogin } from '../interface/i-req-userlogin';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(
    @Inject(DOCUMENT) private document: any,
    private httpClient: HttpClient
  ) { }

  apiurl = environment.apiurl + `/login`;

  // === v.2 ===
  apiport = environment.apiport
  domain = this.document.location.hostname;

  // login(username: string, password: string) {
  //   // const url = this.apiurl + `?username=${username}&password=${password}`
  //   const url = `${environment.httpheader}${this.domain}:${this.apiport}/login?username=${username}&password=${password}`
  //   return this.httpClient.get<Iaccount>(url)
  // }

  // login(username: string, password: string, channal: number) {
  //   // const url = this.apiurl + `?username=${username}&password=${password}`
  //   // const url = `${environment.httpheader}${this.domain}:${this.apiport}/loginuser?username=${username}&password=${password}&channal=${channal}`
  //   // const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/loginuser?username=${username}&password=${password}&channal=${channal}`
  //   const data: IReqUserlogin = {
  //     username: username,
  //     password: password,
  //     channal: channal
  //   }
  //   const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/loginuser`
  //   return this.httpClient.post<IUserToken>(url, data)
  // }

}
