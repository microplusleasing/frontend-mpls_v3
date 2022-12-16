import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'thaidate'
})
export class ThaidateformatDirective implements PipeTransform {
  transform(date: Date, format: string): string {

    let ThaiDay = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์']
    let shortThaiMonth = [
      'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
      'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
    ];

    let mainmonth = [
      '01', '02', '03','04','05','06','07','08','09','10','11','12'
    ]

    let longThaiMonth = [
      'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
      'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
    ];

    let inputDate = new Date(date);

    let dataDate = [
      inputDate.getDay(), // *** dataDate[0] ***
      inputDate.getDate(), // *** dataDate[1] ***
      inputDate.getMonth(), // *** dataDate[2] ***
      inputDate.getFullYear() // *** dataDate[3] ***
    ];

    let outputDateFull = [
      'วัน ' + ThaiDay[dataDate[0]],
      'ที่ ' + dataDate[1],
      'เดือน ' + longThaiMonth[dataDate[2]],
      'พ.ศ. ' + (dataDate[3] + 543)
    ];

    let outputDateShort = [
      dataDate[1],
      shortThaiMonth[dataDate[2]],
      dataDate[3] + 543
    ];

    let outputDateMedium = [
      dataDate[1],
      longThaiMonth[dataDate[2]],
      dataDate[3] + 543
    ];

    let outputmainformat = [
      dataDate[1] + '/' + mainmonth[dataDate[2]] + '/' + (dataDate[3] + 543)
    ]

    let returnDate: string;

    returnDate = outputDateMedium.join(" ");
    if (format == 'full') {
      returnDate = outputDateFull.join(" ");
    }
    if (format == 'medium') {
      returnDate = outputDateMedium.join(" ");
    }
    if (format == 'short') {
      returnDate = outputDateShort.join(" ");
    }

    if (format == 'main') {
      returnDate = outputmainformat.join(" ");
    }
    return returnDate;
  }
}