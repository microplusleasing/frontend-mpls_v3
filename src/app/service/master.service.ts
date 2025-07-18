import { IResConfirmQrPayment } from './../interface/i-res-confirm-qr-payment';
import { IResMasterMrtaSeller } from './../interface/i-res-master-mrta-seller';
import { IResBtwOutstand } from './../interface/i-res-btw-outstand';
import { IResAgeCalculateFromBirthdate } from './../interface/i-res-age-calculate-from-birthdate';
import { IResMasterDealer } from './../interface/i-res-master-dealer';
import { IResMasterQuoatationStatus } from './../interface/i-res-master-quoatation-status';
import { IResMasterOccupation } from './../interface/i-res-master-occupation';
import { IResPaymentValue } from './../interface/i-res-payment-value';
import { IResMasterInsurer } from './../interface/i-res-master-insurer';
import { IResMasterMrtaInsurance } from './../interface/i-res-master-mrta-insurance';
import { IResMasterInsuranceOld } from '../interface/i-res-master-insurance-old';
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
import { Observable, map } from 'rxjs';
import { IResMasterRatesheet } from '../interface/i-res-master-ratesheet';
import { IResMasterInsuranceYears } from '../interface/i-res-master-insurance-years';
import { IResMasterBranch } from '../interface/i-res-master-branch';
import { IResCarcheckStatus } from '../interface/i-res-carcheck-status';
import { IResMariedStatus } from '../interface/i-res-maried-status';
import { IResHouseType } from '../interface/i-res-house-type';
import { IResHouseOwnerType } from '../interface/i-res-house-owner-type';
import { IResMasterBrand } from '../interface/i-res-master-brand';
import { IResMasterModel } from '../interface/i-res-master-model';
import { IResImageTypeAttach } from '../interface/i-res-image-type-attach';
import { IResMrtaProduct } from '../interface/i-res-mrta-product';
import { IResMasterInsurance } from '../interface/i-res-master-insurance';
import { IResCalculateAgeDb } from '../interface/i-res-calculate-age-db';
import { IResDealerGrade } from '../interface/i-res-dealer-grade';
import { IResGetMasterBussiness } from '../interface/i-res-get-master-bussiness';
import { IResSecondHandCarView } from '../interface/i-res-second-hand-car-view';
import { IResImageTypeAttachMultiple, IResImageTypeAttachMultipleData } from '../interface/i-res-image-type-attach-multiple';
import { IResCalculateMotoYear } from '../interface/i-res-calculate-moto-year';
import { IResCheckMotoYear } from '../interface/i-res-check-moto-year';
import { IReqCheckMotoYear } from '../interface/i-req-check-moto-year';
import { IReqMplsCheckBusiCode } from '../interface/i-req-mpls-check-busi-code';
import { IResMplsCheckBusiCode } from '../interface/i-res-mpls-check-busi-code';
import { IResGetfueltype } from '../interface/i-res-getfueltype';
import { IReqCoverageTotalLoss } from '../interface/i-req-coverage-total-loss';
import { IResNationalityMaster } from '../interface/i-res-nationality-master';
import { IResIdentityTypeMaster } from '../interface/i-res-identity-type-master';
import { IResGetAcStatusType } from '../interface/i-res-get-ac-status-type';



@Injectable({
  providedIn: 'root'
})
export class MasterDataService {

  constructor(

    private http: HttpClient
  ) { }

  getMasterBussiness(): Observable<IResGetMasterBussiness> {
    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/getMasterBussiness`
    return this.http.get<IResGetMasterBussiness>(url)
  }

  getSizeModel(pro_code: string, brand_code: string, model_code: string, dealer_code: string, busi_code: string, factory_price: number, moto_year: number | string): Observable<IResMasterModelSize> {
    // const url = `${environment.httpheader}${this.domain}:${environment.apiport}/getSizeModel?pro_code=${pro_code}&brand_code=${brand_code}&model_code=${model_code}&dealer_code=${dealer_code}&busi_code=${busi_code}&&factory_price=${factory_price}`
    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/getSizeModel?pro_code=${pro_code}&brand_code=${brand_code}&model_code=${model_code}&dealer_code=${dealer_code}&busi_code=${busi_code}&factory_price=${factory_price}&moto_year=${moto_year}`
    return this.http.get<IResMasterModelSize>(url)
  }

