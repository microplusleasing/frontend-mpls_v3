import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { IResQuotationDetail } from 'src/app/interface/i-res-quotation-detail';

@Component({
  selector: 'app-career-and-purpose',
  templateUrl: './career-and-purpose.component.html',
  styleUrls: ['./career-and-purpose.component.scss']
})
export class CareerAndPurposeComponent implements OnInit {

  @Input() quotationReq = {} as Observable<IResQuotationDetail>;

  field1 = new FormControl('')
  field2 = new FormControl('')
  field3 = new FormControl('')
  field4 = new FormControl('')

  // *** career form ***
  mainCareerNameField = new FormControl()
  mainCareerCodeField = new FormControl()
  // mainCareerCodeField = new FormControl('', Validators.required)
  mainCareerWorkplace = new FormControl('', [Validators.maxLength(150), Validators.required])
  mainCareerPositionField = new FormControl('', [Validators.maxLength(150)])
  mainCareerDepartmentField = new FormControl('', [Validators.maxLength(150)])
  mainCareerExperienceYearsField = new FormControl(null, Validators.pattern('^[0-9]{02}$'))
  mainCareerExperienceMonthField = new FormControl(null, Validators.pattern('^(0?[1-9]|1[012])$'))
  mainCareerSalaryPerMonthField = new FormControl(null, Validators.pattern('^[0-9]{08}'))
  mainCareerSalaryPerDayField = new FormControl(null, Validators.pattern('^[0-9]{08}$'))
  mainCareerLeaderNameField = new FormControl('', [Validators.maxLength(150)])
  mainCareerWorkPerWeekField = new FormControl(null, Validators.pattern('^[0-9]{02}$'))
  isSubCareerField = new FormControl()
  subCareerNameField = new FormControl()
  subCareerCodeField = new FormControl()
  subCareerWorkplace = new FormControl('', [Validators.maxLength(150)])
  subCareerPositionField = new FormControl('', [Validators.maxLength(150)])
  subCareerDepartmentField = new FormControl('', [Validators.maxLength(150)])
  subCareerExperienceYearsField = new FormControl(null, Validators.pattern('^[0-9]{02}$'))
  subCareerExperienceMonthField = new FormControl(null, Validators.pattern('^(0?[1-9]|1[012])$'))
  subCareerSalaryPerMonthField = new FormControl(null, Validators.pattern('^[0-9]{08}'))
  subCareerSalaryPerDayField = new FormControl(null, Validators.pattern('^[0-9]{08}'))
  subCareerLeaderNameField = new FormControl('', [Validators.maxLength(150)])
  subCareerWorkPerWeakField = new FormControl(null, Validators.pattern('^[0-9]{0,2}$'))


  // *** purpose form ***
  purposeBuy = new FormControl()
  purposeBuyName = new FormControl('', [Validators.maxLength(300)])
  reasonBuy = new FormControl()
  reasonBuyEtc = new FormControl('', [Validators.maxLength(300)])
  carUser = new FormControl()
  carUserName = new FormControl('', [Validators.maxLength(200)])
  carUserRelation = new FormControl()
  carUserName2 = new FormControl('', [Validators.maxLength(200)])
  carUserCitizenid = new FormControl('', [Validators.pattern('^[0-9]{13}$')])
  carUserHomeNo = new FormControl('', [Validators.maxLength(500)])
  carUserHomeName = new FormControl('', [Validators.maxLength(150)])
  carUserRoomNo = new FormControl('', [Validators.maxLength(10)])
  carUserFloor = new FormControl('', Validators.pattern('^(0?[1-9]|[1-9][0-9])$'))
  carUserSoi = new FormControl('', [Validators.maxLength(150)])
  carUserMoo = new FormControl('', [Validators.pattern('^[0-9]{0,4}$')])
  carUserRoad = new FormControl('', [Validators.maxLength(150)])
  carUserSubDistrict = new FormControl('', [Validators.maxLength(150)])
  carUserDistrict = new FormControl('', [Validators.maxLength(150)])
  carUserProvinceName = new FormControl('', [Validators.maxLength(150)])
  carUserProvinceCode = new FormControl()
  carUserPostalCode = new FormControl('', [Validators.pattern('^[0-9]{5}$')])
  carUserPhoneNo = new FormControl('', [Validators.pattern('^[0-9]{8,10}')])
  firstReferralFullName = new FormControl('', [Validators.maxLength(300)])
  firstReferralHouseNo = new FormControl()
  firstReferralMoo = new FormControl()
  firstReferralHouseName = new FormControl()
  firstReferralRoomNo = new FormControl()
  firstReferralFloor = new FormControl()
  firstReferralSoi = new FormControl()
  firstReferralRoad = new FormControl()
  firstReferralSubDistrict = new FormControl()
  firstReferralDistrict = new FormControl()
  firstReferralProvinceName = new FormControl()
  firstReferralProvinceCode = new FormControl()
  firstReferralPostalCode = new FormControl()
  firstReferralPhoneNo = new FormControl('', [Validators.pattern('^[0-9]{8,10}')])
  firstReferralRelation = new FormControl('', [Validators.maxLength(200)])
  secondReferralFullName = new FormControl('', [Validators.maxLength(300)])
  secondReferralHouseNo = new FormControl()
  secondReferralMoo = new FormControl()
  secondReferralHouseName = new FormControl()
  secondReferralRoomNo = new FormControl()
  secondReferralFloor = new FormControl()
  secondReferralSoi = new FormControl()
  secondReferralRoad = new FormControl()
  secondReferralSubDistrict = new FormControl()
  secondReferralDistrict = new FormControl()
  secondReferralProvinceName = new FormControl()
  secondReferralProvinceCode = new FormControl()
  secondReferralPostalCode = new FormControl()
  secondReferralPhoneNo = new FormControl('', [Validators.pattern('^[0-9]{8,10}')])
  secondReferralRelation = new FormControl('', [Validators.maxLength(200)])



