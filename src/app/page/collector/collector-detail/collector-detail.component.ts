import { Iphonenocustlist } from './../../../interface/iphonenocustlist';
import { IResGetaddressncblist, IResGetaddressncblistData } from 'src/app/interface/i-res-getaddressncblist'; // replace IResGetaddressncblist, IResGetaddressncblistData
import { IResGetmotocycleData } from 'src/app/interface/i-res-getmotocycle'; // replace IResGetmotocycle
import { UserService } from 'src/app/service/auth/user.service';
import { IResGetphonenolist, IResGetphonenolistData } from 'src/app/interface/i-res-getphonenolist'; // replace IResGetphonenolist, IResGetphonenolistData
import { IUserToken, IUserTokenData } from 'src/app/interface/i-user-token'; // replace IUserToken, IUserTokenData
import { IResGetnegotiationbyidData } from 'src/app/interface/i-res-getnegotiationbyid'; // replace IResGetnegotiationbyidData
import { MasterDataService } from 'src/app/service/master.service';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { IResGethistorypaymentlist, IResGethistorypaymentlistData } from 'src/app/interface/i-res-gethistorypaymentlist'; // replace IResGethistorypaymentlist, IResGethistorypaymentlistData
import { IResGetaddresscustlist, IResGetaddresscustlistData } from 'src/app/interface/i-res-getaddresscustlist'; // replace IResGetaddresscustlist, IResGetaddresscustlistData
import { MainDialogComponent } from 'src/app/widget/dialog/main-dialog/main-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { NegotiationService } from 'src/app/service/negotiation.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { BehaviorSubject, forkJoin, lastValueFrom, map, Subject } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { IResGetfollowuppaymentlist, IResGetfollowuppaymentlistData } from 'src/app/interface/i-res-getfollowuppaymentlist'; // replace IResGetfollowuppaymentlist, IResGetfollowuppaymentlistData
import { MatSnackBar } from '@angular/material/snack-bar';
import { IResMasterProvince, IResMasterProvinceData } from 'src/app/interface/i-res-master-province'; // replace IResMasterProvince, IResMasterProvinceData
import { IphonenolistcustData } from './../../../interface/iphonenocustlist'; // replace IphonenolistcustData
import { ImageUtilService } from 'src/app/service/image-util.service';
import { IResMasterNegoStatusData } from 'src/app/interface/i-res-master-nego-status';
import { BreakpointObserver } from '@angular/cdk/layout';
import { CreateLivingNegoDialogComponent } from 'src/app/widget/dialog/create-living-nego-dialog/create-living-nego-dialog.component';
import { BaseService } from 'src/app/service/base/base.service';
import { LoadingService } from 'src/app/service/loading.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-collector-detail',
  templateUrl: './collector-detail.component.html',
  styleUrls: ['./collector-detail.component.scss']
})
export class CollectorDetailComponent extends BaseService implements OnInit {

