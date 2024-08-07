import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin, map } from 'rxjs';
import { IDialogChangePurpose } from 'src/app/interface/i-dialog-change-purpose';
import { IDialogChangePurposeClose } from 'src/app/interface/i-dialog-change-purpose-close';
import { IResGetbuyobjectiveMasterData } from 'src/app/interface/i-res-getbuyobjective-master';
import { BaseService } from 'src/app/service/base/base.service';
import { LoadingService } from 'src/app/service/loading.service';
import { MasterDataService } from 'src/app/service/master.service';

@Component({
  selector: 'app-purpose-change-dialog',
  templateUrl: './purpose-change-dialog.component.html',
  styleUrls: ['./purpose-change-dialog.component.scss']
})
export class PurposeChangeDialogComponent extends BaseService implements OnInit {

  /* ... variable for handle display ... */
  isRepresentative: boolean = false;
  isotherDriver: boolean = false;
  isotherResontobuy: boolean = false;
  isnotbuyforyourself: boolean = false;
  iscartitleloan: boolean = false
  isotherpurposeBuy: boolean = false

  buyobjectiveList = [] as IResGetbuyobjectiveMasterData[]

  // *** purpose form ***
  purposeBuy = new FormControl('', Validators.required) // PURPOSE_OF_BUY (NVARCHAR 3)
  purposeBuyother = new FormControl<string>('', Validators.maxLength(100)) // PURPOSE_OF_BUY_OTHER (NVARCHAR 100) 
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

