import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as moment from 'moment';
import { combineLatest, debounceTime, lastValueFrom, map, Observable, of, Subject } from 'rxjs';
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
import { BasicSnackbarComponent } from 'src/app/widget/snackbar/basic-snackbar/basic-snackbar.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-ciz-card-tab',
  templateUrl: './ciz-card-tab.component_v1.html',
  styleUrls: ['./ciz-card-tab.component.scss']
})
export class CizCardTabComponent extends BaseService implements OnInit, AfterViewInit {

  @Input() quotationReq = {} as Observable<IResQuotationDetail>;
  @Output() dipchipRes = new EventEmitter<IReqFlagDipchip>();

  quotationdatatemp: IResQuotationDetail = {} as IResQuotationDetail
  phonevalidstatus: string = ''

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
  gender = new FormControl<number | null>(null, Validators.required)
  phoneNumber = new FormControl<string>('', [
    Validators.required,
    Validators.pattern('^[0-9]{9,10}$')
  ])
  // email = new FormControl('', Validators.required)
  citizenId = new FormControl('', [Validators.required, Validators.pattern('^[0-9]{13}$')])
  birthDate = new FormControl<string | null>(null, Validators.required)
  issueDate = new FormControl<string | null>(null, Validators.required)
  expireDate = new FormControl<string | null>(null, Validators.required)
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

  _address = new FormControl('')
  _subDistrict = new FormControl('')
  _district = new FormControl('')
  _provinceName = new FormControl('')
  _provinceCode = new FormControl('') // not show
  _postalCode = new FormControl('', Validators.pattern('^[0-9]{5}$'))

  // livingAddress 
  _l_address = new FormControl('')
  _l_subDistrict = new FormControl('')
  _l_district = new FormControl('')
  _l_provinceName = new FormControl('')
  _l_provinceCode = new FormControl('') // not show
  _l_postalCode = new FormControl('', Validators.pattern('^[0-9]{5}$'))

  // contactAddress 
  _c_address = new FormControl('')
  _c_subDistrict = new FormControl('')
  _c_district = new FormControl('')
  _c_provinceName = new FormControl('')
  _c_provinceCode = new FormControl('') // not show
  _c_postalCode = new FormControl('', Validators.pattern('^[0-9]{5}$'))

  // houseRegisAddress 
  _h_address = new FormControl('')
  _h_subDistrict = new FormControl('')
  _h_district = new FormControl('')
  _h_provinceName = new FormControl('')
  _h_provinceCode = new FormControl('') // not show
  _h_postalCode = new FormControl('', Validators.pattern('^[0-9]{5}$'))

  // livingAddress 
  _w_address = new FormControl('')
  _w_subDistrict = new FormControl('')
  _w_district = new FormControl('')
  _w_provinceName = new FormControl('')
  _w_provinceCode = new FormControl('') // not show
  _w_postalCode = new FormControl('', Validators.pattern('^[0-9]{5}$'))

  lalon = new FormControl('')
  la = new FormControl('')
  lon = new FormControl('')

  // ** age valid ** 
  age = new FormControl<Number | null>(null, [Validators.min(20), Validators.required]) // === under 20 years age can't create quotation ===
  phoneValid = new FormControl<boolean>(false, Validators.requiredTrue) /// ==== Validator OTP phone status ====
  // *** waiting dopa status check ***

  maincitizenForm = this.fb.group({
    age: this.age,
    phonevalid: this.phoneValid,
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
    // *** show in client Now *** 
    issueDate: this.issueDate,
    expireDate: this.expireDate,
    birthDate: this.birthDate,
    // *** add new (19/05/2022) ***
    // issueDateText: new FormControl(), // === NOT SHOW IN CLIENT
    // expireDateText: new FormControl(), // === NOT SHOW IN CLIENT
    // birthDateTextThai: new FormControl(),
    // birthDateTextEng: new FormControl(),
    issuePlace: this.issuePlace,
  })

  livingAddress = this.fb.group({
    address: this._l_address,
    subDistrict: this._l_subDistrict,
    district: this._l_district,
    provinceCode: this._l_provinceName,
    provinceName: this._l_provinceCode,
    lalon: this.lalon,
    la: this.la,
    lon: this.lon,
    postalCode: this._l_postalCode,
  })