  step = 0;

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }

  // ** query param id (applicationid) = contract_no in mpls_quotation , (HP_NO) **

  // followupForm: UntypedFormGroup;
  applicationid: string = ''; // ไม่ใช่ application_num เป็นเลข hp_no
  customerid: string = '';
  citizenid: string = '';
  applicationdata: IResGetnegotiationbyidData = {} as IResGetnegotiationbyidData
  addressdataList: IResGetaddresscustlistData[] = []
  addressNcbdataList: IResGetaddressncblistData[] = []
  motocycleList: IResGetmotocycleData[] = []
  phonedataList: IResGetphonenolistData[] = []
  phonedatacustList: IphonenolistcustData[] = []
  historydataList: IResGethistorypaymentlistData[] = []
  out_stand_main: number | null = null;
  negodataList: IResGetfollowuppaymentlistData[] = []
  negoMasterList: IResMasterNegoStatusData[] = []
  // addressdataList: IResGetaddresscustlistData[] = {} as IResGetaddresscustlistData[]	
  // addressNcbdataList: IResGetaddressncblistData[] = {} as IResGetaddressncblistData[]	
  // motocycleList: IResGetmotocycle[] = {} as IResGetmotocycle[]	
  // phonedataList: IResGetphonenolistData[] = {} as IResGetphonenolistData[]	
  // phonedatacustList: IResGetphonenolistcustData[] = {} as IResGetphonenolistcustData[]	
  // historydataList: IResGethistorypaymentlistData[] = {} as IResGethistorypaymentlistData[]	
  // negodataList: IResGetfollowuppaymentlistData[] = {} as IResGetfollowuppaymentlistData[]	
  // negoMasterList: IResGetnegotiationbyidData[] = {} as IResGetnegotiationbyidData[]
  triggerlivingaddressinfo: boolean = false
  show_create_living_place_button: boolean = false // === add-on 24/02/2023
  triggerfollowup: boolean = false
  triggerlalon: boolean = false
  usersession: IUserTokenData = {} as IUserTokenData
  formattedDate: string = '';

  // === Address table params === 
  address_dataSource: any;
  address_pageEvent: PageEvent = new PageEvent;
  address_pageLength!: number;
  address_pageSize!: number;

  @ViewChild(MatSortModule) address_sort: MatSortModule = {} as MatSortModule;
  @ViewChild(MatPaginator) address_paginator: MatPaginator = {} as MatPaginator;


  // === Address (ncb) table params (31/08/2022) === 
  address_ncb_dataSource: any;
  address_ncb_pageEvent: PageEvent = new PageEvent;
  address_ncb_pageLength!: number;
  address_ncb_pageSize!: number;

  @ViewChild(MatSortModule) address_ncb_sort: MatSortModule = {} as MatSortModule; // === add on 31/08/2022 ===
  @ViewChild(MatPaginator) address_ncb_paginator: MatPaginator = {} as MatPaginator; // === add on 31/08/2022 ===

  // === phone table params === 
  phone_dataSource: any;
  phone_pageEvent: PageEvent = new PageEvent;
  phone_pageLength!: number;
  phone_pageSize!: number;

  @ViewChild(MatSortModule) phone_sort: MatSortModule = {} as MatSortModule;
  @ViewChild(MatPaginator) phone_paginator: MatPaginator = {} as MatPaginator;

  // === phone cust table params === 
  phonecust_dataSource: any;
  phonecust_pageEvent: PageEvent = new PageEvent;
  phonecust_pageLength!: number;
  phonecust_pageSize!: number;

  @ViewChild(MatSortModule) phonecust_sort: MatSortModule = {} as MatSortModule;
  @ViewChild(MatPaginator) phonecust_paginator: MatPaginator = {} as MatPaginator;

  // === history table params === 
  history_dataSource: any;
  history_pageEvent: PageEvent = new PageEvent;
  history_pageLength!: number;
  history_pageSize!: number;

  @ViewChild(MatSortModule) history_sort: MatSortModule = {} as MatSortModule;
  @ViewChild(MatPaginator) history_paginator: MatPaginator = {} as MatPaginator;

  // === nego table params === 
  nego_dataSource: any;
  nego_pageEvent: PageEvent = new PageEvent;
  nego_pageLength!: number;
  nego_pageSize!: number;

  @ViewChild(MatSortModule) nego_sort: MatSortModule = {} as MatSortModule;
  @ViewChild(MatPaginator) nego_paginator: MatPaginator = {} as MatPaginator;

  // ==== address info parameter (17/08/2022) ====

  provinceP = {} as IResMasterProvince;
  provincePData: Subject<IResMasterProvinceData[]> = new Subject();
  provinceMasterData = [] as IResMasterProvinceData[];


  latitude$ = new BehaviorSubject<string>('')
  londtiude$ = new BehaviorSubject<string>('')
  address$ = new BehaviorSubject<string>('')
  sub_district$ = new BehaviorSubject<string>('')
  district$ = new BehaviorSubject<string>('')
  postal_code$ = new BehaviorSubject<string>('')
  province_code$ = new BehaviorSubject<string>('')
  province_name$ = new BehaviorSubject<string>('')

  fname: string = '';
  lname: string = '';
  hpno: string = '';
  due: string = '';
  branch: string = '';
  bill: string = '';
  status: string = '';
  pageno: string = '';
  carcheckstatus: string = '';
  holder: string = ''
  apd: string = ''

  usernamelogin: string = '';

  image_qr$: Promise<string> | null = null;
  chkrefpaynum: boolean = false;

  cardLayout = this.breakpointObserver
    .observe('(min-width: 800px)')
    .pipe(
      map(({ matches }) => {
        if (matches) {
          return {
            columns: 12,
            list: { maxcols: 12, cols6: 6, cols4: 4, cols3: 3, cols2: 2, col: 1 },
            card_width: '80%',
            rowHeight: 90
          };
        }

        return {
          columns: 1,
          list: { maxcols: 1, cols6: 1, cols4: 1, cols3: 1, cols2: 1, col: 1 },
          card_width: '90%',
          rowHeight: 90
        };
      })
    );

  // negofollowup
  contactresultfield = new FormControl('', Validators.required)
  appointmentdatefield = new FormControl()
  message1field = new FormControl('', [Validators.required, Validators.maxLength(200)])
  message2field = new FormControl('', Validators.maxLength(200))

  // negolalon

  lalonField = new FormControl('')
  laField = new FormControl('', Validators.required)
  lonField = new FormControl('', Validators.required)

  // negofollowup form
  negofollowup = this.fb.group({
    contactresultfield: this.contactresultfield,
    appointmentdatefield: this.appointmentdatefield,
    message1field: this.message1field,
    message2field: this.message2field
  })

  // negolalon form
  negolalon = this.fb.group({
    lalonField: this.lalonField,
    laField: this.laField,
    lonField: this.lonField
  })

  // followupForm form (Build form)

  followupForm = this.fb.group({
    negofollowup: this.negofollowup,
    negolalon: this.negolalon
  })

  constructor(
    private fb: FormBuilder,
    private actRoute: ActivatedRoute,
    private negotiationService: NegotiationService,
    private router: Router,
    private masterDataService: MasterDataService,
    public override dialog: MatDialog,
    public override _snackBar: MatSnackBar,
    private userService: UserService,
    private route: ActivatedRoute,
    private loadingService: LoadingService,
    private imageUtilService: ImageUtilService,
    private breakpointObserver: BreakpointObserver,
    private datepipe: DatePipe
  ) {
    super(dialog, _snackBar)
    // === get query params ===
    this.route.queryParams.subscribe(params => {
      this.fname = params['fname'];
      this.lname = params['lname'];
      this.hpno = params['hpno'];
      this.due = params['due'];
      this.branch = params['branch'];
      this.bill = params['bill'];
      this.status = params['status'];
      this.pageno = params['pageno'];
      this.carcheckstatus = params['carcheckstatus'];
      this.holder = params['holder'];
      this.apd = params['apd'];
    });


  }


  ngOnInit(): void {

    const queryParams = this.actRoute.snapshot.queryParamMap;
    this.applicationid = queryParams.get('id') ?? '';
    // console.log(`this is application id : ${this.applicationid}`)

    const userdata = localStorage.getItem('currentUser')
    if (userdata) {
      const userdataObj = (JSON.parse(userdata) as IUserToken).data;
      const sessionUserObject = (JSON.parse(userdata)) as IUserToken
      this.usernamelogin = userdataObj.USERNAME

      this.usersession = userdataObj

      // === service for check role login permission (04/07/2022) ====
      this.userService.checkrolelogin()
    }

    if (this.applicationid) {
      this.loadingService.showLoader();
      // **** start forkjoin *****
      forkJoin([
        // *** master ****
        this.masterDataService.getMasterProvince(),
        // ข้อมูลสัญญา (main)
        this.negotiationService.getnegotiationbyid(this.applicationid),
        // ประวัติการชำระเงิน
        this.negotiationService.gethistorypaymentlist(1, this.applicationid).pipe(map(value => {
          // แปะ ค่ารอบงวด กรณี pay_code เป็น 02, 06
          value.data.forEach(obj => {
            obj._txt_type_field = (obj.pay_code == '02' || obj.pay_code == '06')
              ? `${obj.pay_name} (งวดที่ ${obj.round_payment})`
              : obj.pay_name;
          });
          return value;
        })),
        // ประวัติการติดตาม
        this.negotiationService.getfollowuppaymentlist(1, this.applicationid),
        // ข้อมูลรถจักรยานยนต์
        this.negotiationService.getmotocyclenego(this.applicationid),
        // ที่อยู่ของลูกค้า
        this.negotiationService.getaddresscustlist(1, this.applicationid),
        // แผนที่
        this.negotiationService.getaddressinfo(this.applicationid)
      ]).subscribe({
        next: ([
          res_province,
          res_nego,
          res_history_payment,
          res_history_follow,
          res_motocycle,
          res_customer_address,
          res_address_map
        ]) => {

          if (
            res_nego.status == 200 &&
            res_province.status == 200 &&
            res_history_payment.status == 200 &&
            res_history_follow.status == 200 &&
            res_motocycle.status == 200 &&
            res_customer_address.status == 200 &&
            res_address_map.status == 200
          ) {

            // ********* res_province *********************
            this.provinceP = res_province
            this.provinceMasterData = this.provinceP.data
            this.provincePData.next(this.provinceP.data);
            // ********************************************

            // ******** res_nego ************************
            this.applicationdata = res_nego.data[0]
            // === set citizenid (31/08/2022) ===
            this.citizenid = res_nego.data[0].idcard_num
            // === get phone no list fron customer id ====
            this.customerid = res_nego.data[0].cust_no
            // *******************************************

            // ******* res_history_payment **********
            if (res_history_payment.data.length !== 0) {

              this.out_stand_main = res_history_payment.data[0].out_stand_main

              this.historydataList = res_history_payment.data
              this.history_dataSource = new MatTableDataSource(this.historydataList)
              this.history_dataSource.paginator = this.history_paginator
              this.history_pageLength = res_history_payment.rowcount
              this.history_pageSize = res_history_payment.pagesize
              this.history_dataSource.sort = this.history_sort
            }
            // **************************************

            // ******** res_history_follow **********
            if (res_history_follow.data.length !== 0) {
              this.negodataList = res_history_follow.data
              this.nego_dataSource = new MatTableDataSource(this.negodataList)
              this.nego_dataSource.paginator = this.nego_paginator
              this.nego_pageLength = res_history_follow.rowcount
              this.nego_pageSize = res_history_follow.pagesize
              this.nego_dataSource.sort = this.nego_sort
            }
            // ***************************************


            // ************* res_motocycle **********
            this.motocycleList = res_motocycle.data
            // **************************************

            // ******** res_customer_address ********
            if (res_customer_address.data.length !== 0) {
              this.addressdataList = res_customer_address.data
              this.address_dataSource = new MatTableDataSource(this.addressdataList)
              this.address_dataSource.paginator = this.address_paginator
              this.address_pageLength = res_customer_address.rowcount
              this.address_pageSize = res_customer_address.pagesize
              this.address_dataSource.sort = this.address_sort
            }
            // **************************************

            // ********** res_address_map ***********
            if (res_address_map.data.length !== 0) {
              this.triggerlivingaddressinfo = true;
              this.latitude$.next(res_address_map.data[0].latitude)
              this.londtiude$.next(res_address_map.data[0].londtiude)
              this.address$.next(res_address_map.data[0].address)
              this.sub_district$.next(res_address_map.data[0].sub_district)
              this.district$.next(res_address_map.data[0].district)
              this.postal_code$.next(res_address_map.data[0].postal_code)
              this.province_code$.next(res_address_map.data[0].province_code)

              // set province name by province code
              const provicneSelect = this.provinceMasterData.filter((items: ({ prov_code: string })) => {
                return items.prov_code == this.province_code$.value ? this.province_code$.value : ''
              })
              if (provicneSelect.length !== 0) {
                this.province_name$.next(provicneSelect[0].prov_name)
              }
            } else {
              this.triggerlivingaddressinfo = false;
              console.log(res_address_map.message)

              this.show_create_living_place_button = true;
            }
            // **************************************


            // *** call chain forkJoin ***

            forkJoin([
              // เบอร์บุคคลที่เกี่ยวเบอร์ลูกค้าข้อง
              this.negotiationService.getphonenolist(1, res_nego.data[0].cust_no),
              // เบอร์ลูกค้า
              this.negotiationService.getphonenolistcust(1, res_nego.data[0].cust_no),
              // ที่อยู่จากการสืบค้น NCB
              this.negotiationService.getaddressncblist(1, this.citizenid),
              // QR Code ชำระค่างวด
              this.negotiationService.genqrcodenego(this.applicationdata.ref_pay_num, '02', this.applicationdata.hp_no)

            ]).subscribe({
              next: ([
                res_phone_ref,
                res_phone,
                res_ncb,
                res_qr
              ]) => {
                this.loadingService.hideLoader()
                if (
                  res_phone_ref.status == 200 &&
                  res_phone.status == 200 &&
                  res_ncb.status == 200 &&
                  res_qr.status == 200
                ) {
                  // === do next step ====

                  // ***** res_phone_ref ******
                  if (res_phone_ref.data.length !== 0) {
                    this.phonedataList = res_phone_ref.data
                    this.phone_dataSource = new MatTableDataSource(this.phonedataList)
                    this.phone_dataSource.paginator = this.phone_paginator
                    this.phone_pageLength = res_phone_ref.rowcount
                    this.phone_pageSize = res_phone_ref.pagesize
                    this.phone_dataSource.sort = this.history_sort
                  }
                  // **************************

                  // *******  res_phone  *******
                  if (res_phone.data.length !== 0) {
                    this.phonedatacustList = res_phone.data
                    this.phonecust_dataSource = new MatTableDataSource(this.phonedatacustList)
                    this.phonecust_dataSource.paginator = this.phonecust_paginator
                    this.phonecust_pageLength = res_phone.rowcount
                    this.phonecust_pageSize = res_phone.pagesize
                    this.phonecust_dataSource.sort = this.history_sort
                  }
                  // **************************

                  // ******** res_ncb *********
                  if (res_ncb.data.length !== 0) {
                    this.addressNcbdataList = res_ncb.data
                    this.address_ncb_dataSource = new MatTableDataSource(this.addressNcbdataList)
                    this.address_ncb_dataSource.paginator = this.address_ncb_paginator
                    this.address_ncb_pageLength = res_ncb.rowcount
                    this.address_ncb_pageSize = res_ncb.pagesize
                    this.address_ncb_dataSource.sort = this.address_ncb_sort
                  }
                  // **************************

                  // ********* res_qr *********
                  if (res_qr.data.length !== 0) {
                    this.chkrefpaynum = true
                    this.image_qr$ = new Promise((resolve) => {
                      resolve(this.imageUtilService.getUrlImage(res_qr.data[0].image_file[1].data))
                    })
                  } else {
                    this.chkrefpaynum = false
                  }
                  // **************************

                } else {
                  console.log(`call chain list data return fail`)
                }
              }, error: (e) => {
                this.loadingService.hideLoader();
                console.log(`Error : (chain list data) with code : ${e.message ? e.messsage : 'No return message'}`)
              }, complete: () => {
                this.loadingService.hideLoader();
                console.log(`trigger complete chain list data`)
              }
            })
          } else {
            this.loadingService.hideLoader();
            console.log(`call main and master data return fail`)
            // === redirect to collector main page ===
            this.dialog.open(MainDialogComponent, {
              panelClass: `custom-dialog-container`,
              data: {
                header: ``,
                message: `ไม่พบเลขสัญญา`,
                button_name: `ตกลง`
              }
            }).afterClosed().subscribe((results) => {
              this.router.navigate(['/collector-view'])
            })
          }
        }, error: (e) => {
          this.loadingService.hideLoader();
          console.log(`Error : (main and master) with code : ${e.message ? e.messsage : 'No return message'}`)
        }, complete: () => {
          this.loadingService.hideLoader();
          console.log(`trigger complete main and master data`)
        }
      })
      // *************************
    } else {
      this.dialog.open(MainDialogComponent, {
        panelClass: `custom-dialog-container`,
        data: {
          header: ``,
          message: `ไม่พบเลขสัญญา`,
          button_name: `ตกลง`
        }
      }).afterClosed().subscribe((results) => {
        this.router.navigate(['/collector-view'])
      })
    }
  }

  showfollowupmat() {
    this.triggerfollowup = true;
    this.masterDataService.getnegomasterstatus().subscribe({
      next: (results) => {

        this.negoMasterList = results.data
      }, error: (e) => {

      }
    })
  }

  canclecreatefollowup() {
    this.followupForm.reset()
    this.triggerfollowup = false;
  }

  sumbitnegocreaterecord() {
    // let items: Record<string,any> = {}
    const appointmentDate = this.followupForm.controls.negofollowup.controls.appointmentdatefield.value
    const formattedDate = this.datepipe.transform(appointmentDate, 'dd/MM/yyyy');
    let items: any = {}

    items.phone_no = '0'
    items.hp_no = this.applicationid
    items.cust_id = this.applicationdata.cust_no
    items.staff_id = this.usersession.USERID
    items.user_name = this.usersession.USERNAME
    // === nego record === 
    // items.test =
    // items.appoint_date = this.followupForm.get('negofollowup.appointmentdatefield')?.value
    // items.message1 = this.followupForm.get('negofollowup.message1field')?.value
    // items.message2 = this.followupForm.get('negofollowup.message2field')?.value
    // items.appoint_date = this.followupForm.controls.negofollowup.controls.appointmentdatefield.value
    items.appoint_date = formattedDate
    items.message1 = this.followupForm.controls.negofollowup.controls.message1field.value
    items.message2 = this.followupForm.controls.negofollowup.controls.message2field.value
    //=== call_track_info ==== 
    // items.con_r_code = this.followupForm.get('contactresultfield')?.value
    // items.neg_r_code = this.followupForm.get('negofollowup.contactresultfield')?.value
    items.neg_r_code = this.followupForm.controls.negofollowup.controls.contactresultfield.value


    this.negotiationService.insertnegolist(items).subscribe({
      next: (results) => {
        if (results.status == 200) {
          console.log(`this is results : ${results}`)
          this.triggerfollowup = false;
          this._snackBar.open(`สร้างรายการประวัติการติดตามสำเร็จ`,
            '',
            {
              duration: 2000,
              panelClass: 'success-mat-snackbar'
            }
          )
          this.negotiationService.getfollowuppaymentlist(1, this.applicationid).subscribe({
            next: (resultnego) => {

              console.log(`this is reuslt negotiation : ${JSON.stringify(resultnego)}`)
              this.negodataList = resultnego.data
              this.nego_dataSource = new MatTableDataSource(this.negodataList)
              this.nego_dataSource.paginator = this.nego_paginator
              this.nego_pageLength = resultnego.rowcount
              this.nego_pageSize = resultnego.pagesize
              this.nego_dataSource.sort = this.nego_sort

            }, error: (e) => {
              // === handle error ===
            }, complete: () => {
              // === nex step ===
            }
          })
        } else {
          this._snackBar.open(`เกิดข้อผิดพลาด ไม่สา่มารถสร้างใบคำขอได้ \n ${results.message}`,
            '',
            {
              duration: 2000,
              panelClass: 'fail-mat-snackbar'
            }
          )
        }
      }, error: (e) => {
        this._snackBar.open(`เกิดข้อผิดพลาด ไม่สา่มารถสร้างใบคำขอได้ \n ${e.message}`,
          '',
          {
            duration: 2000,
            panelClass: 'fail-mat-snackbar'
          }
        )
      }
    })

  }

  onPaginationChange_address(event: PageEvent) {
    let page = event.pageIndex;
    let size = event.pageSize;

    page = page + 1;
    this.negotiationService.getaddresscustlist(page, this.applicationid).pipe(
      map((result: IResGetaddresscustlist) => {
        this.address_dataSource = new MatTableDataSource(result.data);
        this.addressdataList = result.data;
      })
    ).subscribe();
  }

  onPaginationChange_ncb_address(event: PageEvent) {
    let page = event.pageIndex;
    let size = event.pageSize;

    page = page + 1;
    this.negotiationService.getaddressncblist(page, this.citizenid).pipe(
      map((result: IResGetaddressncblist) => {
        this.address_ncb_dataSource = new MatTableDataSource(result.data);
        this.addressNcbdataList = result.data;
      })
    ).subscribe();
  }

  onPaginationChange_phone(event: PageEvent) {
    let page = event.pageIndex;
    let size = event.pageSize;

    page = page + 1;
    this.negotiationService.getphonenolist(page, this.customerid).pipe(
      map((result: IResGetphonenolist) => {
        this.phone_dataSource = new MatTableDataSource(result.data);
        this.phonedataList = result.data;
      })
    ).subscribe();
  }

  onPaginationChange_phonecust(event: PageEvent) {
    let page = event.pageIndex;
    let size = event.pageSize;

    page = page + 1;
    this.negotiationService.getphonenolistcust(page, this.customerid).pipe(
      map((result: Iphonenocustlist) => {
        this.phonecust_dataSource = new MatTableDataSource(result.data);
        this.phonedatacustList = result.data;
      })
    ).subscribe();
  }

  onPaginationChange_history(event: PageEvent) {
    let page = event.pageIndex;
    let size = event.pageSize;

    page = page + 1;
    this.negotiationService.gethistorypaymentlist(page, this.applicationid).pipe(
      map((result: IResGethistorypaymentlist) => {
        this.address_dataSource = new MatTableDataSource(result.data);
        this.historydataList = result.data;
        // แปะ ค่ารอบงวด กรณี pay_code เป็น 02, 06
        result.data.forEach(obj => {
          obj._txt_type_field = (obj.pay_code == '02' || obj.pay_code == '06')
            ? `${obj.pay_name} (งวดที่ ${obj.round_payment})`
            : obj.pay_name;
        });
        return result;
      })
    ).subscribe();
  }

  onPaginationChange_nego(event: PageEvent) {
    let page = event.pageIndex;
    let size = event.pageSize;

    page = page + 1;
    this.negotiationService.getfollowuppaymentlist(page, this.applicationid).pipe(
      map((result: IResGetfollowuppaymentlist) => {
        this.nego_dataSource = new MatTableDataSource(result.data);
        this.negodataList = result.data;
      })
    ).subscribe();
  }


  opengooglemap() {
    const addressValue = this.address$.value
    const subdistrictValue = this.sub_district$.value
    const districtValue = this.district$.value
    const postalCodeValue = this.postal_code$.value
    const provinceName = this.province_name$.value
    // let provinceValue = ''
    // const provicneSelect = this.provinceMasterData.filter((items: ({ prov_code: string })) => {
    //   return items.prov_code == this.province_code ? this.province_code : ''
    // })
    // if(provicneSelect) {
    //    provinceValue = provicneSelect[0].prov_name
    // }


    const url = `https://www.google.co.th/maps/search/${addressValue}+${subdistrictValue}+${districtValue}+${provinceName}+${postalCodeValue}`

    window.open(url, "_blank");
  }

  savenegolalon() {
    this.triggerlalon = true;
  }

  createlivingplace() {
    const applicationid = this.applicationid

    this.dialog.open(CreateLivingNegoDialogComponent, {
      panelClass: `custom-dialog-container`,
      width: '80%',
      height: '50%',
      data: {
        applicationid: applicationid
      }
    }).afterClosed().subscribe((value) => {
      // === handle next step ===
      if (value) {
        if (value.create_status) {
          this.snackbarsuccess(`เพิ่มรายการที่อยู่สำเร็จ`)
          // ==== create success (reload or re call api getaddressinfo) ===
          this.negotiationService.getaddressinfo(this.applicationid).subscribe({
            next: (res_get_address_info) => {
              this.triggerlivingaddressinfo = true;
              this.show_create_living_place_button = false
              if (res_get_address_info.status == 200) {
                this.latitude$.next(res_get_address_info.data[0].latitude)
                this.londtiude$.next(res_get_address_info.data[0].londtiude)
                this.address$.next(res_get_address_info.data[0].address)
                this.sub_district$.next(res_get_address_info.data[0].sub_district)
                this.district$.next(res_get_address_info.data[0].district)
                this.postal_code$.next(res_get_address_info.data[0].postal_code)
                this.province_code$.next(res_get_address_info.data[0].province_code)

                // set province name by province code
                const provicneSelect = this.provinceMasterData.filter((items: ({ prov_code: string })) => {
                  return items.prov_code == this.province_code$.value ? this.province_code$.value : ''
                })
                if (provicneSelect.length !== 0) {
                  this.province_name$.next(provicneSelect[0].prov_name)
                  // console.log(`this is province name : ${this.province_name$.value}`)
                }
              } else {
                console.log(res_get_address_info.message)
              }
            }, error: (e) => {
              console.log(`Error : ${e.message ? e.message : 'No return message'}`)
            }, complete: () => {
              console.log(`trigger create living page dialog close success !!`)
            }
          })
        }
      }
    })
  }

  sumbitnegolalon() {
    const la = this.followupForm.controls.negolalon.controls.laField.value
    const lon = this.followupForm.controls.negolalon.controls.lonField.value

    this.negotiationService.updatenegolalon({
      applicationid: this.applicationid,
      latitude: la ?? '',
      longitude: lon ?? ''
    }).subscribe({
      next: (resultupdatenegolalon) => {

        if (resultupdatenegolalon.status == 200) {
          // === refresh data la lon (living address) === 
          this.negotiationService.getaddressinfo(this.applicationid).subscribe({
            next: (resultaddressinfo) => {
              // code here

              if (resultaddressinfo.status == 200) {
                this.latitude$.next(resultaddressinfo.data[0].latitude)
                this.londtiude$.next(resultaddressinfo.data[0].londtiude)
                this.address$.next(resultaddressinfo.data[0].address)
                this.sub_district$.next(resultaddressinfo.data[0].sub_district)
                this.district$.next(resultaddressinfo.data[0].district)
                this.postal_code$.next(resultaddressinfo.data[0].postal_code)
                this.province_code$.next(resultaddressinfo.data[0].province_code)

                // set province name by province code
                const provicneSelect = this.provinceMasterData.filter((items: ({ prov_code: string })) => {
                  return items.prov_code == this.province_code$.value ? this.province_code$.value : ''
                })
                if (provicneSelect.length !== 0) {
                  this.province_name$.next(provicneSelect[0].prov_name)
                  // console.log(`this is province name : ${this.province_name$.value}`)
                }
              } else {
                console.log(resultaddressinfo.message)
              }
            }, error: (e) => {
              // === handle error ===
            }, complete: () => {
              // === nex step ===
            }
          })
        }

      }, error: (e) => {
        // === handle error ===
      }, complete: () => {
        // === do next stage ===
      }
    })

  }

  concatLaLon($event: any) {
    const lalonStr = $event.target.value;
    // const newString = '16.441073,100.351270'
    let rpString = lalonStr.replace(/[\(\)|\s]/g, "");
    let spitStr = rpString.split(",");
    if (spitStr.length > 1) {
      this.followupForm.controls.negolalon.controls.laField.setValue(spitStr[0])
      this.followupForm.controls.negolalon.controls.lonField.setValue(spitStr[1])
    }

  }

  onKeyDown(event: KeyboardEvent) {
    // Check if the key pressed is not the space bar
    if (event.keyCode !== 32) {
      event.preventDefault(); // Disable default behavior
    }
  }
  
  getMaxDate() {
    const date = new Date();
    date.setFullYear(date.getFullYear() + 10);
    return date;
  }


}