  purposeForm = this.fb.group({
    purposeBuy: this.purposeBuy,
    purposeBuyother: this.purposeBuyother,
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
    private loadingService: LoadingService,
    private masterDataService: MasterDataService,
    public override dialog: MatDialog,
    public override _snackBar: MatSnackBar,
    private breakpointObserver: BreakpointObserver,
    public dialogRef: MatDialogRef<PurposeChangeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IDialogChangePurpose,
  ) {
    super(dialog, _snackBar)

    // === value Change ===
    // *** purposeBuy ***
    this.purposeForm.controls.purposeBuy.valueChanges.subscribe((purposeBuyvalue) => {
      if (purposeBuyvalue == '2') {
        this.isRepresentative = true;
      } else {
        this.isRepresentative = false;
      }
      /* ... add purposeBuyother (car-title-loan) (09/07/2024) ... */
      /* ... trigger to show purposeBuyother code (purposeBuyl.value) is '8' ... */
      if (purposeBuyvalue == '8') {
        this.isotherpurposeBuy = true
        /* ... set validator require of purposeBuyother field ... */
        this.purposeForm.controls.purposeBuyother.setValidators(Validators.required)
        this.purposeForm.controls.purposeBuyother.updateValueAndValidity({ emitEvent: false })
        const testlogic = (!this.isotherpurposeBuy || !this.isRepresentative)
        const testlogic2 = (!this.isotherpurposeBuy && !this.isRepresentative)
        console.log(`testlogic1 : ${testlogic}, testlogic2: ${testlogic2}`)
      } else {
        this.purposeForm.controls.purposeBuyother.setValidators(null)
        this.purposeForm.controls.purposeBuyother.updateValueAndValidity({ emitEvent: false })
        this.purposeForm.controls.purposeBuyother.setValue('')
        this.isotherpurposeBuy = false
        
      }
    })

    // *** resonBuy ***
    this.purposeForm.controls.reasonBuy.valueChanges.subscribe((reasonBuyValue) => {
      if (reasonBuyValue == '3') {
        this.isotherResontobuy = true;
      } else {
        this.isotherResontobuy = false;
      }
    })

    // *** carUser ***
    this.purposeForm.controls.carUser.valueChanges.subscribe((carUserValue) => {
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
  }

  ngOnInit(): void {


    /* ... caall master data parameters ... */
    this.loadingService.showLoader()
    forkJoin([
      this.masterDataService.getMasterBussiness(),
      this.masterDataService.getbuyobjectiveMaster(),
    ]).subscribe({
      next: ([resBu, resbuyobjective]) => {
        this.loadingService.hideLoader()
        if (resBu.status == 200 && resbuyobjective.status == 200) {

          /* .. get product code from busicode ... */
          const current_busi_code = this.data.bussi_code

          const current_pro_code = resBu.data.find((item) => item.bussiness_code == current_busi_code)?.product_code

          /* ... set display condition field hidden/show by product_code ... */
          switch (current_pro_code) {
            case '01':
              this.iscartitleloan = false
              break;
            case '05':
              this.iscartitleloan = true
              break;

            default:
              break;
          }

          if (current_pro_code) {
            this.buyobjectiveList = resbuyobjective.data.filter((item) => item.product_code == current_pro_code)
          }

          if (current_busi_code == '005') {
            this.iscartitleloan = true
          }

        } else {
          console.log(`master data load fail !`)
        }
      }, error: (e) => {
        this.loadingService.hideLoader()
      }, complete: () => {

      }
    })

  }

  sendbackpurposeupdate() {
    const datasend: IDialogChangePurposeClose = {
      valid: true,
      // === purpose Path ===
      car_user: this.purposeForm.controls.carUser.value ? this.purposeForm.controls.carUser.value : '', // career form (stamp via code , sync master data)
      car_user_citizen_id: this.purposeForm.controls.carUserCitizenid.value ? this.purposeForm.controls.carUserCitizenid.value : '',
      car_user_district: this.purposeForm.controls.carUserDistrict.value ? this.purposeForm.controls.carUserDistrict.value : '',
      car_user_floor: this.purposeForm.controls.carUserFloor.value ? this.purposeForm.controls.carUserFloor.value : '',
      car_user_home_name: this.purposeForm.controls.carUserHomeName.value ? this.purposeForm.controls.carUserHomeName.value : '',
      car_user_home_no: this.purposeForm.controls.carUserHomeNo.value ? this.purposeForm.controls.carUserHomeNo.value : '',
      car_user_moo: this.purposeForm.controls.carUserMoo.value ? this.purposeForm.controls.carUserMoo.value : '',
      car_user_name: this.purposeForm.controls.carUserName.value ? this.purposeForm.controls.carUserName.value : '',
      car_user_name_2: this.purposeForm.controls.carUserName2.value ? this.purposeForm.controls.carUserName2.value : '',
      car_user_phone_no: this.purposeForm.controls.carUserPhoneNo.value ? this.purposeForm.controls.carUserPhoneNo.value : '',
      car_user_postal_code: this.purposeForm.controls.carUserPostalCode.value ? this.purposeForm.controls.carUserPostalCode.value : '',
      car_user_province_code: this.purposeForm.controls.carUserProvinceCode.value ? this.purposeForm.controls.carUserProvinceCode.value : '',
      car_user_province_name: this.purposeForm.controls.carUserProvinceName.value ? this.purposeForm.controls.carUserProvinceName.value : '',
      car_user_relation: this.purposeForm.controls.carUserRelation.value ? this.purposeForm.controls.carUserRelation.value : '',
      car_user_road: this.purposeForm.controls.carUserRoad.value ? this.purposeForm.controls.carUserRoad.value : '',
      car_user_room_no: this.purposeForm.controls.carUserRoomNo.value ? this.purposeForm.controls.carUserRoomNo.value : '',
      car_user_soi: this.purposeForm.controls.carUserSoi.value ? this.purposeForm.controls.carUserSoi.value : '',
      car_user_sub_district: this.purposeForm.controls.carUserSubDistrict.value ? this.purposeForm.controls.carUserSubDistrict.value : '',
      first_referral_fullname: this.purposeForm.controls.firstReferralFullName.value ? this.purposeForm.controls.firstReferralFullName.value : '',
      first_referral_phone_no: this.purposeForm.controls.firstReferralPhoneNo.value ? this.purposeForm.controls.firstReferralPhoneNo.value : '',
      first_referral_relation: this.purposeForm.controls.firstReferralRelation.value ? this.purposeForm.controls.firstReferralRelation.value : '',
      purpose_buy: this.purposeForm.controls.purposeBuy.value ? this.purposeForm.controls.purposeBuy.value : '', // purpose form (รหัสคำนำหน้า)
      purpose_buy_other: this.purposeForm.controls.purposeBuyother.value ? this.purposeForm.controls.purposeBuyother.value : '',
      purpose_buy_name: this.purposeForm.controls.purposeBuyName.value ? this.purposeForm.controls.purposeBuyName.value : '',
      reason_buy: this.purposeForm.controls.reasonBuy.value ? this.purposeForm.controls.reasonBuy.value : '', // purpose form (select code of Reason (sync with master data))
      reason_buy_etc: this.purposeForm.controls.reasonBuyEtc.value ? this.purposeForm.controls.reasonBuyEtc.value : '',
      second_referral_fullname: this.purposeForm.controls.secondReferralFullName.value ? this.purposeForm.controls.secondReferralFullName.value : '',
      second_referral_phone_no: this.purposeForm.controls.secondReferralPhoneNo.value ? this.purposeForm.controls.secondReferralPhoneNo.value : '',
      second_referral_relation: this.purposeForm.controls.secondReferralRelation.value ? this.purposeForm.controls.secondReferralRelation.value : ''
    }

    this.dialogRef.close(datasend as IDialogChangePurposeClose)

  }

  closedialogupdatepurpose() {
    this.dialogRef.close({ valid: false } as IDialogChangePurposeClose)
  }

}
