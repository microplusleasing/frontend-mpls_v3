import { IResConfirmQrPayment } from './../interface/i-res-confirm-qr-payment';
import { IResMasterMrtaSeller } from './../interface/i-res-master-mrta-seller';
import { IResBtwOutstand } from './../interface/i-res-btw-outstand';
import { IResAgeCalculateFromBirthdate } from './../interface/i-res-age-calculate-from-birthdate';
import { IResMasterDealer } from './../interface/i-res-master-dealer';
import { IResMasterQuoatationStatus } from './../interface/i-res-master-quoatation-status';
import { IResMasterOccupation } from './../interface/i-res-master-occupation';
import { IResPaymentValue } from './../interface/i-res-payment-value';
import { IResMasterInsurer } from './../interface/i-res-master-insurer';
import { IResMasterMrtaInsurance, IResMasterMrtaInsuranceData } from './../interface/i-res-master-mrta-insurance';
import { IResMasterInsurance } from './../interface/i-res-master-insurance';
import { IResCoverageTotalLoss } from './../interface/i-res-coverage-total-loss';
import { IResMaxLtv } from './../interface/i-res-max-ltv';
import { IResMasterProvince } from './../interface/i-res-master-province';
import { IResMasterNegoStatus } from './../interface/i-res-master-nego-status';
import { IResMasterTitle } from './../interface/i-res-master-title';
import { IResMasterImageType } from './../interface/i-res-master-image-type';
import { IResMasterTerm } from './../interface/i-res-master-term';
import { IResMasterRate } from './../interface/i-res-master-rate';
import { IResMasterModelSize } from './../interface/i-res-master-model-size';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IReqSaveQrMrta } from 'src/app/interface/i-req-save-qr-mrta';
import { IResSaveQrMrta } from 'src/app/interface/i-res-save-qr-mrta';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { IResMasterRatesheet } from '../interface/i-res-master-ratesheet';
import { IResMasterInsuranceYears } from '../interface/i-res-master-insurance-years';
import { IResMasterBranch } from '../interface/i-res-master-branch';
import { IResCarcheckStatus } from '../interface/i-res-carcheck-status';
import { IResMariedStatus } from '../interface/i-res-maried-status';
import { IResHouseType } from '../interface/i-res-house-type';
import { IResHouseOwnerType } from '../interface/i-res-house-owner-type';
import { IResMasterBrand } from '../interface/i-res-master-brand';
import { IResMasterModel } from '../interface/i-res-master-model';



@Injectable({
  providedIn: 'root'
})
export class MasterDataService {

  constructor(

    private http: HttpClient
  ) { }


  getSizeModel(pro_code: string, brand_code: string, model_code: string, dealer_code: string, busi_code: string, factory_price: number): Observable<IResMasterModelSize> {
    // const url = `${environment.httpheader}${this.domain}:${environment.apiport}/getSizeModel?pro_code=${pro_code}&brand_code=${brand_code}&model_code=${model_code}&dealer_code=${dealer_code}&busi_code=${busi_code}&&factory_price=${factory_price}`
    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/getSizeModel?pro_code=${pro_code}&brand_code=${brand_code}&model_code=${model_code}&dealer_code=${dealer_code}&busi_code=${busi_code}&&factory_price=${factory_price}`
    return this.http.get<IResMasterModelSize>(url)
  }

  getRate(pro_code: string, size_model: string): Observable<IResMasterRate> {
    // const url = `${environment.httpheader}${this.domain}:${environment.apiport}/MasterRate?pro_code=${pro_code}&brand_code=${brand_code}&model_code=${model_code}`
    // const url = `${environment.httpheader}${this.domain}:${environment.apiport}/MasterRate?pro_code=${pro_code}&size_model=${size_model}`
    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/MasterRate?pro_code=${pro_code}&size_model=${size_model}`
    return this.http.get<IResMasterRate>(url)
  }
  getRateSheet(brand_code: string, model_code: string, dealer_code: string, busi_code: string, insurance_code: string, insurance_year: number): Observable<IResMasterRatesheet> {
    // const url = `${environment.httpheader}${this.domain}:${environment.apiport}/MasterRate?pro_code=${pro_code}&brand_code=${brand_code}&model_code=${model_code}`
    // const url = `${environment.httpheader}${this.domain}:${environment.apiport}/getRateSheet?brand_code=${brand_code}&model_code=${model_code}&dealer_code=${dealer_code}&busi_code=${busi_code}&insurance_code=${insurance_code}&insurance_year=${insurance_year}`
    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/getRateSheet?brand_code=${brand_code}&model_code=${model_code}&dealer_code=${dealer_code}&busi_code=${busi_code}&insurance_code=${insurance_code}&insurance_year=${insurance_year}`
    return this.http.get<IResMasterRatesheet>(url)
  }

  getTerm(pro_code: string, size_model: string): Observable<IResMasterTerm> {
    // const url = `${environment.httpheader}${this.domain}:${environment.apiport}/MasterRate?pro_code=${pro_code}&brand_code=${brand_code}&model_code=${model_code}`
    // const url = `${environment.httpheader}${this.domain}:${environment.apiport}/MasterTerm?pro_code=${pro_code}&size_model=${size_model}`
    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/MasterTerm?pro_code=${pro_code}&size_model=${size_model}`
    return this.http.get<IResMasterTerm>(url)
  }