  contactAddress = this.fb.group({
    address: this._c_address,
    subDistrict: this._c_subDistrict,
    district: this._c_district,
    provinceCode: this._c_provinceName,
    provinceName: this._c_provinceCode,
    postalCode: this._postalCode,
  })

  houseRegisAddress = this.fb.group({
    address: this._h_address,
    subDistrict: this._h_subDistrict,
    district: this._h_district,
    provinceCode: this._h_provinceName,
    provinceName: this._h_provinceCode,
    postalCode: this._h_postalCode,
  })

  workAddress = this.fb.group({
    address: this._w_address,
    subDistrict: this._w_subDistrict,
    district: this._w_district,
    provinceCode: this._w_provinceName,
    provinceName: this._w_provinceCode,
    postalCode: this._w_postalCode,
  })

  cizForm = this.fb.group({
    maincitizenForm: this.maincitizenForm,
    livingAddress: this.livingAddress,
    contactAddress: this.contactAddress,
    houseRegisAddress: this.houseRegisAddress,
    workAddress: this.workAddress
  });

  constructor(
    private fb: FormBuilder,
    private cdRef: ChangeDetectorRef,
    public quotationService: QuotationService,
    private loadingService: LoadingService,
    private masterDataService: MasterDataService,
    private dipchipService: DipchipService,
    public override dialog: MatDialog,
    public override _snackBar: MatSnackBar
  ) {
    super(dialog, _snackBar)

    this.cizForm.controls.maincitizenForm.controls.titleName.valueChanges.subscribe((value) => {
      const titleSelect = this.masterTitle.data.find((res) => { return value == res.title_name })
      this.cizForm.controls.maincitizenForm.controls.titleCode.setValue(titleSelect?.title_id ? titleSelect?.title_id : '')
    })

    this.cizForm.controls.maincitizenForm.controls.provinceName.valueChanges.subscribe((value) => {
      const provSelect = this.masterProvince.data.find((res) => { return value == res.prov_name })
      this.cizForm.controls.maincitizenForm.controls.provinceCode.setValue(provSelect?.prov_code ? provSelect?.prov_code : '')
    })

    this.cizForm.controls.livingAddress.controls.provinceName.valueChanges.subscribe((value) => {
      const provSelect = this.masterProvince.data.find((res) => { return value == res.prov_name })
      this.cizForm.controls.livingAddress.controls.provinceCode.setValue(provSelect?.prov_code ? provSelect.prov_code : '')
    })

    this.cizForm.controls.contactAddress.controls.provinceName.valueChanges.subscribe((value) => {
      const provSelect = this.masterProvince.data.find((res) => { return value == res.prov_name })
      this.cizForm.controls.contactAddress.controls.provinceCode.setValue(provSelect?.prov_code ? provSelect?.prov_code : '')
    })

    this.cizForm.controls.houseRegisAddress.controls.provinceName.valueChanges.subscribe((value) => {
      const provSelect = this.masterProvince.data.find((res) => { return value == res.prov_name })
      this.cizForm.controls.houseRegisAddress.controls.provinceCode.setValue(provSelect?.prov_code ? provSelect?.prov_code : '')
    })

    this.cizForm.controls.workAddress.controls.provinceName.valueChanges.subscribe((value) => {
      const provSelect = this.masterProvince.data.find((res) => { return value == res.prov_name })
      this.cizForm.controls.workAddress.controls.provinceCode.setValue(provSelect?.prov_code ? provSelect?.prov_code : '')
    })
    this.cizForm.controls.maincitizenForm.controls.birthDate.valueChanges.pipe(
      debounceTime(1500)
    ).subscribe({
      next: async (value: any) => {
        // === wait for calculate age from birthdate ===
        if (value) {
          const formatbirthdatenew = moment(value).format('DD/MM/YYYY')
          if (formatbirthdatenew) {

            const agecalcualte = await lastValueFrom(this.masterDataService.getagefrombirthdate(formatbirthdatenew))
            // == set age to form field ==
            this.cizForm.controls.maincitizenForm.controls.age.setValue(agecalcualte.data[0].age_year)
          }
        }
      }, error: (e) => {

      }, complete: () => {

      }
    })


  }

  getErrorMessagePhone() {
    if (this.cizForm.controls.maincitizenForm.controls.phoneNumber.hasError('required')) {
      return 'กรุณากรอกเบอร์โทรศัพท์';
    }

    return this.cizForm.controls.maincitizenForm.controls.phoneNumber.hasError('pattern') ? 'กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง' : '';
  }


