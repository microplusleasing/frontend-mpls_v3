import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as moment from 'moment';
import { combineLatest, debounceTime, lastValueFrom, map, Observable, Subject } from 'rxjs';
import { IReqFlagDipchip } from 'src/app/interface/i-req-flag-dipchip';
import { IResHouseOwnerType } from 'src/app/interface/i-res-house-owner-type';
import { IResHouseType } from 'src/app/interface/i-res-house-type';
import { IResMariedStatus } from 'src/app/interface/i-res-maried-status';
import { IResMasterProvince, IResMasterProvinceData } from 'src/app/interface/i-res-master-province';
import { IResMasterTitle, IResMasterTitleData } from 'src/app/interface/i-res-master-title';
import { IResQuotationDetail } from 'src/app/interface/i-res-quotation-detail';
import { BaseService } from 'src/app/service/base/base.service';
import { DipchipService } from 'src/app/service/dipchip.service';
import { LoadingService } from 'src/app/service/loading.service';
import { MasterDataService } from 'src/app/service/master.service';
import { QuotationService } from 'src/app/service/quotation.service';
import { OtpVeifyDialogComponent } from 'src/app/widget/dialog/otp-veify-dialog/otp-veify-dialog.component';
import { BasicSnackbarComponent } from 'src/app/widget/snackbar/basic-snackbar/basic-snackbar.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-ciz-card-tab',
  templateUrl: './ciz-card-tab.component_v1.html',
  styleUrls: ['./ciz-card-tab.component.scss']
})
export class CizCardTabComponent extends BaseService implements OnInit, AfterViewInit {

  @Input() quotationReq = {} as Subject<IResQuotationDetail>;
  @Output() dipchipRes = new EventEmitter<IReqFlagDipchip>();

  quotationdatatemp: IResQuotationDetail = {} as IResQuotationDetail
  cizForm: FormGroup;

  // === variable master variable ===
  masterTitle: IResMasterTitle = {} as IResMasterTitle
  masterProvince: IResMasterProvince = {} as IResMasterProvince
  masterMariedStatus: IResMariedStatus = {} as IResMariedStatus
  masterHouseType: IResHouseType = {} as IResHouseType
  masterHouseOwnerType: IResHouseOwnerType = {} as IResHouseOwnerType
  masterGender = [
    { value: 1, name: 'ชาย' },
    { value: 2, name: 'หญิง' }
  ]

  cizCardImage: string = `${environment.citizen_card_img_preload}`
  cizCardImage_string: string = ''
  cameraImage: string = `${environment.citizen_card_img_preload}`

  // === MPLS_QUOTATION ===
  testinvalid = new FormControl('', Validators.required)
  uploadImg = new FormControl({ value: '', disabled: true })
  titleCode = new FormControl('', Validators.required)
  titleName = new FormControl('', Validators.required) // not show 
  firstName = new FormControl('', Validators.required)
  lastName = new FormControl('', Validators.required)
  gender = new FormControl('', Validators.required)
  phoneNumber = new FormControl('', Validators.required)
  // email = new FormControl('', Validators.required)
  citizenId = new FormControl('', [Validators.required, Validators.pattern('^[0-9]{13}$')])
  birthDate = new FormControl(null, Validators.required)
  issueDate = new FormControl(null, Validators.required)
  expireDate = new FormControl(null, Validators.required)
  issuePlace = new FormControl('', Validators.required)
  mariedStatus = new FormControl('', Validators.required)

  // nickName = new FormControl('', Validators.required)
  // houseType = new FormControl('', Validators.required)
  // stayedYear = new FormControl('', [Validators.required, Validators.pattern('^(0?[0-9]|[1-9][0-9])$')])
  // stayedMonth = new FormControl('', [Validators.required, Validators.pattern('^(0?[0-9]|1[012])$')])
  // houseOwnerType = new FormControl('', Validators.required)

  address = new FormControl('', Validators.required)
  subDistrict = new FormControl('', Validators.required)
  district = new FormControl('', Validators.required)
  provinceName = new FormControl('', Validators.required)
  provinceCode = new FormControl('', Validators.required) // not show
  postalCode = new FormControl('', Validators.required)

  // ** age valid ** 
  age = new FormControl<Number | null>(null, [Validators.min(20), Validators.required])