  getTermNew(pro_code: string, size_model: string, rate: number, net_finance: number): Observable<IResMasterTerm> {
    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/getTermNew?pro_code=${pro_code}&size_model=${size_model}&rate=${rate}&net_finance=${net_finance}`
    return this.http.get<IResMasterTerm>(url)
  }

  getImageType(): Observable<IResMasterImageType> {
    // const url = `${environment.httpheader}${this.domain}:${environment.apiport}/MasterImageType`
    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/MasterImageType`
    return this.http.get<IResMasterImageType>(url)
  }

  getTitle(): Observable<IResMasterTitle> {
    // const url = `${environment.httpheader}${this.domain}:${environment.apiport}/MasterTitle`
    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/MasterTitle`
    return this.http.get<IResMasterTitle>(url)
  }

  getnegomasterstatus(): Observable<IResMasterNegoStatus> {
    // const url = `${environment.httpheader}${this.domain}:${environment.apiport}/getnegomasterstatus`
    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/getnegomasterstatus`
    return this.http.get<IResMasterNegoStatus>(url)
  }

  getProvice(): Observable<IResMasterProvince> {
    // const url = `${environment.httpheader}${this.domain}:${environment.apiport}/MasterProvince`
    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/MasterProvince`
    return this.http.get<IResMasterProvince>(url)
  }

  getMaxLtv(factory_pirce: number, bussi_code: string, pro_code: string, brand_code: string, model_code: string, dl_code: String): Observable<IResMaxLtv> {
    // const url = `${environment.httpheader}${this.domain}:${environment.apiport}/getMaxLtv?factory_price=${factory_pirce}&bussi_code=${bussi_code}&pro_code=${pro_code}&brand_code=${brand_code}&model_code=${model_code}&dl_code=${dl_code}'`
    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/getMaxLtv?factory_price=${factory_pirce}&bussi_code=${bussi_code}&pro_code=${pro_code}&brand_code=${brand_code}&model_code=${model_code}&dl_code=${dl_code}'`
    return this.http.get<IResMaxLtv>(url)
  }

  getcoverageTotalloss(p_insurance_code: string, p_max_ltv: number): Observable<IResCoverageTotalLoss> {
    // const url = `${environment.httpheader}${this.domain}:${environment.apiport}/getMaxLtv?factory_price=${factory_pirce}&bussi_code=${bussi_code}&pro_code=${pro_code}&brand_code=${brand_code}&model_code=${model_code}&dl_code=${dl_code}'`
    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/getcoverageTotalloss?p_insurance_code=${p_insurance_code}&p_max_ltv=${p_max_ltv}`
    return this.http.get<IResCoverageTotalLoss>(url)
  }

  
  getInsurance(max_ltv: string): Observable<IResMasterInsurance> {
    // const url = `${environment.httpheader}${this.domain}:${environment.apiport}/getInsurance?factory_price=${factory_price}`
    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/getInsurance?max_ltv=${max_ltv}`
    return this.http.get<IResMasterInsurance>(url)
  }
  
  getmrtainsurance(out_stand: number, age: number, gender: number ): Observable<IResMasterMrtaInsurance> {
    // ===== **** getder (1: male, 2: female) **** =====
    // const url = `${environment.httpheader}${this.domain}:${environment.apiport}/getInsurance?factory_price=${factory_price}`
    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/getmrtainsurance?out_stand=${out_stand}&age=${age}&gender=${gender}`
    return this.http.get<IResMasterMrtaInsurance>(url)
  }
  
  getInsurer(): Observable<IResMasterInsurer> {
    // const url = `${environment.httpheader}${this.domain}:${environment.apiport}/getInsurer`
    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/getInsurer`
    return this.http.get<IResMasterInsurer>(url)
  }

