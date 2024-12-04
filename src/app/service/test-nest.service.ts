import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IResQuotationDetail } from '../interface/i-res-quotation-detail';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TestNestService {

  constructor(
    private http: HttpClient
  ) { }

  getnestjsquotationdetail(id: string): Observable<IResQuotationDetail> {
    const url = `http://localhost:3000/api/quotation/getquotationbyid`;
    return this.http.get<IResQuotationDetail>(url);
  }

}