  livingAddress = this.fb.group({
    address: new FormControl(),
    subDistrict: new FormControl(),
    district: new FormControl(),
    provinceCode: new FormControl(),
    provinceName: new FormControl(),
    lalon: new FormControl(),
    la: new FormControl(),
    lon: new FormControl(),
    postalCode: new FormControl('', Validators.pattern('^[0-9]{5}$')),
  })

  contactAddress = this.fb.group({
    address: new FormControl(),
    subDistrict: new FormControl(),
    district: new FormControl(),
    provinceCode: new FormControl(),
    provinceName: new FormControl(),
    postalCode: new FormControl('', Validators.pattern('^[0-9]{5}$')),
  })

  houseRegisAddress = this.fb.group({
    address: new FormControl(),
    subDistrict: new FormControl(),
    district: new FormControl(),
    provinceCode: new FormControl(),
    provinceName: new FormControl(),
    postalCode: new FormControl('', Validators.pattern('^[0-9]{5}$')),
  })

  workAddress = this.fb.group({
    address: new FormControl(),
    subDistrict: new FormControl(),
    district: new FormControl(),
    provinceCode: new FormControl(),
    provinceName: new FormControl(),
    postalCode: new FormControl('', Validators.pattern('^[0-9]{5}$')),
  })
  ciz_age: any

  constructor(
    private fb: FormBuilder,
    private cdRef: ChangeDetectorRef,
    public quotationService: QuotationService,
    private loadingService: LoadingService,
    private masterDataService: MasterDataService,
    private dipchipService: DipchipService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) {
    super()
    this.cizForm = this.fb.group({
      age: this.age,
      uploadImg: this.uploadImg,
      titleCode: this.titleCode,
      gender: this.gender,
      titleName: this.titleName,
      firstName: this.firstName,
      lastName: this.lastName,
      citizenId: this.citizenId,
      phoneNumber: this.phoneNumber,
      // email: this.email,
      address: this.address,
      subDistrict: this.subDistrict,
      district: this.district,
      provinceName: this.provinceName,
      provinceCode: this.provinceCode,
      postalCode: this.postalCode,
      // === show in client Now === 
      issueDate: this.issueDate,
      expireDate: this.expireDate,
      birthDate: this.birthDate,
      // === add new (19/05/2022) ===
      issueDateText: new FormControl(), // === NOT SHOW IN CLIENT
      expireDateText: new FormControl(), // === NOT SHOW IN CLIENT
      birthDateTextThai: new FormControl(),
      birthDateTextEng: new FormControl(),
      issuePlace: this.issuePlace,
      //=== new field (maried status , housetype , stay months, stay year, house owner type) (14/11/2022) ===
      // nickName: this.nickName,
      // mariedStatus: this.mariedStatus,
      // houseType: this.houseType,
      // stayedMonth: this.stayedMonth,
      // stayedYear: this.stayedYear,
      // houseOwnerType: this.houseOwnerType,

      livingAddress: this.livingAddress,
      contactAddress: this.contactAddress,
      houseRegisAddress: this.houseRegisAddress,
      workAddress: this.workAddress
    });

    this.cizForm.controls['titleName'].valueChanges.subscribe((value) => {
      const titleSelect = this.masterTitle.data.find((res) => { return value == res.title_name })
      this.cizForm.controls['titleCode'].setValue(titleSelect?.title_id)
    })

    this.cizForm.controls['provinceName'].valueChanges.subscribe((value) => {
      const provSelect = this.masterProvince.data.find((res) => { return value == res.prov_name })
      this.cizForm.controls['provinceCode'].setValue(provSelect?.prov_code)
    })

    this.cizForm.get('livingAddress.provinceName')?.valueChanges.subscribe((value) => {
      const provSelect = this.masterProvince.data.find((res) => { return value == res.prov_name })
      this.cizForm.get('livingAddress.provinceCode')?.setValue(provSelect?.prov_code)
    })

    this.cizForm.get('contactAddress.provinceName')?.valueChanges.subscribe((value) => {
      const provSelect = this.masterProvince.data.find((res) => { return value == res.prov_name })
      this.cizForm.get('contactAddress.provinceCode')?.setValue(provSelect?.prov_code)
    })

    this.cizForm.get('houseRegisAddress.provinceName')?.valueChanges.subscribe((value) => {
      const provSelect = this.masterProvince.data.find((res) => { return value == res.prov_name })
      this.cizForm.get('houseRegisAddress.provinceCode')?.setValue(provSelect?.prov_code)
    })

    this.cizForm.get('workAddress.provinceName')?.valueChanges.subscribe((value) => {
      const provSelect = this.masterProvince.data.find((res) => { return value == res.prov_name })
      this.cizForm.get('workAddress.provinceCode')?.setValue(provSelect?.prov_code)
    })

    this.cizForm.controls['birthDate'].valueChanges.pipe(
      debounceTime(1500)
    ).subscribe({
      next: async (value: Date) => {
        // === wait for calculate age from birthdate ===
        if (value) {
          const formatbirthdatenew = moment(value).format('DD/MM/YYYY')
          if (formatbirthdatenew) {

            const agecalcualte = await lastValueFrom(this.masterDataService.getagefrombirthdate(formatbirthdatenew))
            // == set age to form field ==
            this.cizForm.controls['age'].setValue(agecalcualte.data[0].age_year)

          }
        }
      }, error: (e) => {

      }, complete: () => {

      }
    })

  }