  getInsuranceYear(insurer_code: string): Observable<IResMasterInsuranceYears> {
    // const url = `${environment.httpheader}${this.domain}:${environment.apiport}/getInsuranceYear?insurer_code=${insurer_code}`
    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/getInsuranceYear?insurer_code=${insurer_code}`
    return this.http.get<IResMasterInsuranceYears>(url)
  }

  getPaymentValue(net_finance: number, term: number, rate: number): Observable<IResPaymentValue> {
    // const url = `${environment.httpheader}${this.domain}:${environment.apiport}/getPaymentValue?net_finance=${net_finance}&term=${term}&rate=${rate}`
    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/getPaymentValue?net_finance=${net_finance}&term=${term}&rate=${rate}`
    return this.http.get<IResPaymentValue>(url)
  }

  getOccupation(): Observable<IResMasterOccupation> {
    // const url = `${environment.httpheader}${this.domain}:${environment.apiport}/getOccupation`
    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/getOccupation`
    return this.http.get<IResMasterOccupation>(url)
  }

  getMasterStatus(): Observable<IResMasterQuoatationStatus> {
    // const url = `${environment.httpheader}${this.domain}:${environment.apiport}/getMasterStatus`
    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/getMasterStatus`
    return this.http.get<IResMasterQuoatationStatus>(url)
  }

  getDealer(pro_code: string): Observable<IResMasterDealer> {
    // const url = `${environment.httpheader}${this.domain}:${environment.apiport}/MasterDealer?pro_code=${pro_code}`
    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/MasterDealer?pro_code=${pro_code}`
    return this.http.get<IResMasterDealer>(url)
  }

  getbranch(): Observable<IResMasterBranch> {
    // const url = `${environment.httpheader}${this.domain}:${environment.apiport}/getbranch`
    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/getbranch`
    return this.http.get<IResMasterBranch>(url)
  }

  getagefrombirthdate(birthdatetxt: string): Observable<IResAgeCalculateFromBirthdate> {
    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/getagefrombirthdate?birthdate=${birthdatetxt}`
    return this.http.get<IResAgeCalculateFromBirthdate>(url)
  }

  getoracleoutstand(application_num: string): Observable<IResBtwOutstand> {
    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/getoracleoutstand?application_num=${application_num}`
    return this.http.get<IResBtwOutstand>(url)
  }

  getmrtaseller(): Observable<IResMasterMrtaSeller> {
    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/getmrtaseller`
    return this.http.get<IResMasterMrtaSeller>(url)
  }

  checkmrtarecent(quotationid: string): Observable<IResMasterMrtaInsuranceData> {

    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/checkmrtarecent?quotationid=${quotationid}`
    return this.http.get<IResMasterMrtaInsuranceData>(url)
  }

  confirmqrpayment(application_num: string, contract_no: string): Observable<IResConfirmQrPayment>{
    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/confirmqrpayment?application_num=${application_num}&contract_no=${contract_no}`
    return this.http.get<IResConfirmQrPayment>(url)
  }

  saveqrpayment(formData: IReqSaveQrMrta) {
    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/saveqrpayment`
    return this.http.post<IResSaveQrMrta>(url, formData)
  }

  getcarcheckstatus(): Observable<IResCarcheckStatus> {
    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/getcarcheckstatus`
    return this.http.get<IResCarcheckStatus>(url)
  }

  getmariedstatus(): Observable<IResMariedStatus> {
    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/getMariedStatus`
    return this.http.get<IResMariedStatus>(url)
  }

  gethousetype(): Observable<IResHouseType> {
    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/getHouseType`
    return this.http.get<IResHouseType>(url)
  }

  gethouseownertype(): Observable<IResHouseOwnerType> {
    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/getHouseOwnerType`
    return this.http.get<IResHouseOwnerType>(url)
  }

  MPLS_getbrand(): Observable<IResMasterBrand> {
    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/MPLS_getbrand`
    return this.http.get<IResMasterBrand>(url)
  }

  MPLS_getmodel(): Observable<IResMasterModel> {
    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/MPLS_getmodel`
    return this.http.get<IResMasterModel>(url)
  }





}