  ngAfterViewInit(): void {
    this.cdRef.detectChanges();
  }

  ngOnInit(): void {

    this.quotationReq.subscribe({
      next: (res) => {
        // *** set phone valid status *** 
        if (res.data) {
          if (res.data.length !== 0) {

            const quodata = res.data[0]

            // *** check and trigger field phone number on form field ***
            if(quodata.phone_number == '') {
              this.cizForm.controls.maincitizenForm.controls.phoneNumber.markAllAsTouched()
            }
            // *** set phone valid status text ***
            if (quodata.quo_key_app_id !== '') {
              if (quodata.ciz_phone_valid_status == 'Y') {
                this.phonevalidstatus = `✅ : ได้รับการยืนยันเบอร์โทรศัพท์แล้ว`
              } else {
                this.phonevalidstatus = `❌ : ยังไม่ได้รับการยืนยันเบอร์โทรศัพท์`
              }
            }
          }
        }
      }, error: (e) => {
        console.log(`Error on get observable quotation result : ${e.messgae}`)
      }, complete: () => {
        console.log(`complete observe !`)
      }
    })

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
    this.cizForm.controls.maincitizenForm.controls.firstName.setValue(quoitem.first_name ?? '')
    this.cizForm.controls.maincitizenForm.controls.lastName.setValue(quoitem.last_name ?? '')
    this.cizForm.controls.maincitizenForm.controls.citizenId.setValue(quoitem.idcard_num ?? '')
    this.cizForm.controls.maincitizenForm.controls.phoneNumber.setValue(quoitem.phone_number ?? '')
    // this.cizForm.controls.maincitizenForm.controls.email.setValue(quoitem.email ?? '')
    this.cizForm.controls.maincitizenForm.controls.address.setValue(quoitem.ciz_address ?? '')
    this.cizForm.controls.maincitizenForm.controls.subDistrict.setValue(quoitem.ciz_sub_district ?? '')
    this.cizForm.controls.maincitizenForm.controls.district.setValue(quoitem.ciz_district ?? '')
    this.cizForm.controls.maincitizenForm.controls.gender.setValue(quoitem.ciz_gender ?? null)
    this.cizForm.controls.maincitizenForm.controls.provinceName.setValue(quoitem.ciz_province_name ?? '')
    this.cizForm.controls.maincitizenForm.controls.provinceCode.setValue(quoitem.ciz_province_code ?? '')
    this.cizForm.controls.maincitizenForm.controls.postalCode.setValue(quoitem.ciz_postal_code ?? '')
    this.cizForm.controls.maincitizenForm.controls.provinceCode.setValue(quoitem.ciz_province_code ?? null)
    this.cizForm.controls.maincitizenForm.controls.titleName.setValue(quoitem.title_name ?? null)
    this.cizForm.controls.maincitizenForm.controls.issuePlace.setValue(quoitem.ciz_issued_place ?? null)

    // === set new 6 field (stay year, stay month , nickname, marie status, house type, house owner type) (15/11/2022) ===
    // this.cizForm.controls.maincitizenForm.controls.nickName.setValue(quoitem.ciz_nickname)
    // this.cizForm.controls.maincitizenForm.controls.mariedStatus.setValue(quoitem.ciz_maried_status)
    // this.cizForm.controls.maincitizenForm.controls.houseType.setValue(quoitem.ciz_house_type)
    // this.cizForm.controls.maincitizenForm.controls.stayedMonth.setValue(quoitem.ciz_stayed_month)
    // this.cizForm.controls.maincitizenForm.controls.stayedYear.setValue(quoitem.ciz_stayed_year)
    // this.cizForm.controls.maincitizenForm.controls.houseOwnerType.setValue(quoitem.ciz_house_owner_type)

    // this.informationForm.get('uploadImg')?.setValue(quoitem.ciz_upload)
    // ==== not show ==== 

    // === warning at some api flow ref with date text ===
    // this.cizForm.get('birthDateTextThai')?.setValue(quoitem.birth_date_text_th)
    // this.cizForm.get('birthDateTextEng')?.setValue(quoitem.birth_date_text_en)

    // === set field date ===
    const clinet_format_issue_date = quoitem.ciz_issued_date ? this.changeDateFormat(quoitem.ciz_issued_date) : null;
    const clinet_format_expired_date = quoitem.ciz_expired_date ? this.changeDateFormat(quoitem.ciz_expired_date) : null;
    const clinet_format_bitrh_date = quoitem.birth_date ? this.changeDateFormat(quoitem.birth_date) : null;

    this.cizForm.controls.maincitizenForm.controls.issueDate.setValue(clinet_format_issue_date ? clinet_format_issue_date : null)
    this.cizForm.controls.maincitizenForm.controls.expireDate.setValue(clinet_format_expired_date ? clinet_format_expired_date : null)
    this.cizForm.controls.maincitizenForm.controls.birthDate.setValue(clinet_format_bitrh_date ? clinet_format_bitrh_date : null)

    // === set livingAddressForm ===
    this.cizForm.controls.livingAddress.controls.address.setValue(quoitem.lvp_address ?? '')
    this.cizForm.controls.livingAddress.controls.subDistrict.setValue(quoitem.lvp_sub_district ?? '')
    this.cizForm.controls.livingAddress.controls.district.setValue(quoitem.lvp_district ?? '')
    this.cizForm.controls.livingAddress.controls.provinceCode.setValue(quoitem.lvp_province_code ?? '')
    this.cizForm.controls.livingAddress.controls.postalCode.setValue(quoitem.lvp_postal_code ?? '')
    this.cizForm.controls.livingAddress.controls.la.setValue(quoitem.lvp_latitude ?? '')
    this.cizForm.controls.livingAddress.controls.lon.setValue(quoitem.lvp_londtiude ?? '')
    this.cizForm.controls.livingAddress.controls.lalon.setValue(quoitem.lvp_lalon ?? '')

    // === set conatactAddressForm ===
    this.cizForm.controls.contactAddress.controls.address.setValue(quoitem.ctp_address ?? '')
    this.cizForm.controls.contactAddress.controls.subDistrict.setValue(quoitem.ctp_sub_district ?? '')
    this.cizForm.controls.contactAddress.controls.district.setValue(quoitem.ctp_district ?? '')
    this.cizForm.controls.contactAddress.controls.provinceCode.setValue(quoitem.ctp_province_code ?? '')
    this.cizForm.controls.contactAddress.controls.postalCode.setValue(quoitem.ctp_postal_code ?? '')

    // === set houseRegisAddressForm ===
    this.cizForm.controls.houseRegisAddress.controls.address.setValue(quoitem.hrp_address ?? '')
    this.cizForm.controls.houseRegisAddress.controls.subDistrict.setValue(quoitem.hrp_sub_district ?? '')
    this.cizForm.controls.houseRegisAddress.controls.district.setValue(quoitem.hrp_district ?? '')
    this.cizForm.controls.houseRegisAddress.controls.provinceCode.setValue(quoitem.hrp_province_code ?? '')
    this.cizForm.controls.houseRegisAddress.controls.postalCode.setValue(quoitem.hrp_postal_code ?? '')

    // === set workAddressForm ===
    this.cizForm.controls.workAddress.controls.address.setValue(quoitem.wp_address ?? '')
    this.cizForm.controls.workAddress.controls.subDistrict.setValue(quoitem.wp_sub_district ?? '')
    this.cizForm.controls.workAddress.controls.district.setValue(quoitem.wp_district ?? '')
    this.cizForm.controls.workAddress.controls.provinceCode.setValue(quoitem.wp_province_code ?? '')
    this.cizForm.controls.workAddress.controls.postalCode.setValue(quoitem.wp_postal_code ?? '')


    this.cizForm.controls.maincitizenForm.controls.age.setValue(quoitem.ciz_age ?? null)
    this.cizForm.controls.maincitizenForm.controls.phonevalid.setValue(quoitem.ciz_phone_valid_status == 'Y' ? true : false)

    // === set image from dipchip to src (03/10/2022) === 

    if (quoitem.cizcard_image) {

      const loadimage = await this.getUrlImage_cizcard_image(quoitem.cizcard_image)

      this.cizCardImage = loadimage
    }

    this.cizForm.controls.maincitizenForm.controls.phoneNumber.markAllAsTouched()

  }