  ngAfterViewInit(): void {
    this.cdRef.detectChanges();
  }

  ngOnInit(): void {

    this.loadingService.showLoader()
    combineLatest([
      this.masterDataService.getTitle(),
      this.masterDataService.getProvice(),
      this.masterDataService.getmariedstatus(),
      this.masterDataService.gethousetype(),
      this.masterDataService.gethouseownertype(),
      this.quotationReq
    ]).subscribe({
      next: (resultMaster) => {
        // === set master data ====
        this.loadingService.hideLoader()
        this.masterTitle = resultMaster[0]
        this.masterProvince = resultMaster[1]
        this.masterMariedStatus = resultMaster[2]
        this.masterHouseType = resultMaster[3]
        this.masterHouseOwnerType = resultMaster[4]

        this.quotationdatatemp = resultMaster[5]

        if (this.quotationdatatemp.status == 200) {
          this.setquotationdata();
        }

      }, error: (e) => {
        this.loadingService.hideLoader()
        console.log(`error during call master data from oracle DB : ${e.message}`)
      }, complete: () => {
        this.loadingService.hideLoader()
      }
    })
  }

  async setquotationdata() {
    // console.log(`this is quotation temp (citizenid): ${this.quotationdatatemp.data[0].first_name}`);

    const quoitem = this.quotationdatatemp.data[0];
    // === set informationForm ===
    this.cizForm.get('firstName')?.setValue(quoitem.first_name ?? '')
    this.cizForm.get('lastName')?.setValue(quoitem.last_name ?? '')
    this.cizForm.get('citizenId')?.setValue(quoitem.idcard_num ?? '')
    this.cizForm.get('phoneNumber')?.setValue(quoitem.phone_number ?? '')
    this.cizForm.get('email')?.setValue(quoitem.email ?? '')
    this.cizForm.get('address')?.setValue(quoitem.ciz_address ?? '')
    this.cizForm.get('subDistrict')?.setValue(quoitem.ciz_sub_district ?? '')
    this.cizForm.get('district')?.setValue(quoitem.ciz_district ?? '')
    this.cizForm.get('gender')?.setValue(quoitem.ciz_gender ?? null)
    this.cizForm.get('provinceName')?.setValue(quoitem.ciz_province_name ?? '')
    this.cizForm.get('postalCode')?.setValue(quoitem.ciz_postal_code ?? '')
    this.cizForm.get('provinceCode')?.setValue(quoitem.ciz_province_code ?? null)
    this.cizForm.get('titleName')?.setValue(quoitem.title_name ?? null)
    this.cizForm.get('issuePlace')?.setValue(quoitem.ciz_issued_place ?? null)

    // === set new 6 field (stay year, stay month , nickname, marie status, house type, house owner type) (15/11/2022) ===
    this.cizForm.get('nickName')?.setValue(quoitem.ciz_nickname)
    this.cizForm.get('mariedStatus')?.setValue(quoitem.ciz_maried_status)
    this.cizForm.get('houseType')?.setValue(quoitem.ciz_house_type)
    this.cizForm.get('stayedMonth')?.setValue(quoitem.ciz_stayed_month)
    this.cizForm.get('stayedYear')?.setValue(quoitem.ciz_stayed_year)
    this.cizForm.get('houseOwnerType')?.setValue(quoitem.ciz_house_owner_type)

    // this.informationForm.get('uploadImg')?.setValue(quoitem.ciz_upload)
    // ==== not show ==== 

    // === warning at some api flow ref with date text ===
    // this.cizForm.get('birthDateTextThai')?.setValue(quoitem.birth_date_text_th)
    // this.cizForm.get('birthDateTextEng')?.setValue(quoitem.birth_date_text_en)

    // === set field date ===
    const clinet_format_issue_date = quoitem.ciz_issued_date ? this.changeDateFormat(quoitem.ciz_issued_date) : null;
    const clinet_format_expired_date = quoitem.ciz_expired_date ? this.changeDateFormat(quoitem.ciz_expired_date) : null;
    const clinet_format_bitrh_date = quoitem.birth_date ? this.changeDateFormat(quoitem.birth_date) : null;
    this.cizForm.get('issueDate')?.setValue(clinet_format_issue_date)
    this.cizForm.get('expireDate')?.setValue(clinet_format_expired_date)
    this.cizForm.get('birthDate')?.setValue(clinet_format_bitrh_date)

    // === set livingAddressForm ===
    this.cizForm.get('livingAddress.address')?.setValue(quoitem.lvp_address ?? '')
    this.cizForm.get('livingAddress.subDistrict')?.setValue(quoitem.lvp_sub_district ?? '')
    this.cizForm.get('livingAddress.district')?.setValue(quoitem.lvp_district ?? '')
    this.cizForm.get('livingAddress.provinceCode')?.setValue(quoitem.lvp_province_code ?? '')
    this.cizForm.get('livingAddress.postalCode')?.setValue(quoitem.lvp_postal_code ?? '')
    this.cizForm.get('livingAddress.la')?.setValue(quoitem.lvp_latitude ?? '')
    this.cizForm.get('livingAddress.lon')?.setValue(quoitem.lvp_londtiude ?? '')
    this.cizForm.get('livingAddress.lalon')?.setValue(quoitem.lvp_lalon ?? '')

    // === set conatactAddressForm ===
    this.cizForm.get('contactAddress.address')?.setValue(quoitem.ctp_address ?? '')
    this.cizForm.get('contactAddress.subDistrict')?.setValue(quoitem.ctp_sub_district ?? '')
    this.cizForm.get('contactAddress.district')?.setValue(quoitem.ctp_district ?? '')
    this.cizForm.get('contactAddress.provinceCode')?.setValue(quoitem.ctp_province_code ?? '')
    this.cizForm.get('contactAddress.postalCode')?.setValue(quoitem.ctp_postal_code ?? '')

    // === set conatactAddressForm ===
    this.cizForm.get('houseRegisAddress.address')?.setValue(quoitem.hrp_address ?? '')
    this.cizForm.get('houseRegisAddress.subDistrict')?.setValue(quoitem.hrp_sub_district ?? '')
    this.cizForm.get('houseRegisAddress.district')?.setValue(quoitem.hrp_district ?? '')
    this.cizForm.get('houseRegisAddress.provinceCode')?.setValue(quoitem.hrp_province_code ?? '')
    this.cizForm.get('houseRegisAddress.postalCode')?.setValue(quoitem.hrp_postal_code ?? '')

    // === set workAddressForm ===
    this.cizForm.get('workAddress.address')?.setValue(quoitem.wp_address ?? '')
    this.cizForm.get('workAddress.subDistrict')?.setValue(quoitem.wp_sub_district ?? '')
    this.cizForm.get('workAddress.district')?.setValue(quoitem.wp_district ?? '')
    this.cizForm.get('workAddress.provinceCode')?.setValue(quoitem.wp_province_code ?? '')
    this.cizForm.get('workAddress.postalCode')?.setValue(quoitem.wp_postal_code ?? '')

    // === set image from dipchip to src (03/10/2022) === 

    if (quoitem.cizcard_image) {

      const loadimage = await this.getUrlImage_cizcard_image(quoitem.cizcard_image)

      this.cizCardImage = loadimage
    }

  }


