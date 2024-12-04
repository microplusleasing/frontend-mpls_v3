import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { IUserToken } from './../../interface/i-user-token';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { DOCUMENT } from '@angular/common';
import { IResForgetPassword } from 'src/app/interface/i-res-forget-password';
import { IReqForgetPassword } from 'src/app/interface/i-req-forget-password';
import { IResResetPassword } from 'src/app/interface/i-res-reset-password';
import { IReqRestPassword } from 'src/app/interface/i-req-rest-password';
import { IReqUserlogin } from 'src/app/interface/i-req-userlogin';
// import * as buffer from 'buffer';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private currentUserSubject: BehaviorSubject<IUserToken>;
  private agentCurrentUserSubject: BehaviorSubject<IUserToken>;
  public currentUser: Observable<IUserToken>;
  public agentcurrentUser: Observable<IUserToken>;

  constructor(
    @Inject(DOCUMENT) private document: any,
    private http: HttpClient
  ) {
    // === set format localStorage ===
    let localstoreaccount = localStorage.getItem('currentUser');
    let parselocal;
    if (localstoreaccount) {
      parselocal = JSON.parse(localstoreaccount)
    } else {
      parselocal = null
    }

    this.currentUserSubject = new BehaviorSubject<IUserToken>(parselocal);
    this.agentCurrentUserSubject = new BehaviorSubject<IUserToken>(parselocal);
    this.currentUser = this.currentUserSubject.asObservable();
    this.agentcurrentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): IUserToken {
    // === recheck when delete currentUser manually (17/10/2022) === 
    let localstoreaccount = localStorage.getItem('currentUser');
    let parselocal;
    if (localstoreaccount) {
      parselocal = JSON.parse(localstoreaccount)
    } else {
      parselocal = null
    }

    this.currentUserSubject = new BehaviorSubject<IUserToken>(parselocal);
    return this.currentUserSubject!.value;
  }

  public get agentcurrentUserValue(): IUserToken {
    // === recheck when delete currentUser manually (17/10/2022) === 
    let localstoreaccount = localStorage.getItem('agentcurrentUser');
    let parselocal;
    if (localstoreaccount) {
      parselocal = JSON.parse(localstoreaccount)
    } else {
      parselocal = null
    }

    this.agentCurrentUserSubject = new BehaviorSubject<IUserToken>(parselocal);
    return this.agentCurrentUserSubject!.value;
  }

  domain = this.document.location.hostname;

  login(username: string, password: string, channal: number) {

    // === user new config for certificate ssl (22/07/2022) ===

    const data: IReqUserlogin = {
      username: username,
      password: password,
      channal: channal
    }

    return this.http.post<IUserToken>(`${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/loginuser`, data)
      .pipe(map(user => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        if (user.status == 200) {
          localStorage.setItem('currentUser', JSON.stringify(user));
          localStorage.removeItem('agentcurrentUser');
        }
        this.currentUserSubject.next(user);
        return user;
      }));
  }

  forgetpassword(data: IReqForgetPassword) {
    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/forgetpassword`
    return this.http.post<IResForgetPassword>(url, data)
  }

  resetpassword(data: IReqRestPassword) {
    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/resetpassword`
    return this.http.post<IResResetPassword>(url, data)
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next({} as IUserToken);
  }


  tokenExpired(token: string) {

    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) {
      throw new Error('Invalid token format');
    }
    const base64Url = tokenParts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = JSON.parse(atob(base64));
    const expiry = jsonPayload.exp;
    return (Math.floor((new Date).getTime() / 1000)) >= expiry;
  }

  stampuserfromtoken(token: string) {

    return this.http.post<IUserToken>(`${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/getcurrentUserFormToken`, {token_oracle: token})
      .pipe(map(user => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        if (user.status == 200) {
          localStorage.setItem('agentcurrentUser', JSON.stringify(user));
          localStorage.removeItem('currentUser');
        }
        this.currentUserSubject.next(user);
        return user;
      }));
  }
}