import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImageUtilService {

  constructor() { }

  getUrlImage(data: any): Promise<string> {
    return new Promise((resolve, reject) => {
      const buf = data
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

  _arrayBufferToBase64(buffer: any) {
    var binary = '';
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  _base64sizemb(base64: string) {
    var binary_string = window.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.byteLength/1024000
  }

  blobToBase64(blob: Blob) {
    return new Promise((resolve, _) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result)
      };
      reader.readAsDataURL(blob);
    });
  }

}
