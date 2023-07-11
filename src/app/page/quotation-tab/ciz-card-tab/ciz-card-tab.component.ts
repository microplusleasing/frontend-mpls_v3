import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { combineLatest, debounceTime, forkJoin, lastValueFrom, map, Observable, of, Subject } from 'rxjs';
import { IReqFlagDipchip } from 'src/app/interface/i-req-flag-dipchip';
import { IResHouseOwnerType } from 'src/app/interface/i-res-house-owner-type';
import { IResHouseType } from 'src/app/interface/i-res-house-type';
import { IResMariedStatus } from 'src/app/interface/i-res-maried-status';
import { IResMasterProvince, IResMasterProvinceData } from 'src/app/interface/i-res-master-province';
import { IResMasterTitle, IResMasterTitleData } from 'src/app/interface/i-res-master-title';
import { IResQuotationDetail } from 'src/app/interface/i-res-quotation-detail';
import { IUserTokenData } from 'src/app/interface/i-user-token';
import { BaseService } from 'src/app/service/base/base.service';
import { DipchipService } from 'src/app/service/dipchip.service';
import { LoadingService } from 'src/app/service/loading.service';
import { MasterDataService } from 'src/app/service/master.service';
import { QuotationService } from 'src/app/service/quotation.service';
import { FaceValidDialogComponent } from 'src/app/widget/dialog/face-valid-dialog/face-valid-dialog.component';
import { MainDialogComponent } from 'src/app/widget/dialog/main-dialog/main-dialog.component';
import { WaringEconsentDialogComponent } from 'src/app/widget/dialog/waring-econsent-dialog/waring-econsent-dialog.component';
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
  @Output() facevalid = new EventEmitter();
  @Output() phonenumbervalue = new EventEmitter();

  userSession: IUserTokenData = {} as IUserTokenData


  // === add ciz_age_insurance (24/05/2023) ===
  @Output() ciz_age_insurance = new EventEmitter<number>();

  @Output() ciz_age = new EventEmitter<number>();
  @Output() ciz_gender = new EventEmitter<number>();
  @Output() birth_date = new EventEmitter<Date | null>();

  quotationdatatemp: IResQuotationDetail = {} as IResQuotationDetail
  phonevalidstatus: string = ''
  facevalidstatus: string = ''
  quotationid: string = ''
  showdipchipbtn: boolean = false
  dipchipButtonDisabled: boolean = true
  lockallbtn: boolean = false


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
  titleCode = new FormControl<string | undefined>('', Validators.required)
  titleName = new FormControl<string | undefined>('', Validators.required) // not show 
  firstName = new FormControl('', Validators.required)
  lastName = new FormControl('', Validators.required)
  gender = new FormControl<number | null | undefined>(null, Validators.required)
  // email = new FormControl('', Validators.required)
  citizenId = new FormControl('', [Validators.required, Validators.pattern('^[0-9]{13}$')])
  birthDate = new FormControl<string | null>(null, Validators.required)
  issueDate = new FormControl<string | null>(null, Validators.required)
  expireDate = new FormControl<string | null>(null, Validators.required)
  issuePlace = new FormControl('', Validators.required)

  address = new FormControl('', Validators.required)
  subDistrict = new FormControl('', Validators.required)
  district = new FormControl('', Validators.required)
  provinceName = new FormControl<string | undefined>('', Validators.required)
  provinceCode = new FormControl<string | undefined>('', Validators.required) // not show
  postalCode = new FormControl('', [
    Validators.required,
    Validators.pattern('^[0-9]{5}$')
  ])

  // === ข้อมูลทั่วไป ===
  phoneNumber = new FormControl<string>('', [
    Validators.required,
    Validators.pattern('^[0-9]{9,10}$')
  ])
  email = new FormControl('', [
    Validators.required,
    Validators.email
  ])
  mariedStatus = new FormControl<number | null>(null, Validators.required)
  nickName = new FormControl<string>('', Validators.required)
  houseType = new FormControl<number | null>(null, Validators.required)
  stayedYear = new FormControl<number | null>(null, [Validators.required, Validators.pattern('^(0?[0-9]|[1-9][0-9])$')])
  stayedMonth = new FormControl<number | null>(null, [Validators.required, Validators.pattern('^(0?[0-9]|1[012])$')])
  houseOwnerType = new FormControl<number | null>(null, Validators.required)


  // livingAddress 
  _l_address = new FormControl('', Validators.maxLength(70))
  _l_subDistrict = new FormControl('')
  _l_district = new FormControl('')
  _l_provinceName = new FormControl<string | undefined>('')
  _l_provinceCode = new FormControl<string | undefined>('') // not show
  _l_postalCode = new FormControl('', Validators.pattern('^[0-9]{5}$'))
  _l_lalon = new FormControl('')
  _l_latitude = new FormControl('')
  _l_longitude = new FormControl('')

  // contactAddress 
  _c_address = new FormControl('', Validators.maxLength(70))
  _c_subDistrict = new FormControl('')
  _c_district = new FormControl('')
  _c_provinceName = new FormControl<string | undefined>('')
  _c_provinceCode = new FormControl<string | undefined>('') // not show
  _c_postalCode = new FormControl('', Validators.pattern('^[0-9]{5}$'))

  // houseRegisAddress 
  _h_address = new FormControl('', Validators.maxLength(70))
  _h_subDistrict = new FormControl('')
  _h_district = new FormControl('')
  _h_provinceName = new FormControl<string | undefined>('')
  _h_provinceCode = new FormControl<string | undefined>('') // not show
  _h_postalCode = new FormControl('', Validators.pattern('^[0-9]{5}$'))

  // livingAddress 
  _w_address = new FormControl('', Validators.maxLength(70))
  _w_subDistrict = new FormControl('')
  _w_district = new FormControl('')
  _w_provinceName = new FormControl<string | undefined>('')
  _w_provinceCode = new FormControl<string | undefined>('') // not show
  _w_postalCode = new FormControl('', Validators.pattern('^[0-9]{5}$'))

  // === face comparison verify ===
  face_valid = new FormControl<boolean | null>(null, Validators.requiredTrue)

  lalon = new FormControl('')
  la = new FormControl('')
  lon = new FormControl('')

  // ** age valid ** 
  age = new FormControl<Number | null>(null, [Validators.min(20), Validators.required]) // === under 20 years age can't create quotation ===
  phoneValid = new FormControl<boolean>(false, Validators.requiredTrue) /// ==== Validator OTP phone status ====
  facecompareValid = new FormControl<boolean>(false, Validators.requiredTrue) /// ==== face vertify dialog ====
  isdipchip: boolean = true; // ==== check for dipchip auto stamp or manual case (use for trigger valueChange on field that master (province, title))

  // *** waiting dopa status check ***


  maincitizenForm = this.fb.group({
    age: this.age,
    // phonevalid: this.phoneValid,
    // uploadImg: this.uploadImg,
    titleCode: this.titleCode,
    gender: this.gender,
    titleName: this.titleName,
    firstName: this.firstName,
    lastName: this.lastName,
    citizenId: this.citizenId,
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

  generalinfoForm = this.fb.group({
    phoneNumber: this.phoneNumber,
    email: this.email,
    mariedStatus: this.mariedStatus,
    nickName: this.nickName,
    houseType: this.houseType,
    stayedYear: this.stayedYear,
    stayedMonth: this.stayedMonth,
    houseOwnerType: this.houseOwnerType

  })

  livingAddress = this.fb.group({
    address: this._l_address,
    subDistrict: this._l_subDistrict,
    district: this._l_district,
    provinceCode: this._l_provinceCode,
    provinceName: this._l_provinceName,
    postalCode: this._l_postalCode,
    lalon: this._l_lalon,
    la: this._l_latitude,
    lon: this._l_longitude
  })

  contactAddress = this.fb.group({
    address: this._c_address,
    subDistrict: this._c_subDistrict,
    district: this._c_district,
    provinceCode: this._c_provinceCode,
    provinceName: this._c_provinceName,
    postalCode: this._c_postalCode,
  })

  houseRegisAddress = this.fb.group({
    address: this._h_address,
    subDistrict: this._h_subDistrict,
    district: this._h_district,
    provinceCode: this._h_provinceCode,
    provinceName: this._h_provinceName,
    postalCode: this._h_postalCode,
  })

  workAddress = this.fb.group({
    address: this._w_address,
    subDistrict: this._w_subDistrict,
    district: this._w_district,
    provinceCode: this._w_provinceCode,
    provinceName: this._w_provinceName,
    postalCode: this._w_postalCode,
  })

  cizForm = this.fb.group({
    maincitizenForm: this.maincitizenForm,
    generalinfoForm: this.generalinfoForm,
    livingAddress: this.livingAddress,
    contactAddress: this.contactAddress,
    houseRegisAddress: this.houseRegisAddress,
    workAddress: this.workAddress,
    phonevalid: this.phoneValid,
    facecompareValid: this.facecompareValid
  });

  constructor(
    private fb: FormBuilder,
    private cdRef: ChangeDetectorRef,
    private router: Router,
    private actRoute: ActivatedRoute,
    public quotationService: QuotationService,
    private loadingService: LoadingService,
    private masterDataService: MasterDataService,
    private dipchipService: DipchipService,
    public override dialog: MatDialog,
    public override _snackBar: MatSnackBar
  ) {
    super(dialog, _snackBar)

    this.actRoute.queryParams.subscribe(params => {
      this.quotationid = params['id']
      if (this.quotationid) {
        this.dipchipButtonDisabled = true
      } else {
        this.dipchipButtonDisabled = false
      }
    });

    // === manual ===
    this.cizForm.controls.maincitizenForm.controls.provinceCode.valueChanges.subscribe((value) => {
      if (!this.isdipchip) {
        const provSelect = this.masterProvince.data.find((res) => { return value == res.prov_code })
        this.cizForm.controls.maincitizenForm.controls.provinceName.setValue(provSelect?.prov_name ? provSelect?.prov_name : '')
      }
    })

    this.cizForm.controls.maincitizenForm.controls.titleCode.valueChanges.subscribe((value) => {
      if (!this.isdipchip) {
        const provSelect = this.masterTitle.data.find((res) => { return value == res.title_id })
        this.cizForm.controls.maincitizenForm.controls.titleName.setValue(provSelect?.title_name ? provSelect?.title_name : '')
      }
    })


    // === dipchip ===
    this.cizForm.controls.maincitizenForm.controls.provinceName.valueChanges.subscribe((value) => {
      if (this.isdipchip) {
        const provSelect = this.masterProvince.data.find((res) => { return value == res.prov_name })
        this.cizForm.controls.maincitizenForm.controls.provinceCode.setValue(provSelect?.prov_code ? provSelect?.prov_code : '')
      }

    })

    this.cizForm.controls.livingAddress.controls.provinceName.valueChanges.subscribe((value) => {
      if (this.isdipchip) {
        const provSelect = this.masterProvince.data.find((res) => { return value == res.prov_name })
        this.cizForm.controls.livingAddress.controls.provinceCode.setValue(provSelect?.prov_code ? provSelect.prov_code : '')
      }
    })

    this.cizForm.controls.contactAddress.controls.provinceName.valueChanges.subscribe((value) => {
      if (this.isdipchip) {
        const provSelect = this.masterProvince.data.find((res) => { return value == res.prov_name })
        this.cizForm.controls.contactAddress.controls.provinceCode.setValue(provSelect?.prov_code ? provSelect?.prov_code : '')
      }
    })

    this.cizForm.controls.houseRegisAddress.controls.provinceName.valueChanges.subscribe((value) => {
      if (this.isdipchip) {
        const provSelect = this.masterProvince.data.find((res) => { return value == res.prov_name })
        this.cizForm.controls.houseRegisAddress.controls.provinceCode.setValue(provSelect?.prov_code ? provSelect?.prov_code : '')
      }
    })

    this.cizForm.controls.workAddress.controls.provinceName.valueChanges.subscribe((value) => {
      if (this.isdipchip) {
        const provSelect = this.masterProvince.data.find((res) => { return value == res.prov_name })
        this.cizForm.controls.workAddress.controls.provinceCode.setValue(provSelect?.prov_code ? provSelect?.prov_code : '')
      }
    })

    this.cizForm.controls.livingAddress.controls.lalon.valueChanges.subscribe((value) => {
      const lalonStr = value;
      if (lalonStr) {
        let rpString = lalonStr.replace(/[\(\)|\s]/g, "");
        let spitStr = rpString.split(",");
        if (spitStr.length > 1) {
          this.cizForm.controls.livingAddress.controls.la.setValue(spitStr[0])
          this.cizForm.controls.livingAddress.controls.lon.setValue(spitStr[1])
        }
      }
    })

    this.cizForm.controls.generalinfoForm.controls.phoneNumber.valueChanges.subscribe((value) => {
      this.phonenumbervalue.emit()
    })


    this.cizForm.controls.maincitizenForm.controls.gender.valueChanges.subscribe((value) => {
      this.ciz_gender.emit(value ?? undefined)
    })

    // === emit age inside birthdate valuechange ===
    this.cizForm.controls.maincitizenForm.controls.birthDate.valueChanges.pipe(
      debounceTime(1500)
    ).subscribe({
      next: async (value: any) => {

        // *** emit birh_date to quotation-tab (14/06/2023) ***
        this.birth_date.emit(value ?? null)
        // === wait for calculate age from birthdate ===
        if (value) {
          const formatbirthdatenew = moment(value).format('DD/MM/YYYY')
          // if (formatbirthdatenew) {

          //   // const agecalcualte = await lastValueFrom(this.masterDataService.getagefrombirthdate(formatbirthdatenew))
          //   const agecalcualte = await lastValueFrom(this.masterDataService.calculateage_db(formatbirthdatenew))
          //   // == set age to form field ==
          //   this.cizForm.controls.maincitizenForm.controls.age.setValue(agecalcualte.data[0].age_year)


          //   this.quotationReq.subscribe((value) => {
          //     if (value.data && value.data[0].ciz_age && value.data[0].ciz_age < 20) {
          //       // code to execute if value.data[0].ciz_age is less than 20 (no valid)
          //       this.quotationService.MPLS_cancle_quotation(value.data[0].quo_key_app_id).subscribe((response) => {
          //         if (response.status == 200) {

          //           // === Warning dialog and navigate dashboard ===
          //           this.dialog.open(MainDialogComponent, {
          //             panelClass: 'custom-dialog-container',
          //             data: {
          //               header: 'ไม่สามารถทำรายการได้',
          //               message: `อายุไม่ผ่านเกณฑ์ในการขอสินเชื่อ`,
          //               button_name: 'ปิด'
          //             }
          //           }).afterClosed().subscribe(result => {
          //             // === redirect to home page === 
          //             this.router.navigate(['/quotation-view']);
          //           });
          //         } else {
          //           this.snackbarfail(`Error : ${response.message}`)
          //         }
          //       })
          //     } else {

          //       if (agecalcualte.data.length !== 0) {
          //         this.ciz_age.emit(agecalcualte.data[0].age_year)

          //         // code to execute if value.data[0].ciz_age is not less than 20 
          //         // === case that new case (no quo_key_app_id) ====
          //         if (agecalcualte.data[0].age_year < 20) {
          //           // === กรณีอายุไม่ถึง 20 ปี และไม่มี quo_key_app_id ====
          //           this.dialog.open(MainDialogComponent, {
          //             panelClass: `custom-dialog-container`,
          //             data: {
          //               header: `ไม่สามารถทำรายการได้`,
          //               message: `อายุไม่ผ่านเกณฑ์ในการขอสินเชื่อ`,
          //               button_name: `ปิด`
          //             }
          //           }).afterClosed().subscribe((result) => {
          //             // === redirect to home page === 
          //             this.router.navigate(['/quotation-view'])
          //           })
          //         } else { }

          //       }
          //     }
          //   });
          // }

          if (formatbirthdatenew) {
            forkJoin([
              this.masterDataService.calculateage_db(formatbirthdatenew),
              this.masterDataService.getagefrombirthdate(formatbirthdatenew)
            ]).subscribe({
              next: (age_array) => {
                const agecalculate = age_array[0]
                const agecalculate_insurance = age_array[1]

                // == set age to form field ==
                this.cizForm.controls.maincitizenForm.controls.age.setValue(agecalculate.data[0].age_year)


                this.quotationReq.subscribe((value) => {
                  if (value.data && value.data[0].ciz_age && value.data[0].ciz_age < 20) {
                    // code to execute if value.data[0].ciz_age is less than 20 (no valid)
                    this.quotationService.MPLS_cancle_quotation(value.data[0].quo_key_app_id).subscribe((response) => {
                      if (response.status == 200) {

                        // === Warning dialog and navigate dashboard ===
                        this.dialog.open(MainDialogComponent, {
                          panelClass: 'custom-dialog-container',
                          data: {
                            header: 'ไม่สามารถทำรายการได้',
                            message: `อายุไม่ผ่านเกณฑ์ในการขอสินเชื่อ`,
                            button_name: 'ปิด'
                          }
                        }).afterClosed().subscribe(result => {
                          // === redirect to home page === 
                          this.router.navigate(['/quotation-view']);
                        });
                      } else {
                        this.snackbarfail(`Error : ${response.message}`)
                      }
                    })
                  } else {

                    if (agecalculate.data.length !== 0 && agecalculate_insurance.data.length !== 0) {
                      this.ciz_age.emit(agecalculate.data[0].age_year)
                      this.ciz_age_insurance.emit(agecalculate_insurance.data[0].age_year)

                      // code to execute if value.data[0].ciz_age is not less than 20 
                      // === case that new case (no quo_key_app_id) ====
                      if (agecalculate.data[0].age_year < 20) {
                        // === กรณีอายุไม่ถึง 20 ปี และไม่มี quo_key_app_id ====
                        this.dialog.open(MainDialogComponent, {
                          panelClass: `custom-dialog-container`,
                          data: {
                            header: `ไม่สามารถทำรายการได้`,
                            message: `อายุไม่ผ่านเกณฑ์ในการขอสินเชื่อ`,
                            button_name: `ปิด`
                          }
                        }).afterClosed().subscribe((result) => {
                          // === redirect to home page === 
                          this.router.navigate(['/quotation-view'])
                        })
                      } else { }

                    }
                  }
                });
              }, error: (e) => {

              }, complete: () => {

              }
            })
          }
        }
      }, error: (e) => {

      }, complete: () => {

      }
    })


  }

  getErrorMessagePhone() {
    if (this.cizForm.controls.generalinfoForm.controls.phoneNumber.hasError('required')) {
      return 'กรุณากรอกเบอร์โทรศัพท์';
    }

    return this.cizForm.controls.generalinfoForm.controls.phoneNumber.hasError('pattern') ? 'กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง' : '';
  }


  ngAfterViewInit(): void {
    this.cdRef.detectChanges();

  }

  ngOnInit(): void {


    if (this.quotationid) {
      // this.loadingService.showLoader()

      this.getUserSessionQuotation().subscribe({
        next: (res_session) => {
          // ==== success getUserSessionQuotation ====
          this.userSession = res_session

          this.quotationReq.subscribe({
            next: (res_quo) => {
              // === success quotationReq ===
              if (res_quo) {
                // *** set phone valid status ***

                // === ปลดล๊อค form เมื่อมี record อยู่แล้ว ===
                // this.loadingService.hideLoader() // === (comment on 06/02/2023 to manage stage (timing)) ===
                if (res_quo.data) {

                  // this.loadingService.hideLoader();

                  this.showdipchipbtn = false;
                  if (res_quo.data.length !== 0) {

                    const quodata = res_quo.data[0]

                    // *** กำหนดค่า quotationid ในหน้า ciz-card-tab ***
                    this.quotationid = quodata.quo_key_app_id

                    // *** ล๊อค field เบอร์โทรศัพท์ที่ได้ทำการ verify แล้ว (OTP_PHONE_VERIFY = 'Y') ***
                    if (quodata.otp_phone_verify == 'Y') {
                      this.cizForm.controls.generalinfoForm.controls.phoneNumber.disable()
                    }

                    // *** check and trigger field phone number on form field ***
                    if (quodata.phone_number == '') {
                      this.cizForm.controls.generalinfoForm.controls.phoneNumber.markAllAsTouched()
                    }

                    // *** set phone valid status text ***
                    if (quodata.quo_key_app_id !== '') {

                      if (quodata.ciz_phone_valid_status == 'Y') {
                        this.phonevalidstatus = `✅ : ได้รับการยืนยันเบอร์โทรศัพท์แล้ว`
                      } else {
                        this.phonevalidstatus = `❌ : ยังไม่ได้รับการยืนยันเบอร์โทรศัพท์`
                      }

                      if (quodata.quo_face_compare_verify !== '' && quodata.quo_face_compare_verify !== null) {
                        this.facevalidstatus = `✅ : ทำการตรวจสอบใบหน้าคนเรียบร้อย`
                      } else {
                        this.facevalidstatus = `❌ : รอทำการตรวจสอบใบหน้าคน`
                      }
                    }

                    // *** ล๊อคฟิวส์พวกข้อมูลบนบัตรประชาชนไม่ให้แก้ไขกรณี case มาจากการ dipchip (dipchip_uuid is not null || dipchip_uuid !== '')

                    // if(quodata.dipchip_uuid !== '' && quodata.dipchip_uuid !== null) {
                    //   this.cizForm.controls.maincitizenForm.disable()
                    // }

                  }
                } else {
                  // this.loadingService.hideLoader();

                  if (this.userSession.RADMIN == 'Y') {
                    this.showdipchipbtn = false;
                  } else {
                    this.showdipchipbtn = true;
                  }
                }
              }
            }, error: (e) => {
              console.log(`Error quotationReq (ciz-card-tab) : ${e.message ? e.message : 'No return message'}`)
            }, complete: () => {
              console.log('complete quotationReq (ciz-card-tab) !')
            }
          })
        }, error: (e) => {
          console.log(`Error getUserSessionQuotation (ciz-card-tab) : ${e.message ? e.message : 'No return message'}`)
        }, complete: () => {
          console.log(`Complete getUserSessionQuotation (ciz-card-tab)`)
        }
      })

      // forkJoin([
      //   this.getUserSessionQuotation(),
      //   this.quotationReq
      // ]).subscribe({
      //   next: ([resSession, resQuo]) => {
      //     if (resSession) {
      //       this.userSession = resSession
      //     }

      //     if (resQuo) {
      //       // *** set phone valid status ***

      //       // === ปลดล๊อค form เมื่อมี record อยู่แล้ว ===
      //       // this.loadingService.hideLoader() // === (comment on 06/02/2023 to manage stage (timing)) ===
      //       if (resQuo.data) {

      //         this.loadingService.hideLoader();

      //         this.showdipchipbtn = false;
      //         if (resQuo.data.length !== 0) {

      //           const quodata = resQuo.data[0]

      //           // *** กำหนดค่า quotationid ในหน้า ciz-card-tab ***
      //           this.quotationid = quodata.quo_key_app_id

      //           // *** ล๊อค field เบอร์โทรศัพท์ที่ได้ทำการ verify แล้ว (OTP_PHONE_VERIFY = 'Y') ***
      //           if (quodata.otp_phone_verify == 'Y') {
      //             this.cizForm.controls.generalinfoForm.controls.phoneNumber.disable()
      //           }

      //           // *** check and trigger field phone number on form field ***
      //           if (quodata.phone_number == '') {
      //             this.cizForm.controls.generalinfoForm.controls.phoneNumber.markAllAsTouched()
      //           }

      //           // *** set phone valid status text ***
      //           if (quodata.quo_key_app_id !== '') {

      //             if (quodata.ciz_phone_valid_status == 'Y') {
      //               this.phonevalidstatus = `✅ : ได้รับการยืนยันเบอร์โทรศัพท์แล้ว`
      //             } else {
      //               this.phonevalidstatus = `❌ : ยังไม่ได้รับการยืนยันเบอร์โทรศัพท์`
      //             }

      //             if (quodata.quo_face_compare_verify !== '' && quodata.quo_face_compare_verify !== null) {
      //               this.facevalidstatus = `✅ : ทำการตรวจสอบใบหน้าคนเรียบร้อย`
      //             } else {
      //               this.facevalidstatus = `❌ : รอทำการตรวจสอบใบหน้าคน`
      //             }
      //           }

      //           // *** ล๊อคฟิวส์พวกข้อมูลบนบัตรประชาชนไม่ให้แก้ไขกรณี case มาจากการ dipchip (dipchip_uuid is not null || dipchip_uuid !== '')

      //           // if(quodata.dipchip_uuid !== '' && quodata.dipchip_uuid !== null) {
      //           //   this.cizForm.controls.maincitizenForm.disable()
      //           // }

      //         }
      //       } else {
      //         this.loadingService.hideLoader();

      //         if (this.userSession.RADMIN == 'Y') {
      //           this.showdipchipbtn = false;
      //         } else {
      //           this.showdipchipbtn = true;
      //         }
      //       }
      //     }
      //   }
      //   , error: (e) => {
      //     this.loadingService.hideLoader()
      //     this.snackbarfail(`error : ${e.message ? e.message : 'No return message'}`)
      //     console.log(`Error on get observable quotation result : ${e.messgae ? e.message : `No return message`}`)
      //   }, complete: () => {
      //     this.loadingService.hideLoader()
      //     console.log(`complete forkjoin !`)
      //   }
      // })

    } else {
      // this.loadingService.hideLoader()

      if (this.userSession.RADMIN == 'Y') {
        this.showdipchipbtn = false;
      } else {
        this.showdipchipbtn = true;
      }

      // *** pop-updialog warning about rule (23/03/2023) ****
      this.dialog.open(WaringEconsentDialogComponent, {
      }).afterClosed().subscribe((res) => {
        // === handle when dialogClose event === 
      })

    }


    combineLatest([
      this.masterDataService.getTitle(),
      this.masterDataService.getMasterProvince(),
      this.masterDataService.getmariedstatus(),
      this.masterDataService.gethousetype(),
      this.masterDataService.gethouseownertype(),
      this.quotationReq
    ]).subscribe({
      next: (resultMaster) => {
        // === set master data ====
        // this.loadingService.hideLoader() //=== (comment on 06/02/2023 to manage stage (timing)) ===
        this.masterTitle = resultMaster[0]
        this.masterProvince = resultMaster[1]
        this.masterMariedStatus = resultMaster[2]
        this.masterHouseType = resultMaster[3]
        this.masterHouseOwnerType = resultMaster[4]
        this.quotationdatatemp = resultMaster[5]

        this.cizForm.disable();

        // === manage form diable , enable here ===

        // *** ล๊อคฟิวส์พวกข้อมูลบนบัตรประชาชนไม่ให้แก้ไขกรณี case มาจากการ dipchip (dipchip_uuid is not null || dipchip_uuid !== '')
        this.quotationReq.subscribe((res) => {
          if (res && res.data && Array.isArray(res.data)) {
            const quodata = res.data[0]
            if (quodata.quo_key_app_id !== null && quodata.quo_key_app_id !== '') {
              // === contain quo_key_app_id ===
              this.cizForm.enable()

              // if (quodata.dipchip_uuid !== '' && quodata.dipchip_uuid !== null) {
              //   this.cizForm.controls.maincitizenForm.disable()
              // }


              // === *** เงื่อนไขใหม่ ถ้าหากมีข้อมูล dipchip ไม่ว่าจะมี dopa หรือ ไม่มี ให้ lock field พวกข้อมูลบัตรประชาชน *** ===
              this.cizForm.controls.maincitizenForm.disable() // === set on 03/01/2023 ===

              // === new valid (if postal code of ciz_card null unlock field) 20/02/2023 ====
              !quodata.ciz_postal_code ? this.cizForm.controls.maincitizenForm.controls.postalCode.enable() : {};
            }

            if (quodata.ciz_phone_valid_status == 'Y') {
              this.cizForm.controls.generalinfoForm.controls.phoneNumber.disable()
            }
          }
        })

        if (this.quotationdatatemp.status == 200) {
          this.setquotationdata();
        }

      }, error: (e) => {
        this.loadingService.hideLoader()
        this.snackbarfail(`Error : ${e.message ? e.message : 'No return message'}`)
        console.log(`error during call master data from oracle DB : ${e.message ? e.message : `No return message`}`)
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
    this.cizForm.controls.generalinfoForm.controls.phoneNumber.setValue(quoitem.phone_number ?? '')
    // this.cizForm.controls.maincitizenForm.controls.email.setValue(quoitem.email ?? '')
    this.cizForm.controls.maincitizenForm.controls.address.setValue(quoitem.ciz_address ?? '')
    this.cizForm.controls.maincitizenForm.controls.subDistrict.setValue(quoitem.ciz_sub_district ?? '')
    this.cizForm.controls.maincitizenForm.controls.district.setValue(quoitem.ciz_district ?? '')
    this.cizForm.controls.maincitizenForm.controls.gender.setValue(quoitem.ciz_gender ?? null)
    this.cizForm.controls.maincitizenForm.controls.provinceCode.setValue(quoitem.ciz_province_code ?? '')
    this.cizForm.controls.maincitizenForm.controls.provinceName.setValue(this.mapProvinceNameById((quoitem.ciz_province_code ?? ''), this.masterProvince.data))
    // this.cizForm.controls.maincitizenForm.controls.provinceName.setValue(quoitem.ciz_province_name ?? '')
    this.cizForm.controls.maincitizenForm.controls.postalCode.setValue(quoitem.ciz_postal_code ?? '')
    // this.cizForm.controls.maincitizenForm.controls.provinceCode.setValue(quoitem.ciz_province_code ?? null)
    this.cizForm.controls.maincitizenForm.controls.titleCode.setValue(quoitem.title_code ?? '')
    this.cizForm.controls.maincitizenForm.controls.titleName.setValue(this.mapTitleNameById((quoitem.title_code ?? ''), this.masterTitle.data))
    this.cizForm.controls.maincitizenForm.controls.issuePlace.setValue(quoitem.ciz_issued_place ?? null)

    // === generalinfo ===
    this.cizForm.controls.generalinfoForm.controls.email.setValue(quoitem.email)
    this.cizForm.controls.generalinfoForm.controls.phoneNumber.setValue(quoitem.phone_number)



    this.cizForm.controls.generalinfoForm.controls.nickName.setValue(quoitem.ciz_nickname)
    this.cizForm.controls.generalinfoForm.controls.mariedStatus.setValue(quoitem.ciz_maried_status)
    this.cizForm.controls.generalinfoForm.controls.houseType.setValue(quoitem.ciz_house_type)
    this.cizForm.controls.generalinfoForm.controls.stayedMonth.setValue(quoitem.ciz_stayed_month)
    this.cizForm.controls.generalinfoForm.controls.stayedYear.setValue(quoitem.ciz_stayed_year)
    this.cizForm.controls.generalinfoForm.controls.houseOwnerType.setValue(quoitem.ciz_house_owner_type)

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
    this.cizForm.controls.livingAddress.controls.provinceName.setValue(this.mapProvinceNameById((quoitem.lvp_province_code ?? ''), this.masterProvince.data))
    this.cizForm.controls.livingAddress.controls.postalCode.setValue(quoitem.lvp_postal_code ?? '')
    this.cizForm.controls.livingAddress.controls.la.setValue(quoitem.lvp_latitude ?? '')
    this.cizForm.controls.livingAddress.controls.lon.setValue(quoitem.lvp_londtiude ?? '')
    this.cizForm.controls.livingAddress.controls.lalon.setValue(quoitem.lvp_lalon ?? '')

    // === set conatactAddressForm ===
    this.cizForm.controls.contactAddress.controls.address.setValue(quoitem.ctp_address ?? '')
    this.cizForm.controls.contactAddress.controls.subDistrict.setValue(quoitem.ctp_sub_district ?? '')
    this.cizForm.controls.contactAddress.controls.district.setValue(quoitem.ctp_district ?? '')
    this.cizForm.controls.contactAddress.controls.provinceCode.setValue(quoitem.ctp_province_code ?? '')
    this.cizForm.controls.contactAddress.controls.provinceName.setValue(this.mapProvinceNameById((quoitem.ctp_province_code ?? ''), this.masterProvince.data))
    this.cizForm.controls.contactAddress.controls.postalCode.setValue(quoitem.ctp_postal_code ?? '')

    // === set houseRegisAddressForm ===
    this.cizForm.controls.houseRegisAddress.controls.address.setValue(quoitem.hrp_address ?? '')
    this.cizForm.controls.houseRegisAddress.controls.subDistrict.setValue(quoitem.hrp_sub_district ?? '')
    this.cizForm.controls.houseRegisAddress.controls.district.setValue(quoitem.hrp_district ?? '')
    this.cizForm.controls.houseRegisAddress.controls.provinceCode.setValue(quoitem.hrp_province_code ?? '')
    this.cizForm.controls.houseRegisAddress.controls.provinceName.setValue(this.mapProvinceNameById((quoitem.hrp_province_code ?? ''), this.masterProvince.data))
    this.cizForm.controls.houseRegisAddress.controls.postalCode.setValue(quoitem.hrp_postal_code ?? '')

    // === set workAddressForm ===
    this.cizForm.controls.workAddress.controls.address.setValue(quoitem.wp_address ?? '')
    this.cizForm.controls.workAddress.controls.subDistrict.setValue(quoitem.wp_sub_district ?? '')
    this.cizForm.controls.workAddress.controls.district.setValue(quoitem.wp_district ?? '')
    this.cizForm.controls.workAddress.controls.provinceCode.setValue(quoitem.wp_province_code ?? '')
    this.cizForm.controls.workAddress.controls.provinceName.setValue(this.mapProvinceNameById((quoitem.wp_province_code ?? ''), this.masterProvince.data))
    this.cizForm.controls.workAddress.controls.postalCode.setValue(quoitem.wp_postal_code ?? '')


    this.cizForm.controls.maincitizenForm.controls.age.setValue(quoitem.ciz_age ?? null)
    this.cizForm.controls.phonevalid.setValue(quoitem.ciz_phone_valid_status == 'Y' ? true : false)
    this.cizForm.controls.facecompareValid.setValue(quoitem.quo_face_compare_verify ? true : false)
    // this.cizForm.controls.facevalid.setValue(quoitem.quo_face_compare_verify == 'Y' ? true : false)

    // === set image from dipchip to src (03/10/2022) === 

    if (quoitem.cizcard_image) {

      const loadimage = await this.getUrlImage_cizcard_image(quoitem.cizcard_image)

      this.cizCardImage = loadimage
    }

    this.cizForm.markAsPristine();

    this.cizForm.controls.generalinfoForm.controls.phoneNumber.markAllAsTouched()

    // === check lock form when quo_status = 1 (lock all field) 
    if (quoitem.quo_status == 1) {
      this.cizForm.disable()
      //
      this.lockallbtn = true
    }

  }


  onClickDipchipBtn() {

    if (!this.quotationid) {
      let countround = 0
      this.dipchipButtonDisabled = false;
      this.loadingService.showLoader()
      this.dipchipService.getdipchipinfo({
        token: '',
        username: this.usernamefordipchip,
        fromBody: ''
      }).subscribe({
        next: async (result) => {
          this.loadingService.hideLoader()
          if (result.number == 200) {

            const dipchipdata = result.data[0]

            this.cizCardImage = 'data:image/jpeg;base64,' + dipchipdata.PERSONAL_IMAGE
            this.cizCardImage_string = dipchipdata.PERSONAL_IMAGE

            this.cizForm.controls.maincitizenForm.controls.titleName.setValue(dipchipdata.PERSONAL_THAI_BEGIN_NAME)
            this.cizForm.controls.maincitizenForm.controls.titleCode.setValue(this.mapTitleIdByname(dipchipdata.PERSONAL_THAI_BEGIN_NAME, this.masterTitle.data))
            this.cizForm.controls.maincitizenForm.controls.firstName.setValue(dipchipdata.PERSONAL_THAI_NAME);
            this.cizForm.controls.maincitizenForm.controls.lastName.setValue(dipchipdata.PERSONAL_THAI_SURNAME);
            this.cizForm.controls.maincitizenForm.controls.citizenId.setValue(dipchipdata.PERSONAL_ID);
            this.cizForm.controls.maincitizenForm.controls.address.setValue(dipchipdata.HOUSE_NO + ' ' + dipchipdata.ALLEY + ' ' + dipchipdata.SOI + ' ' + dipchipdata.ROAD);
            this.cizForm.controls.maincitizenForm.controls.subDistrict.setValue(dipchipdata.SUB_DISTRICT);
            this.cizForm.controls.maincitizenForm.controls.district.setValue(dipchipdata.DISTRICT);
            this.cizForm.controls.maincitizenForm.controls.provinceName.setValue(dipchipdata.PROVINCE);
            this.cizForm.controls.maincitizenForm.controls.provinceCode.setValue(this.mapProvinceIdByName(dipchipdata.PROVINCE, this.masterProvince.data));
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

                // const agecalcualte = await lastValueFrom(this.masterDataService.getagefrombirthdate(formatbirthdatenew))
                const agecalcualte = await lastValueFrom(this.masterDataService.calculateage_db(formatbirthdatenew))
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
            this.isdipchip = false
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
            } else if (result.message == 'Not found!') {

              this.snackbarfail(`ไม่พบข้อมูล DIPCHIP : ${result.message}`)
              this.showdipchipbtn = false
              this.cizForm.enable()
            }
          } else {
            // === do not handle ====
            this.isdipchip = false
          }
        }, error: (e) => {
          // === error ===
          this.isdipchip = false
          this.loadingService.hideLoader()
          this.snackbarfail(`Error : ${e.message ? e.message : 'No return message'}`)
        }, complete: () => {
          this.loadingService.hideLoader()
        }
      })
    } else {
      console.log(`handle dup dipchip trigger (ciz-card-tab)`)
    }
  }

  onClickFacecompareBtn() {
    this.facevalid.emit();
  }

  sameCitizenAddress(type: string) {
    if (type == 'living') {

      this.cizForm.controls.livingAddress.controls.address.setValue(this.cizForm.controls.maincitizenForm.controls.address.value)
      this.cizForm.controls.livingAddress.controls.subDistrict.setValue(this.cizForm.controls.maincitizenForm.controls.subDistrict.value)
      this.cizForm.controls.livingAddress.controls.district.setValue(this.cizForm.controls.maincitizenForm.controls.district.value)
      this.cizForm.controls.livingAddress.controls.provinceCode.setValue(this.cizForm.controls.maincitizenForm.controls.provinceCode.value)
      this.cizForm.controls.livingAddress.controls.postalCode.setValue(this.cizForm.controls.maincitizenForm.controls.postalCode.value)

    } else if (type == 'contact') {
      this.cizForm.controls.contactAddress.controls.address.setValue(this.cizForm.controls.maincitizenForm.controls.address.value)
      this.cizForm.controls.contactAddress.controls.subDistrict.setValue(this.cizForm.controls.maincitizenForm.controls.subDistrict.value)
      this.cizForm.controls.contactAddress.controls.district.setValue(this.cizForm.controls.maincitizenForm.controls.district.value)
      this.cizForm.controls.contactAddress.controls.provinceCode.setValue(this.cizForm.controls.maincitizenForm.controls.provinceCode.value)
      this.cizForm.controls.contactAddress.controls.postalCode.setValue(this.cizForm.controls.maincitizenForm.controls.postalCode.value)
    } else if (type == 'work') {
      this.cizForm.controls.workAddress.controls.address.setValue(this.cizForm.controls.maincitizenForm.controls.address.value)
      this.cizForm.controls.workAddress.controls.subDistrict.setValue(this.cizForm.controls.maincitizenForm.controls.subDistrict.value)
      this.cizForm.controls.workAddress.controls.district.setValue(this.cizForm.controls.maincitizenForm.controls.district.value)
      this.cizForm.controls.workAddress.controls.provinceCode.setValue(this.cizForm.controls.maincitizenForm.controls.provinceCode.value)
      this.cizForm.controls.workAddress.controls.postalCode.setValue(this.cizForm.controls.maincitizenForm.controls.postalCode.value)
    } else if (type == 'houseregis') {
      this.cizForm.controls.houseRegisAddress.controls.address.setValue(this.cizForm.controls.maincitizenForm.controls.address.value)
      this.cizForm.controls.houseRegisAddress.controls.subDistrict.setValue(this.cizForm.controls.maincitizenForm.controls.subDistrict.value)
      this.cizForm.controls.houseRegisAddress.controls.district.setValue(this.cizForm.controls.maincitizenForm.controls.district.value)
      this.cizForm.controls.houseRegisAddress.controls.provinceCode.setValue(this.cizForm.controls.maincitizenForm.controls.provinceCode.value)
      this.cizForm.controls.houseRegisAddress.controls.postalCode.setValue(this.cizForm.controls.maincitizenForm.controls.postalCode.value)
    }
    this.cizForm.markAsDirty();
  }
  samelivinAddress(type: string) {
    if (type == 'contact') {
      this.cizForm.controls.contactAddress.controls.address.setValue(this.cizForm.controls.livingAddress.controls.address.value)
      this.cizForm.controls.contactAddress.controls.subDistrict.setValue(this.cizForm.controls.livingAddress.controls.subDistrict.value)
      this.cizForm.controls.contactAddress.controls.district.setValue(this.cizForm.controls.livingAddress.controls.district.value)
      this.cizForm.controls.contactAddress.controls.provinceCode.setValue(this.cizForm.controls.livingAddress.controls.provinceCode.value)
      this.cizForm.controls.contactAddress.controls.postalCode.setValue(this.cizForm.controls.livingAddress.controls.postalCode.value)
    } else if (type == 'work') {
      this.cizForm.controls.workAddress.controls.address.setValue(this.cizForm.controls.livingAddress.controls.address.value)
      this.cizForm.controls.workAddress.controls.subDistrict.setValue(this.cizForm.controls.livingAddress.controls.subDistrict.value)
      this.cizForm.controls.workAddress.controls.district.setValue(this.cizForm.controls.livingAddress.controls.district.value)
      this.cizForm.controls.workAddress.controls.provinceCode.setValue(this.cizForm.controls.livingAddress.controls.provinceCode.value)
      this.cizForm.controls.workAddress.controls.postalCode.setValue(this.cizForm.controls.livingAddress.controls.postalCode.value)
    } else if (type == 'houseregis') {
      this.cizForm.controls.houseRegisAddress.controls.address.setValue(this.cizForm.controls.livingAddress.controls.address.value)
      this.cizForm.controls.houseRegisAddress.controls.subDistrict.setValue(this.cizForm.controls.livingAddress.controls.subDistrict.value)
      this.cizForm.controls.houseRegisAddress.controls.district.setValue(this.cizForm.controls.livingAddress.controls.district.value)
      this.cizForm.controls.houseRegisAddress.controls.provinceCode.setValue(this.cizForm.controls.livingAddress.controls.provinceCode.value)
      this.cizForm.controls.houseRegisAddress.controls.postalCode.setValue(this.cizForm.controls.livingAddress.controls.postalCode.value)
    }
    this.cizForm.markAsDirty();
  }

  samecontactAddress(type: string) {
    if (type == 'work') {
      this.cizForm.controls.workAddress.controls.address.setValue(this.cizForm.controls.contactAddress.controls.address.value)
      this.cizForm.controls.workAddress.controls.subDistrict.setValue(this.cizForm.controls.contactAddress.controls.subDistrict.value)
      this.cizForm.controls.workAddress.controls.district.setValue(this.cizForm.controls.contactAddress.controls.district.value)
      this.cizForm.controls.workAddress.controls.provinceCode.setValue(this.cizForm.controls.contactAddress.controls.provinceCode.value)
      this.cizForm.controls.workAddress.controls.postalCode.setValue(this.cizForm.controls.contactAddress.controls.postalCode.value)
    }
    if (type == 'houseregis') {
      this.cizForm.controls.houseRegisAddress.controls.address.setValue(this.cizForm.controls.contactAddress.controls.address.value)
      this.cizForm.controls.houseRegisAddress.controls.subDistrict.setValue(this.cizForm.controls.contactAddress.controls.subDistrict.value)
      this.cizForm.controls.houseRegisAddress.controls.district.setValue(this.cizForm.controls.contactAddress.controls.district.value)
      this.cizForm.controls.houseRegisAddress.controls.provinceCode.setValue(this.cizForm.controls.contactAddress.controls.provinceCode.value)
      this.cizForm.controls.houseRegisAddress.controls.postalCode.setValue(this.cizForm.controls.contactAddress.controls.postalCode.value)
    }
    this.cizForm.markAsDirty();
  }

  opengooglemap() {
    const subdistrictValue = this.cizForm.controls.livingAddress.controls.subDistrict.value;
    const districtValue = this.cizForm.controls.livingAddress.controls.district.value;
    const postalCodeValue = this.cizForm.controls.livingAddress.controls.postalCode.value;

    let provinceValue = ''
    const provicneSelect = this.masterProvince.data.filter((items: ({ prov_code: string })) => {
      return items.prov_code = this.cizForm.controls.livingAddress.controls.provinceCode.value ? this.cizForm.controls.livingAddress.controls.provinceCode.value : ''
    })
    if (provicneSelect) {
      provinceValue = provicneSelect[0].prov_name
    }


    const url = `https://www.google.co.th/maps/search/${subdistrictValue}+${districtValue}+${provinceValue}+${postalCodeValue}`

    window.open(url, "_blank");
  }
}