  careerForm = this.fb.group({
    mainCareerNameField: this.mainCareerNameField,
    mainCareerCodeField: this.mainCareerCodeField,
    mainCareerWorkplace: this.mainCareerWorkplace,
    mainCareerPositionField: this.mainCareerWorkplace,
    mainCareerDepartmentField: this.mainCareerWorkplace,
    mainCareerExperienceYearsField: this.mainCareerExperienceYearsField,
    mainCareerExperienceMonthField: this.mainCareerExperienceMonthField,
    mainCareerSalaryPerMonthField: this.mainCareerSalaryPerMonthField,
    mainCareerSalaryPerDayField: this.mainCareerSalaryPerDayField,
    mainCareerLeaderNameField: this.mainCareerLeaderNameField,
    mainCareerWorkPerWeekField: this.mainCareerWorkPerWeekField,
    isSubCareerField: this.isSubCareerField,
    subCareerNameField: this.subCareerNameField,
    subCareerCodeField: this.subCareerCodeField,
    subCareerWorkplace: this.subCareerWorkplace,
    subCareerPositionField: this.subCareerPositionField,
    subCareerDepartmentField: this.subCareerDepartmentField,
    subCareerExperienceYearsField: this.subCareerExperienceYearsField,
    subCareerExperienceMonthField: this.subCareerExperienceMonthField,
    subCareerSalaryPerMonthField: this.subCareerSalaryPerMonthField,
    subCareerSalaryPerDayField: this.subCareerSalaryPerDayField,
    subCareerLeaderNameField: this.subCareerLeaderNameField,
    subCareerWorkPerWeakField: this.subCareerWorkPerWeakField
  })

  purposeForm = this.fb.group({
    purposeBuy: this.purposeBuy,
    purposeBuyName: this.purposeBuyName,
    reasonBuy: this.reasonBuy,
    reasonBuyEtc: this.reasonBuyEtc,
    carUser: this.carUser,
    carUserName: this.carUserName,
    carUserRelation: this.carUserRelation,
    carUserName2: this.carUserName2,
    carUserCitizenid: this.carUserCitizenid,
    carUserHomeNo: this.carUserHomeNo,
    carUserHomeName: this.carUserHomeName,
    carUserRoomNo: this.carUserRoomNo,
    carUserFloor: this.carUserFloor,
    carUserSoi: this.carUserSoi,
    carUserMoo: this.carUserMoo,
    carUserRoad: this.carUserRoad,
    carUserSubDistrict: this.carUserSubDistrict,
    carUserDistrict: this.carUserDistrict,
    carUserProvinceName: this.carUserProvinceName,
    carUserProvinceCode: this.carUserProvinceCode,
    carUserPostalCode: this.carUserPostalCode,
    carUserPhoneNo: this.carUserPhoneNo,
    firstReferralFullName: this.firstReferralFullName,
    firstReferralHouseNo: this.firstReferralHouseNo,
    firstReferralMoo: this.firstReferralMoo,
    firstReferralHouseName: this.firstReferralHouseName,
    firstReferralRoomNo: this.firstReferralRoomNo,
    firstReferralFloor: this.firstReferralFloor,
    firstReferralSoi: this.firstReferralSoi,
    firstReferralRoad: this.firstReferralRoad,
    firstReferralSubDistrict: this.firstReferralSubDistrict,
    firstReferralDistrict: this.firstReferralDistrict,
    firstReferralProvinceName: this.firstReferralProvinceName,
    firstReferralProvinceCode: this.firstReferralProvinceCode,
    firstReferralPostalCode: this.firstReferralPostalCode,
    firstReferralPhoneNo: this.firstReferralPhoneNo,
    firstReferralRelation: this.firstReferralRelation,
    secondReferralFullName: this.secondReferralFullName,
    secondReferralHouseNo: this.secondReferralHouseNo,
    secondReferralMoo: this.secondReferralMoo,
    secondReferralHouseName: this.secondReferralHouseName,
    secondReferralRoomNo: this.secondReferralRoomNo,
    secondReferralFloor: this.secondReferralFloor,
    secondReferralSoi: this.secondReferralSoi,
    secondReferralRoad: this.secondReferralRoad,
    secondReferralSubDistrict: this.secondReferralSubDistrict,
    secondReferralDistrict: this.secondReferralDistrict,
    secondReferralProvinceName: this.secondReferralProvinceName,
    secondReferralProvinceCode: this.secondReferralProvinceCode,
    secondReferralPostalCode: this.secondReferralPostalCode,
    secondReferralPhoneNo: this.secondReferralPhoneNo,
    secondReferralRelation: this.secondReferralRelation
  })

  careerandpurposeForm = this.fb.group({
    careerForm: this.careerForm,
    purposeForm: this.purposeForm
  })

  constructor(
    private fb: FormBuilder
  ) {

  }

  ngOnInit(): void {
  }

}
