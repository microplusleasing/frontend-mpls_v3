import { IUserToken } from './../../interface/i-user-token';
import { Observable, of, Subject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BaseService {
  private _sessionUser = new Subject<string>();
  constructor() { }

        getSessionStorageUser() {
          const sessionStorageText = sessionStorage.getItem('currentUser')
          if(sessionStorageText) {
            const sessionUserStorage = (JSON.parse(sessionStorageText) as IUserToken).data;
            return sessionUserStorage;
          } else {
            return null
          }
        }

        Hash(str: string) {
          var result = [];
          var result1 = [];
          for (var i = 0; i < str.length; i++) {
            let StrTemp = str.charCodeAt(i).toString(2);
            // result.push(StrTemp);
            if(StrTemp.length == 0)result.push("00000000" + StrTemp);
            else if(StrTemp.length == 1)result.push("0000000" + StrTemp);
            else if(StrTemp.length == 2)result.push("000000" + StrTemp);
            else if(StrTemp.length == 3)result.push("00000" + StrTemp);
            else if(StrTemp.length == 4)result.push("0000" + StrTemp);
            else if(StrTemp.length == 5)result.push("000" + StrTemp);
            else if(StrTemp.length == 6)result.push("00" + StrTemp);
            else if(StrTemp.length == 7)result.push("0" + StrTemp);
            else if(StrTemp.length == 8)result.push(StrTemp);
          }
        
          let resultStr = result.toString().replace(/[,]/g, "");
          result1 = resultStr.split('');
          let reStr = "";
          let j = 0;
          for(let i = 0; i < result1.length; i += 4){
            if(j%4==0){
              reStr += String.fromCharCode((parseInt(result1[i] + result1[i+1] + result1[i+2] + result1[i+3], 2) + 65));
            }
            else if(j%4==1){
              reStr += String.fromCharCode((parseInt(result1[i] + result1[i+1] + result1[i+2] + result1[i+3], 2) + 74));
            }
            else if(j%4==2){
              reStr += String.fromCharCode((parseInt(result1[i] + result1[i+1] + result1[i+2] + result1[i+3], 2) + 97));
            }
            else if(j%4==3){
              reStr += String.fromCharCode((parseInt(result1[i] + result1[i+1] + result1[i+2] + result1[i+3], 2) + 104));
            }
            j++;
          }
        
          return reStr;
        }
      

  }

