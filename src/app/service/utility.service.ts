import { Injectable } from '@angular/core';
import { NzUploadFile } from 'ng-zorro-antd/upload';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {

constructor() { }

// Convert an array of numbers to an ArrayBuffer
arrayToBuffer(array: number[]): ArrayBuffer {
  const uint8Array = new Uint8Array(array);
  return uint8Array.buffer;
}

// Create a function to convert ArrayBuffer to File
arrayBufferToFile(arrayBuffer: ArrayBuffer, fileName: string, fileType: string): File {
  // Convert ArrayBuffer to Blob
  const blob = new Blob([arrayBuffer], { type: fileType });

  // Create a File object from Blob
  const file = new File([blob], fileName, { type: fileType });

  return file;
}

fileToNzUploadFile(file: File): NzUploadFile {
  const nzUploadFile: NzUploadFile = {
    uid: `${-Date.now()}`, // Unique identifier for the file
    name: file.name, // File name
    size: file.size, // File size
    type: file.type, // File type
    originFileObj: file // Original File object
  };
  return nzUploadFile;
}
}