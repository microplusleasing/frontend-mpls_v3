import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { map, Observable } from 'rxjs';
import { IResQuotationDetail, IResQuotationDetailData } from 'src/app/interface/i-res-quotation-detail';
import { BaseService } from 'src/app/service/base/base.service';
import { LoadingService } from 'src/app/service/loading.service';
import { MasterDataService } from 'src/app/service/master.service';

@Component({
  selector: 'app-career-and-purpose',
  templateUrl: './career-and-purpose.component.html',
  styleUrls: ['./career-and-purpose.component.scss']
})
export class CareerAndPurposeComponent extends BaseService implements OnInit {

  @Input() quotationReq = {} as Observable<IResQuotationDetail>;

  quotationdatatemp: IResQuotationDetail = {} as IResQuotationDetail

  // *** check career and purpose verify ***
  verifyCareerandpurpose = new FormControl<boolean>(false, Validators.requiredTrue)

  panelOpenState = false;
  panelOpenState2 = false;
  showSubCareer: boolean = false;
  isRepresentative: boolean = false;
  isotherDriver: boolean = false;
  isotherResontobuy: boolean = false;
  isnotbuyforyourself: boolean = false;
  quotationresultData = {} as IResQuotationDetail;
  quoitem = {} as IResQuotationDetailData
  occupationMasterList: any;
  finishLoad: boolean = false;
  countload: number = 0;
  is_edit: boolean = true;

  // *** career form ***
  mainCareerNameField = new FormControl()
  mainCareerCodeField = new FormControl()
  // mainCareerCodeField = new FormControl('', Validators.required)
  mainCareerWorkplace = new FormControl('', [Validators.maxLength(150), Validators.required])
  mainCareerPositionField = new FormControl('', [Validators.maxLength(150)])
  mainCareerDepartmentField = new FormControl('', [Validators.maxLength(150)])
  mainCareerExperienceYearsField = new FormControl<number | null>(null, Validators.pattern('^(0?[1-9]|[1-9][0-9])$'))
  mainCareerExperienceMonthField = new FormControl<number | null>(null, Validators.pattern('^(0?[1-9]|1[012])$'))
  mainCareerSalaryPerMonthField = new FormControl<number | null>(null, Validators.pattern('^(0?|[1-9][0-9]{0,7})$'))
  mainCareerSalaryPerDayField = new FormControl<number | null>(null, Validators.pattern('^(0?|[1-9][0-9]{0,7})$'))
  mainCareerLeaderNameField = new FormControl('', [Validators.maxLength(150)])
  mainCareerWorkPerWeekField = new FormControl<number | null>(null, Validators.pattern('^(?:[1-9]|[1-2][0-9]|3[01])$'))
  isSubCareerField = new FormControl()
  subCareerNameField = new FormControl()
  subCareerCodeField = new FormControl()
  subCareerWorkplace = new FormControl('', [Validators.maxLength(150)])
  subCareerPositionField = new FormControl('', [Validators.maxLength(150)])
  subCareerDepartmentField = new FormControl('', [Validators.maxLength(150)])
  subCareerExperienceYearsField = new FormControl<number | null>(null, Validators.pattern('^(0?[1-9]|[1-9][0-9])$'))
  subCareerExperienceMonthField = new FormControl<number | null>(null, Validators.pattern('^(0?[1-9]|1[012])$'))
  subCareerSalaryPerMonthField = new FormControl<number | null>(null, Validators.pattern('^(0?|[1-9][0-9]{0,7})$'))
  subCareerSalaryPerDayField = new FormControl<number | null>(null, Validators.pattern('^(0?|[1-9][0-9]{0,7})$'))
  subCareerLeaderNameField = new FormControl('', [Validators.maxLength(150)])
  subCareerWorkPerWeekField = new FormControl<number | null>(null, Validators.pattern('^(?:[1-9]|[1-2][0-9]|3[01])$'))


