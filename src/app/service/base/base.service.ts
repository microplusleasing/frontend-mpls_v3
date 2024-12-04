import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as moment from 'moment';
import { BehaviorSubject, Subject } from 'rxjs';
import { IResMasterProvinceData } from 'src/app/interface/i-res-master-province';
import { IResMasterTitleData } from 'src/app/interface/i-res-master-title';
import { IUserToken, IUserTokenData } from 'src/app/interface/i-user-token';
import { MainDialogComponent } from 'src/app/widget/dialog/main-dialog/main-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class BaseService {

  private _sessionUser = new Subject<string>();
  userdata = localStorage.getItem('currentUser');
  userSessionQuotation: BehaviorSubject<IUserTokenData> = new BehaviorSubject<IUserTokenData>({} as IUserTokenData);
  usernamefordipchip: string = '';
  checker_id: string = '';

  constructor(
    public dialog: MatDialog,
    public _snackBar: MatSnackBar
  ) {
    if (this.userdata) {
      const userdataObj = (JSON.parse(this.userdata) as IUserToken).data;
      const sessionUserObject = (JSON.parse(this.userdata)) as IUserToken;
      this.userSessionQuotation.next(userdataObj);
      this.usernamefordipchip = userdataObj.USERNAME ? userdataObj.USERNAME : '';

      if (userdataObj.channal) {
        if (userdataObj.channal === 'checker') {
          this.checker_id = userdataObj.USERID ? userdataObj.USERID : '';
        }
      }
    }
  }

  getUserSessionQuotation() {
    return this.userSessionQuotation.asObservable();
  }

  getSessionStorageUser() {
    const sessionStorageText = sessionStorage.getItem('currentUser')
    if (sessionStorageText) {
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
      if (StrTemp.length === 0) result.push("00000000" + StrTemp);
      else if (StrTemp.length === 1) result.push("0000000" + StrTemp);
      else if (StrTemp.length === 2) result.push("000000" + StrTemp);
      else if (StrTemp.length === 3) result.push("00000" + StrTemp);
      else if (StrTemp.length === 4) result.push("0000" + StrTemp);
      else if (StrTemp.length === 5) result.push("000" + StrTemp);
      else if (StrTemp.length === 6) result.push("00" + StrTemp);
      else if (StrTemp.length === 7) result.push("0" + StrTemp);
      else if (StrTemp.length === 8) result.push(StrTemp);
    }

    let resultStr = result.toString().replace(/[,]/g, "");
    result1 = resultStr.split('');
    let reStr = "";
    let j = 0;
    for (let i = 0; i < result1.length; i += 4) {
      if (j % 4 === 0) {
        reStr += String.fromCharCode((parseInt(result1[i] + result1[i + 1] + result1[i + 2] + result1[i + 3], 2) + 65));
      }
      else if (j % 4 === 1) {
        reStr += String.fromCharCode((parseInt(result1[i] + result1[i + 1] + result1[i + 2] + result1[i + 3], 2) + 74));
      }
      else if (j % 4 === 2) {
        reStr += String.fromCharCode((parseInt(result1[i] + result1[i + 1] + result1[i + 2] + result1[i + 3], 2) + 97));
      }
      else if (j % 4 === 3) {
        reStr += String.fromCharCode((parseInt(result1[i] + result1[i + 1] + result1[i + 2] + result1[i + 3], 2) + 104));
      }
      j++;
    }

    return reStr;
  }

  convertstringtodatedipchip(datestring: string) {
    try {
      moment.locale('en');
      var date = moment(datestring, 'MM/DD/YYYY HH:mm:ss')
      var formatedate = moment(date).format('YYYY-MM-DD');
      console.log(`date before return : ${formatedate}`)
      return formatedate;
    } catch (e) {
      console.log(`before return null: ${e}`)
      return null;
    }
  }

  mapProvinceNameById(pResult: string, pMaster: IResMasterProvinceData[]): string {
    const select = pMaster.filter((items: ({ prov_code: string })) => {
      return items.prov_code === pResult
    })

    if (select.length !== 0) {
      return select[0].prov_name
    } else {
      return ''
    }
  }

  mapProvinceIdByName(pResult: string, pMaster: IResMasterProvinceData[]): string {
    const select = pMaster.filter((items: ({ prov_name: string })) => {
      return items.prov_name === pResult
    })

    if (select.length !== 0) {
      return select[0].prov_code
    } else {
      return ''
    }
  }

  mapTitleNameById(pResult: string, pMaster: IResMasterTitleData[]) {
    const select = pMaster.filter((items: ({ title_id: string })) => {
      return items.title_id == pResult
    })
    if (select.length !== 0) {
      return select[0].title_name
    } else {
      return ''
    }
  }

  mapTitleIdByname(pResult: string, pMaster: IResMasterTitleData[]) {
    const select = pMaster.filter((items: ({ title_name: string })) => {
      return items.title_name === pResult
    })
    if (select.length !== 0) {
      return select[0].title_id
    } else {
      return ''
    }
  }

  changeDateFormat(datevalue: Date) {
    try {
      moment.locale('en');
      var date = moment(datevalue)
      var formatedate = moment(date).format('YYYY-MM-DD');
      console.log(`date before return : ${formatedate}`)
      return formatedate;
    } catch (e) {
      console.log(`before return null: ${e}`)
      return null;
    }
  }


  // === *** Image Manage *** ===

  getUrlImage_cizcard_image(data: any): Promise<string> {
    return new Promise((resolve, reject) => {
      const buf = data.data
      const base64format = "data:image/jpg;base64,"
      const base64data = this._arrayBufferToBase64(buf)
      const strurl = `${base64format}${base64data}`
      if (strurl) {
        resolve(strurl);
      } else {
        reject(`/assets/image/placeholder-image.png`);
      }
    })
  }

  getUrlImage(data: any): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        const buf = data.data;
        const base64format = "data:image/jpg;base64,"
        const base64data = this._arrayBufferToBase64(buf)
        const strurl = `${base64format}${base64data}`
        if (strurl) {
          resolve(strurl);
        } else {
          reject('/assets/image/placeholder-image.png');
        }
      } catch (e) {
        reject('/assets/image/placeholder-image.png');
      }
    })
  }

  _arrayBufferToBase64(buffer: any) {
    var binary = '';
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  _arrayBufferToJpeg(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return 'data:image/jpeg;base64,' + btoa(binary);
  }

  async _base64toblob(base64image: string) {
    const base64Data = base64image;
    // const base64 = await fetch(base64Data);
    const base64Response = await fetch(`${base64Data}`);
    const blob = await base64Response.blob();
    return blob
  }

  async _filetoblob(file: File) {
    return file.slice(0, file.size, file.type);
  }


  numberWithCommas(x: number) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  openMaindialog(header: string, message: string, button_name: string) {
    this.dialog.open(MainDialogComponent, {
      data: {
        header: header,
        message: message,
        button_name: button_name
      }
    }).afterClosed().subscribe((res) => {
      // === do not thing ==
    })
  }

  snackbarsuccess(message: string) {
    this._snackBar.open(message, '', {
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
      duration: 3000,
      panelClass: 'custom-snackbar-container'
    });
  }

  snackbarsuccesscenter(message: string) {
    this._snackBar.open(message, '', {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      duration: 3000,
      panelClass: 'custom-snackbar-container'
    });
  }

  snackbarfailcenter(message: string) {
    this._snackBar.open(message, '', {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      duration: 3000,
      panelClass: 'fail-snackbar-container'
    });
  }
  snackbarfail(message: string) {
    this._snackBar.open(message, '', {
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
      duration: 3000,
      panelClass: 'fail-snackbar-container'
    });
  }

  generateToken(): string {
    let token = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < 10; i++) {
      token += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return token;
  }
}