  getMasterRate(pro_code: string, size_model: string, bussiness_code: string): Observable<IResMasterRate> {
    // const url = `${environment.httpheader}${this.domain}:${environment.apiport}/getMasterRate?pro_code=${pro_code}&brand_code=${brand_code}&model_code=${model_code}`
    // const url = `${environment.httpheader}${this.domain}:${environment.apiport}/getMasterRate?pro_code=${pro_code}&size_model=${size_model}`
    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/getMasterRate?pro_code=${pro_code}&size_model=${size_model}&bussiness_code=${bussiness_code}`
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

  getTermNew(pro_code: string, size_model: string, rate: number, net_finance: number, bussiness_code: string): Observable<IResMasterTerm> {
    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/getTermNew?pro_code=${pro_code}&size_model=${size_model}&rate=${rate}&net_finance=${net_finance}&bussiness_code=${bussiness_code}`
    return this.http.get<IResMasterTerm>(url)
  }

  getImageType(): Observable<IResMasterImageType> {
    // const url = `${environment.httpheader}${this.domain}:${environment.apiport}/MasterImageType`
    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/MasterImageType`
    return this.http.get<IResMasterImageType>(url)
  }

  getImageTypeAttach(): Observable<IResImageTypeAttach> {
    // const url = `${environment.httpheader}${this.domain}:${environment.apiport}/MasterImageType`
    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/getImageTypeAttach`
    return this.http.get<IResImageTypeAttach>(url)
  }

  getImageTypeAttachMultiple(): Observable<IResImageTypeAttachMultiple> {
    // const url = `${environment.httpheader}${this.domain}:${environment.apiport}/MasterImageType`
    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/getImageTypeAttachMultiple`
    return this.http.get<IResImageTypeAttachMultiple>(url)
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

  getMasterProvince(): Observable<IResMasterProvince> {
    // const url = `${environment.httpheader}${this.domain}:${environment.apiport}/MasterProvince`
    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/getMasterProvince`
    return this.http.get<IResMasterProvince>(url)
  }

  getMaxLtv(factory_pirce: number, bussi_code: string, pro_code: string, brand_code: string, model_code: string, dl_code: String, moto_year: number, con_ref: string): Observable<IResMaxLtv> {
    // const url = `${environment.httpheader}${this.domain}:${environment.apiport}/getMaxLtv?factory_price=${factory_pirce}&bussi_code=${bussi_code}&pro_code=${pro_code}&brand_code=${brand_code}&model_code=${model_code}&dl_code=${dl_code}'`
    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/getMaxLtv?factory_price=${factory_pirce}&bussi_code=${bussi_code}&pro_code=${pro_code}&brand_code=${brand_code}&model_code=${model_code}&dl_code=${dl_code}&moto_year=${moto_year}&con_ref=${con_ref}`
    return this.http.get<IResMaxLtv>(url)
  }

  getcoverageTotallossold(p_insurance_code: string, p_max_ltv: number): Observable<IResCoverageTotalLoss> {
    // const url = `${environment.httpheader}${this.domain}:${environment.apiport}/getMaxLtv?factory_price=${factory_pirce}&bussi_code=${bussi_code}&pro_code=${pro_code}&brand_code=${brand_code}&model_code=${model_code}&dl_code=${dl_code}'`
    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/getcoverageTotalloss?p_insurance_code=${p_insurance_code}&p_max_ltv=${p_max_ltv}`
    return this.http.get<IResCoverageTotalLoss>(url)
  }

  getcoverageTotalloss(data: IReqCoverageTotalLoss): Observable<IResCoverageTotalLoss> {
    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/getcoverageTotalloss`
    return this.http.post<IResCoverageTotalLoss>(url, data)
  }

  getInsuranceold2(max_ltv: string): Observable<IResMasterInsuranceOld> {
    // const url = `${environment.httpheader}${this.domain}:${environment.apiport}/getInsurance?factory_price=${factory_price}`
    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/getInsuranceold2?max_ltv=${max_ltv}`
    return this.http.get<IResMasterInsuranceOld>(url)
  }

  getInsurance(factory_price: number, bussi_code: string, brand_code: string, model_code: string, dl_code: string): Observable<IResMasterInsurance> {
    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/getInsurance?factory_price=${factory_price}&bussi_code=${bussi_code}&brand_code=${brand_code}&model_code=${model_code}&dl_code=${dl_code}`
    return this.http.get<IResMasterInsurance>(url)
  }