  // *** purpose form ***
  purposeBuy = new FormControl() // PURPOSE_OF_BUY (NVARCHAR 3)
  purposeBuyName = new FormControl('', [Validators.maxLength(1000)]) // PURPOSE_OF_BUY_NAME (NAVARCHAR 1000)
  reasonBuy = new FormControl() // REASON_OF_BUY
  reasonBuyEtc = new FormControl('', [Validators.maxLength(300)])
  carUser = new FormControl()
  carUserName = new FormControl('', [Validators.maxLength(200)])
  carUserRelation = new FormControl('', [Validators.maxLength(200)])
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
    mainCareerPositionField: this.mainCareerPositionField,
    mainCareerDepartmentField: this.mainCareerDepartmentField,
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
    subCareerWorkPerWeekField: this.subCareerWorkPerWeekField
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
    purposeForm: this.purposeForm,
    verifyCareerandpurpose: this.verifyCareerandpurpose
  })

  cardLayout = this.breakpointObserver
    .observe('(min-width: 800px)')
    .pipe(
      map(({ matches }) => {
        if (matches) {
          return {
            columns: 12,
            list: { maxcols: 12, cols6: 6, cols4: 4, cols3: 3, cols2: 2, col: 1 }
          };
        }

        return {
          columns: 1,
          list: { maxcols: 1, cols6: 1, cols4: 1, cols3: 1, cols2: 1, col: 1 }
        };
      })
    );

  constructor(
    private fb: FormBuilder,
    private masterDataService: MasterDataService,
    private loadingService: LoadingService,
    public override dialog: MatDialog,
    public override _snackBar: MatSnackBar,
    private breakpointObserver: BreakpointObserver
  ) {
    super(dialog, _snackBar)
  }

  ngOnInit(): void {
    this.careerandpurposeForm.controls.careerForm.controls.isSubCareerField.valueChanges.subscribe((value) => {
      (value == 1) ? this.showSubCareer = true : this.showSubCareer = false
    })
  }

  onStageChageFormStepper() {

    if (this.countload == 0) {

      this.quotationReq.subscribe({
        next: (resquo) => {
          this.loadingService.showLoader();
          this.quotationdatatemp = resquo
          const checkquoitem = this.quotationdatatemp.data
          if (checkquoitem) {

            const quoitem = this.quotationdatatemp.data[0]
            const recordExists = (quoitem.cr_app_key_id !== '' && quoitem.cr_app_key_id !== null) ? true : false

            console.log(`recordExists: ${recordExists}`)
            // === call parameter data ===
            this.masterDataService.getOccupation().subscribe({
              next: (resOc) => {
                // === success get master paremeter data ===
                this.loadingService.hideLoader();
                this.countload++
                this.occupationMasterList = resOc.data

                // === value Change ===
                // *** purposeBuy ***
                this.careerandpurposeForm.controls.purposeForm.controls.purposeBuy.valueChanges.subscribe((purposeBuyvalue) => {
                  if (purposeBuyvalue == '2') {
                    this.isRepresentative = true;
                  } else {
                    this.isRepresentative = false;
                  }
                })

                // *** resonBuy ***
                this.careerandpurposeForm.controls.purposeForm.controls.reasonBuy.valueChanges.subscribe((reasonBuyValue) => {
                  if (reasonBuyValue == '3') {
                    this.isotherResontobuy = true;
                  } else {
                    this.isotherResontobuy = false;
                  }
                })

                // *** carUser ***
                this.careerandpurposeForm.controls.purposeForm.controls.carUser.valueChanges.subscribe((carUserValue) => {
                  if (carUserValue == '0') {
                    this.isnotbuyforyourself = false;
                  } else {
                    this.isnotbuyforyourself = true;
                    if (carUserValue == '4') {
                      this.isotherDriver = true;
                    } else {
                      this.isotherDriver = false;
                    }
                  }
                })

                // *** check for stamp record data to form ***
                if (!recordExists) {
                  // === no record exist ===
                } else {
                  // === set careerForm ===
                  this.careerandpurposeForm.controls.careerForm.controls.mainCareerCodeField.setValue(quoitem.cr_main_career_code ? quoitem.cr_main_career_code : '')
                  this.careerandpurposeForm.controls.careerForm.controls.mainCareerNameField.setValue(quoitem.cr_main_career_name ? quoitem.cr_main_career_name : '')
                  this.careerandpurposeForm.controls.careerForm.controls.mainCareerWorkplace.setValue(quoitem.cr_main_workplace_name ? quoitem.cr_main_workplace_name : '')
                  this.careerandpurposeForm.controls.careerForm.controls.mainCareerPositionField.setValue(quoitem.cr_main_position ?? '')
                  this.careerandpurposeForm.controls.careerForm.controls.mainCareerDepartmentField.setValue(quoitem.cr_main_department ?? '')
                  this.careerandpurposeForm.controls.careerForm.controls.mainCareerExperienceYearsField.setValue(quoitem.cr_main_experience_year ?? null)
                  this.careerandpurposeForm.controls.careerForm.controls.mainCareerExperienceMonthField.setValue(quoitem.cr_main_experience_month ?? null)
                  this.careerandpurposeForm.controls.careerForm.controls.mainCareerSalaryPerMonthField.setValue(quoitem.cr_main_salary_per_month ?? null)
                  this.careerandpurposeForm.controls.careerForm.controls.mainCareerSalaryPerDayField.setValue(quoitem.cr_main_salary_per_day ?? null)
                  this.careerandpurposeForm.controls.careerForm.controls.mainCareerLeaderNameField.setValue(quoitem.cr_main_leader_name ?? '')
                  this.careerandpurposeForm.controls.careerForm.controls.mainCareerWorkPerWeekField.setValue(quoitem.cr_main_work_per_week ?? null)
                  this.careerandpurposeForm.controls.careerForm.controls.isSubCareerField.setValue(quoitem.cr_is_sub_career ?? false)
                  this.careerandpurposeForm.controls.careerForm.controls.subCareerCodeField.setValue(quoitem.cr_sub_career_code ?? '')
                  this.careerandpurposeForm.controls.careerForm.controls.subCareerNameField.setValue(quoitem.cr_sub_career_name ?? '')
                  this.careerandpurposeForm.controls.careerForm.controls.subCareerWorkplace.setValue(quoitem.cr_sub_workplace_name ?? '')
                  this.careerandpurposeForm.controls.careerForm.controls.subCareerPositionField.setValue(quoitem.cr_sub_position ?? '')
                  this.careerandpurposeForm.controls.careerForm.controls.subCareerDepartmentField.setValue(quoitem.cr_sub_department ?? '')
                  this.careerandpurposeForm.controls.careerForm.controls.subCareerExperienceYearsField.setValue(quoitem.cr_sub_experience_year ?? null)
                  this.careerandpurposeForm.controls.careerForm.controls.subCareerExperienceMonthField.setValue(quoitem.cr_sub_experience_month ?? null)
                  this.careerandpurposeForm.controls.careerForm.controls.subCareerSalaryPerMonthField.setValue(quoitem.cr_sub_salary_per_month ?? null)
                  this.careerandpurposeForm.controls.careerForm.controls.subCareerSalaryPerDayField.setValue(quoitem.cr_sub_salary_per_day ?? null)
                  this.careerandpurposeForm.controls.careerForm.controls.subCareerLeaderNameField.setValue(quoitem.cr_sub_leader_name ?? '')
                  this.careerandpurposeForm.controls.careerForm.controls.subCareerWorkPerWeekField.setValue(quoitem.cr_sub_work_per_week ?? null)

                  // === set purposeForm === 

                  this.careerandpurposeForm.controls.purposeForm.controls.purposeBuy.setValue(quoitem.pp_purpose_of_buy ?? '') // code of purpose buy name
                  if (quoitem.pp_purpose_of_buy == '2') this.isRepresentative = true; // show วัตถุประสงค์ในการเช่าซื้อ text 
                  this.careerandpurposeForm.controls.purposeForm.controls.purposeBuyName.setValue(quoitem.pp_purpose_of_buy_name ?? '')
                  this.careerandpurposeForm.controls.purposeForm.controls.reasonBuy.setValue(quoitem.pp_reason_of_buy ?? '')
                  if (quoitem.pp_reason_of_buy == '3') this.isotherResontobuy = true;
                  this.careerandpurposeForm.controls.purposeForm.controls.reasonBuyEtc.setValue(quoitem.pp_reason_of_buy_name ?? '')
                  this.careerandpurposeForm.controls.purposeForm.controls.carUser.setValue(quoitem.pp_car_user ?? '')
                  if (quoitem.pp_car_user == '0') this.isnotbuyforyourself = false;
                  if (quoitem.pp_car_user != '0') this.isnotbuyforyourself = true
                  if (quoitem.pp_car_user == '4') this.isotherDriver = true;
                  this.careerandpurposeForm.controls.purposeForm.controls.carUserName.setValue(quoitem.pp_car_user_name ?? '')
                  this.careerandpurposeForm.controls.purposeForm.controls.carUserName2.setValue(quoitem.pp_car_user_fullname ?? '')
                  this.careerandpurposeForm.controls.purposeForm.controls.carUserRelation.setValue(quoitem.pp_car_user_relation ?? '')
                  this.careerandpurposeForm.controls.purposeForm.controls.carUserCitizenid.setValue(quoitem.pp_car_user_citizencard_id ?? '')
                  this.careerandpurposeForm.controls.purposeForm.controls.carUserHomeNo.setValue(quoitem.pp_car_user_home_no ?? '')
                  this.careerandpurposeForm.controls.purposeForm.controls.carUserHomeName.setValue(quoitem.pp_car_user_home_name ?? '')
                  this.careerandpurposeForm.controls.purposeForm.controls.carUserRoomNo.setValue(quoitem.pp_car_user_room_no ?? '')
                  this.careerandpurposeForm.controls.purposeForm.controls.carUserFloor.setValue(quoitem.pp_car_user_floor ?? '')
                  this.careerandpurposeForm.controls.purposeForm.controls.carUserSoi.setValue(quoitem.pp_car_user_soi ?? '')
                  this.careerandpurposeForm.controls.purposeForm.controls.carUserMoo.setValue(quoitem.pp_car_user_moo ?? '')
                  this.careerandpurposeForm.controls.purposeForm.controls.carUserRoad.setValue(quoitem.pp_car_user_road ?? '')
                  this.careerandpurposeForm.controls.purposeForm.controls.carUserSubDistrict.setValue(quoitem.pp_car_user_sub_district ?? '')
                  this.careerandpurposeForm.controls.purposeForm.controls.carUserDistrict.setValue(quoitem.pp_car_user_district ?? '')
                  this.careerandpurposeForm.controls.purposeForm.controls.carUserProvinceName.setValue(quoitem.pp_car_user_province_name ?? '')
                  this.careerandpurposeForm.controls.purposeForm.controls.carUserPostalCode.setValue(quoitem.pp_car_user_postal_code ?? '')
                  this.careerandpurposeForm.controls.purposeForm.controls.carUserPhoneNo.setValue(quoitem.pp_car_user_phoneno ?? '')
                  this.careerandpurposeForm.controls.purposeForm.controls.firstReferralFullName.setValue(quoitem.pp_first_referral_fullname ?? '')
                  this.careerandpurposeForm.controls.purposeForm.controls.firstReferralRelation.setValue(quoitem.pp_first_referral_relation ?? '')
                  this.careerandpurposeForm.controls.purposeForm.controls.firstReferralPhoneNo.setValue(quoitem.pp_first_referral_phoneno ?? '')
                  this.careerandpurposeForm.controls.purposeForm.controls.secondReferralFullName.setValue(quoitem.pp_second_referral_fullname ?? '')
                  this.careerandpurposeForm.controls.purposeForm.controls.secondReferralPhoneNo.setValue(quoitem.pp_second_referral_phoneno ?? '')
                  this.careerandpurposeForm.controls.purposeForm.controls.secondReferralRelation.setValue(quoitem.pp_second_referral_relation ?? '')

                  // === check condition for show content === 
                  if (quoitem.cr_is_sub_career) {
                    this.showSubCareer = true;
                  }

                  // ===== ***** check quo_status (if quo_status = 1 : lock all client field , valid in api can't update data) ****** =======
                  if (this.quotationdatatemp.data[0].quo_status == 1) {
                    this.careerandpurposeForm.disable({ onlySelf: true, emitEvent: false })
                  }
                }

                // ===== End ======

              }, error: (e) => {
                this.loadingService.hideLoader();
                console.log(`Error dution call master Occupation data : ${e.message ? e.message : 'No return message'}`)
              }, complete: () => {
                console.log(`complete call master Occupation`)
              }
            })
          } else {
            this.loadingService.hideLoader()
            console.log(`this record is still no exits`)
          }
        }, error: (err) => {
          this.loadingService.hideLoader()
          this.snackbarfail(`${err.message}`)
        }, complete: () => {
          this.loadingService.hideLoader();
        }
      })
    }

  }

}