  onClickDipchipBtn() {

    let countround = 0
    this.loadingService.showLoader()
    this.dipchipService.getdipchipinfo({
      token: '',
      username: this.usernamefordipchip,
      fromBody: ''
    }).subscribe({
      next: (result) => {

        if (result.number == 200) {

          const dipchipdata = result.data[0]

          this.cizCardImage = 'data:image/jpeg;base64,' + dipchipdata.PERSONAL_IMAGE
          this.cizCardImage_string = dipchipdata.PERSONAL_IMAGE

          this.cizForm.get('titleName')?.setValue(dipchipdata.PERSONAL_THAI_BEGIN_NAME)
          this.cizForm.get('titleCode')?.setValue(this.mapTitleNameById(dipchipdata.PERSONAL_THAI_BEGIN_NAME, this.masterTitle.data))
          this.cizForm.get('firstName')?.setValue(dipchipdata.PERSONAL_THAI_NAME);
          this.cizForm.get('lastName')?.setValue(dipchipdata.PERSONAL_THAI_SURNAME);
          this.cizForm.get('citizenId')?.setValue(dipchipdata.PERSONAL_ID);
          this.cizForm.get('address')?.setValue(dipchipdata.HOUSE_NO + ' ' + dipchipdata.ALLEY + ' ' + dipchipdata.SOI + ' ' + dipchipdata.ROAD);
          this.cizForm.get('subDistrict')?.setValue(dipchipdata.SUB_DISTRICT);
          this.cizForm.get('district')?.setValue(dipchipdata.DISTRICT);
          this.cizForm.get('provinceName')?.setValue(dipchipdata.PROVINCE);
          this.cizForm.get('provinceCode')?.setValue(this.mapProvinceNameById(dipchipdata.PROVINCE, this.masterProvince.data));
          this.cizForm.get('postalCode')?.setValue(dipchipdata.POST_CODE);
          this.cizForm.get('issuePlace')?.setValue(dipchipdata.ISSUE_LOCATION);
          this.cizForm.get('gender')?.setValue(+(dipchipdata.PERSONAL_GENDER))



          const issueDateFormat = this.convertstringtodatedipchip(dipchipdata.ISSUE_DATE)
          const expiredDateFormat = this.convertstringtodatedipchip(dipchipdata.EXPIRE_DATE)
          const birthDateFormat = this.convertstringtodatedipchip(dipchipdata.PERSONAL_BIRTHDAY)

          if (issueDateFormat) this.cizForm.get('issueDate')?.setValue(issueDateFormat)
          if (expiredDateFormat) this.cizForm.get('expireDate')?.setValue(expiredDateFormat)
          if (birthDateFormat) this.cizForm.get('birthDate')?.setValue(birthDateFormat)

          // === set session citizen ocr API  ==== 
          const citizenSession: any = result
          citizenSession.imageUrl = this.cizCardImage
          sessionStorage.setItem('citizenSession', JSON.stringify(citizenSession));

          this.cizForm.markAsDirty()
          this.dipchipRes.emit({ status: true, uuid: dipchipdata.UUID })

        } else if (result.number == 500) {

          // === handle token expire === 
          if (result.message == 'Token is Expire') {
            this.dipchipService.addtimetokendipchip().subscribe({
              next: (result) => {
                countround++
                if (countround == 1) {
                  this.onClickDipchipBtn();
                }
              }, error: (e) => {

              }
            })
          }
        } else {
          // === do not handle ====
        }
      }, error: (e) => {
        // === error === 
      }, complete: () => {
        this.loadingService.hideLoader()
      }
    })
  }

  onClickBtnVerifyPhone() {
    this.dialog.open(OtpVeifyDialogComponent, {
      panelClass: 'custom-dialog-header',
      width: `80%`,
      height: `90%`,
      data: {
        header: `หน้ายืนยันเบอร์โทรศัพท์`,
        message: `ของคุณ ...`,
        quotationid: this.quotationdatatemp.data[0].quo_key_app_id,
        phone_number: this.cizForm.controls['phoneNumber'].value,
        refid: `${this.quotationdatatemp.data[0].quo_id}`,
        button_name: `ตกลง`
      }
    }).afterClosed().subscribe(res => {
      // === do something ===
    })
  }
}