  onClickDipchipBtn() {

    let countround = 0
    this.loadingService.showLoader()
    this.dipchipService.getdipchipinfo({
      token: '',
      username: this.usernamefordipchip,
      fromBody: ''
    }).subscribe({
      next: async (result) => {

        if (result.number == 200) {

          const dipchipdata = result.data[0]

          this.cizCardImage = 'data:image/jpeg;base64,' + dipchipdata.PERSONAL_IMAGE
          this.cizCardImage_string = dipchipdata.PERSONAL_IMAGE

          this.cizForm.controls.maincitizenForm.controls.titleName.setValue(dipchipdata.PERSONAL_THAI_BEGIN_NAME)
          this.cizForm.controls.maincitizenForm.controls.titleCode.setValue(this.mapTitleNameById(dipchipdata.PERSONAL_THAI_BEGIN_NAME, this.masterTitle.data))
          this.cizForm.controls.maincitizenForm.controls.firstName.setValue(dipchipdata.PERSONAL_THAI_NAME);
          this.cizForm.controls.maincitizenForm.controls.lastName.setValue(dipchipdata.PERSONAL_THAI_SURNAME);
          this.cizForm.controls.maincitizenForm.controls.citizenId.setValue(dipchipdata.PERSONAL_ID);
          this.cizForm.controls.maincitizenForm.controls.address.setValue(dipchipdata.HOUSE_NO + ' ' + dipchipdata.ALLEY + ' ' + dipchipdata.SOI + ' ' + dipchipdata.ROAD);
          this.cizForm.controls.maincitizenForm.controls.subDistrict.setValue(dipchipdata.SUB_DISTRICT);
          this.cizForm.controls.maincitizenForm.controls.district.setValue(dipchipdata.DISTRICT);
          this.cizForm.controls.maincitizenForm.controls.provinceName.setValue(dipchipdata.PROVINCE);
          this.cizForm.controls.maincitizenForm.controls.provinceCode.setValue(this.mapProvinceNameById(dipchipdata.PROVINCE, this.masterProvince.data));
          this.cizForm.controls.maincitizenForm.controls.postalCode.setValue(dipchipdata.POST_CODE ? dipchipdata.POST_CODE : '');
          this.cizForm.controls.maincitizenForm.controls.issuePlace.setValue(dipchipdata.ISSUE_LOCATION);
          this.cizForm.controls.maincitizenForm.controls.gender.setValue(+(dipchipdata.PERSONAL_GENDER))



          const issueDateFormat = this.convertstringtodatedipchip(dipchipdata.ISSUE_DATE)
          const expiredDateFormat = this.convertstringtodatedipchip(dipchipdata.EXPIRE_DATE)
          const birthDateFormat = this.convertstringtodatedipchip(dipchipdata.PERSONAL_BIRTHDAY)

          if (issueDateFormat) this.cizForm.controls.maincitizenForm.controls.issueDate.setValue(issueDateFormat)
          if (expiredDateFormat) this.cizForm.controls.maincitizenForm.controls.expireDate.setValue(expiredDateFormat)
          if (birthDateFormat) this.cizForm.controls.maincitizenForm.controls.birthDate.setValue(birthDateFormat)

          // *** calculate age form bithdate *** 

          if (dipchipdata.PERSONAL_BIRTHDAY) {
            const formatbirthdatenew = moment(birthDateFormat).format('DD/MM/YYYY')
            if (formatbirthdatenew) {
              
              const agecalcualte = await lastValueFrom(this.masterDataService.getagefrombirthdate(formatbirthdatenew))
              // == set age to form field ==
              this.cizForm.controls.maincitizenForm.controls.age.setValue(agecalcualte.data[0].age_year)
            }
          }

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

  // onClickBtnVerifyPhone() {

  //   // == ตรวจ
  //   this.dialog.open(OtpVeifyDialogComponent, {
  //     panelClass: 'custom-dialog-header',
  //     width: `80%`,
  //     height: `90%`,
  //     data: {
  //       header: `หน้ายืนยันเบอร์โทรศัพท์`,
  //       message: `ของคุณ ...`,
  //       quotationid: this.quotationdatatemp.data[0].quo_key_app_id,
  //       phone_number: this.cizForm.controls.maincitizenForm.controls.phoneNumber.value,
  //       refid: `${this.quotationdatatemp.data[0].quo_app_ref_no}`,
  //       button_name: `ตกลง`
  //     }
  //   }).afterClosed().subscribe(res => {
  //     // === do something ===
  //   })
  // }
}
