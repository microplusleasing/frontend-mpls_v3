import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { IUserToken } from './../../interface/i-user-token';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private currentUserSubject: BehaviorSubject<IUserToken>;
  public currentUser: Observable<IUserToken>;

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
    this.currentUser = this.currentUserSubject.asObservable();
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

  domain = this.document.location.hostname;

  login(username: string, password: string, channal: number) {
    // return this.http.get<any>(`${environment.httpheader}${this.domain}:${environment.apiport}/loginuser?username=${username}&password=${password}&channal=${channal}`)
    // === user new config for certificate ssl (22/07/2022) ===

    return this.http.get<IUserToken>(`${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/loginuser?username=${username}&password=${password}&channal=${channal}`)
      .pipe(map(user => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        if (user.status == 200) {
          localStorage.setItem('currentUser', JSON.stringify(user));
        }
        this.currentUserSubject.next(user);
        return user;
      }));
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next({} as IUserToken);
  }
}