  getmrtainsurance(out_stand: number, age: number, gender: number): Observable<IResMrtaProduct> {
    // ===== **** getder (1: male, 2: female) **** =====
    // const url = `${environment.httpheader}${this.domain}:${environment.apiport}/getInsurance?factory_price=${factory_price}`
    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/getmrtainsurance?out_stand=${out_stand}&age=${age}&gender=${gender}`
    return this.http.get<IResMrtaProduct>(url)
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

  getDealer(): Observable<IResMasterDealer> {
    /* ... ยกเลิกการส่ง paramter pro_code ไปเรียกเพราะใช้ filter ในส่วนของ pro_code ที่ได้จากตอนเลือก bussiness_code ในหน้า credit แทน (solarcell) (20/02/2025) .. */
    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/MasterDealer`
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

  calculateage_db(data: string): Observable<IResCalculateAgeDb> {
    const data_send = {
      birthdate: data
    }
    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/calculateage_db`
    return this.http.post<IResCalculateAgeDb>(url, data_send)
  }

  getoracleoutstand(application_num: string): Observable<IResBtwOutstand> {
    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/getoracleoutstand?application_num=${application_num}`
    return this.http.get<IResBtwOutstand>(url)
  }

  getmrtaseller(): Observable<IResMasterMrtaSeller> {
    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/getmrtaseller`
    return this.http.get<IResMasterMrtaSeller>(url)
  }

  /* ... api locate in mrta service ...*/
  checkmrtarecent(quotationid: string): Observable<IResMasterMrtaInsurance> {

    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/checkmrtarecent?quotationid=${quotationid}`
    return this.http.get<IResMasterMrtaInsurance>(url)
  }

  confirmqrpayment(application_num: string, contract_no: string): Observable<IResConfirmQrPayment> {
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

  getDealergrade(dl_code: string): Observable<IResDealerGrade> {
    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/getDealergrade`
    return this.http.post<IResDealerGrade>(url, { dl_code: dl_code })
  }

  MPLS_getsecondhandcarbyreg(p_reg_no: string, p_sl_code: string, page_no: number, quotationid: string): Observable<IResSecondHandCarView> {
    const data_send = {
      p_reg_no: p_reg_no,
      p_sl_code: p_sl_code,
      page_no: page_no ? page_no : 1,
      quotationid: quotationid
    }
    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/MPLS_getsecondhandcarbyreg`
    return this.http.post<IResSecondHandCarView>(url, data_send)
  }

  MPLS_calculate_moto_year(reg_date: string) {
    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/MPLS_calculate_moto_year`
    return this.http.post<IResCalculateMotoYear>(url, { reg_date: reg_date })
  }

  MPLS_check_moto_year(datasend: IReqCheckMotoYear) {
    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/MPLS_check_moto_year`
    return this.http.post<IResCheckMotoYear>(url, datasend)
  }

  MPLS_check_busi_code(formData: IReqMplsCheckBusiCode): Observable<IResMplsCheckBusiCode> {
    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/MPLS_check_busi_code`
    return this.http.post<IResMplsCheckBusiCode>(url, formData)
  }

  getFuelType(): Observable<IResGetfueltype> {
    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/getFuelType`
    return this.http.get<IResGetfueltype>(url)
  }

  getAcStatusType(): Observable<IResGetAcStatusType> {
    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/getAcStatusType`
    return this.http.get<IResGetAcStatusType>(url).pipe(
      map((res) => {
        if (res.data.length !== 0) {
          res.data.unshift({ ac_desc: 'ทั้งหมด', ac_code: '' })
        }

        res.data.forEach((item) => {
          switch (item.ac_code) {
            case 'ACTIVE': item.ac_desc = 'บัญชีปกติ';
              break;
          }
        })
        return res
      })
    )
  }

  nationalityMaster(): Observable<IResNationalityMaster> {
    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/nationalityMaster`
    return this.http.get<IResNationalityMaster>(url)
  }

  identityTypeMaster(): Observable<IResIdentityTypeMaster> {
    const url = `${environment.httpheader}${environment.apiurl}${environment.apiportsign}${environment.apiport}/identityTypeMaster`
    return this.http.get<IResIdentityTypeMaster>(url)
  }






}
