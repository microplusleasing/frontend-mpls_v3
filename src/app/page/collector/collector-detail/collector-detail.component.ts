import { Iphonenocustlist } from './../../../interface/iphonenocustlist';
import { IResGetaddressncblist, IResGetaddressncblistData } from 'src/app/interface/i-res-getaddressncblist'; // replace IResGetaddressncblist, IResGetaddressncblistData
import { IResGetmotocycleData } from 'src/app/interface/i-res-getmotocycle'; // replace IResGetmotocycle
import { UserService } from 'src/app/service/auth/user.service';
import { IResGetphonenolist, IResGetphonenolistData } from 'src/app/interface/i-res-getphonenolist'; // replace IResGetphonenolist, IResGetphonenolistData
import { IUserToken, IUserTokenData } from 'src/app/interface/i-user-token'; // replace IUserToken, IUserTokenData
import { IResGetnegotiationbyidData } from 'src/app/interface/i-res-getnegotiationbyid'; // replace IResGetnegotiationbyidData
import { MasterDataService } from 'src/app/service/master.service';
import { UntypedFormControl, UntypedFormGroup, Validators, UntypedFormBuilder } from '@angular/forms';
import { IResGethistorypaymentlist, IResGethistorypaymentlistData } from 'src/app/interface/i-res-gethistorypaymentlist'; // replace IResGethistorypaymentlist, IResGethistorypaymentlistData
import { IResGetaddresscustlist, IResGetaddresscustlistData } from 'src/app/interface/i-res-getaddresscustlist'; // replace IResGetaddresscustlist, IResGetaddresscustlistData
import { MainDialogComponent } from 'src/app/widget/dialog/main-dialog/main-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { NegotiationService } from 'src/app/service/negotiation.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { BehaviorSubject, lastValueFrom, map, Subject } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { IResGetfollowuppaymentlist, IResGetfollowuppaymentlistData } from 'src/app/interface/i-res-getfollowuppaymentlist'; // replace IResGetfollowuppaymentlist, IResGetfollowuppaymentlistData
import { MatSnackBar } from '@angular/material/snack-bar';
import { IResMasterProvince, IResMasterProvinceData } from 'src/app/interface/i-res-master-province'; // replace IResMasterProvince, IResMasterProvinceData
import { IphonenolistcustData } from './../../../interface/iphonenocustlist'; // replace IphonenolistcustData
import { ImageUtilService } from 'src/app/service/image-util.service';
import { IResMasterNegoStatusData } from 'src/app/interface/i-res-master-nego-status';
import { BreakpointObserver } from '@angular/cdk/layout';

@Component({
  selector: 'app-collector-detail',
  templateUrl: './collector-detail.component.html',
  styleUrls: ['./collector-detail.component.scss']
})
export class CollectorDetailComponent implements OnInit {

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

  followupForm: UntypedFormGroup;
  applicationid: string = '';
  customerid: string = '';
  citizenid: string = '';
  applicationdata: IResGetnegotiationbyidData = {} as IResGetnegotiationbyidData
  addressdataList: IResGetaddresscustlistData[] = []
  addressNcbdataList: IResGetaddressncblistData[] = []
  motocycleList: IResGetmotocycleData[] = []
  phonedataList: IResGetphonenolistData[] = []
  phonedatacustList: IphonenolistcustData[] = []
  historydataList: IResGethistorypaymentlistData[] = []
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
  triggerfollowup: boolean = false
  triggerlalon: boolean = false
  usersession: IUserTokenData = {} as IUserTokenData

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
          card_width: '80%'
        };
      }

      return {
        columns: 1,
        list: { maxcols: 1, cols6: 1, cols4: 1, cols3: 1, cols2: 1, col: 1 },
        card_width: '90%'
      };
    })
  );

  constructor(
    private fb: UntypedFormBuilder,
    private actRoute: ActivatedRoute,
    private negotiationService: NegotiationService,
    private dialog: MatDialog,
    private router: Router,
    private masterDataService: MasterDataService,
    private _snackBar: MatSnackBar,
    private userService: UserService,
    private route: ActivatedRoute,
    private imageUtilService: ImageUtilService,
    private breakpointObserver: BreakpointObserver,
  ) {
    this.followupForm = this.fb.group({
      negofollowup: this.fb.group({
        contactresultfield: new UntypedFormControl('', Validators.required),
        appointmentdatefield: new UntypedFormControl(),
        message1field: new UntypedFormControl('', Validators.required),
        message2field: new UntypedFormControl()
      }),
      negolalon: this.fb.group({
        lalonField: new UntypedFormControl(''),
        laField: new UntypedFormControl('', Validators.required),
        lonField: new UntypedFormControl('', Validators.required)
      })
    })

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
      this.negotiationService.getnegotiationbyid(this.applicationid).subscribe({
        next: (results) => {
          // console.log(`this is info results : ${JSON.stringify(results)}`)
          this.applicationdata = results.data[0]

          // === set citizenid (31/08/2022) ===
          this.citizenid = results.data[0].idcard_num

          // === get phone no list fron customer id ====
          this.customerid = results.data[0].cust_no

          // เบอร์บุคคลที่เกี่ยวข้อง
          this.negotiationService.getphonenolist(1, results.data[0].cust_no).subscribe({
            next: (resultsphone) => {

              if (resultsphone.status == 200) {
                this.phonedataList = resultsphone.data
                this.phone_dataSource = new MatTableDataSource(this.phonedataList)
                this.phone_dataSource.paginator = this.history_paginator
                this.phone_pageLength = resultsphone.rowcount
                this.phone_pageSize = resultsphone.pagesize
                this.phone_dataSource.sort = this.history_sort

              } else {
                console.log(results.message)
              }
            }, error: (e) => {
              console.error(e)
            }, complete: () => {

            }
          })

          // เบอร์ลูกค้า
          this.negotiationService.getphonenolistcust(1, results.data[0].cust_no).subscribe({
            next: (resultsphonecust) => {
              if (resultsphonecust.status == 200) {
                this.phonedatacustList = resultsphonecust.data
                this.phonecust_dataSource = new MatTableDataSource(this.phonedatacustList)
                this.phonecust_dataSource.paginator = this.history_paginator
                this.phonecust_pageLength = resultsphonecust.rowcount
                this.phonecust_pageSize = resultsphonecust.pagesize
                this.phonecust_dataSource.sort = this.history_sort
              } else {
                console.log(results.message)
              }
            }, error: (e) => {
              console.error(e)
            }, complete: () => {

            }
          })
        }, error: (e) => {
          // === handle error not found here (ext. 404) ===
          // === redirect to collector main page ===
          this.dialog.open(MainDialogComponent, {
            panelClass: `custom-dialog-container`,
            data: {
              header: ``,
              message: `ไม่พบเลขสัญญา`,
              button_name: `ตกลง`
            }
          }).afterClosed().subscribe((results) => {
            this.router.navigate(['collector'])
          })
        }, complete: async () => {
          this.negotiationService.gethistorypaymentlist(1, this.applicationid).subscribe({
            next: (resultHistory) => {

              if (resultHistory.status == 200) {
                this.historydataList = resultHistory.data
                this.history_dataSource = new MatTableDataSource(this.historydataList)
                this.history_dataSource.paginator = this.history_paginator
                this.history_pageLength = resultHistory.rowcount
                this.history_pageSize = resultHistory.pagesize
                this.history_dataSource.sort = this.history_sort
              } else {
                console.log(resultHistory.message)
              }
            }, error: (e) => {
              // === handle error ===
            }, complete: () => {
              // === nex step ===
            }
          })
          this.negotiationService.getaddresscustlist(1, this.applicationid).subscribe({
            next: (resultAddress) => {

              if (resultAddress.status == 200) {
                this.addressdataList = resultAddress.data
                this.address_dataSource = new MatTableDataSource(this.addressdataList)
                this.address_dataSource.paginator = this.address_paginator
                this.address_pageLength = resultAddress.rowcount
                this.address_pageSize = resultAddress.pagesize
                this.address_dataSource.sort = this.address_sort
              } else {
                console.log(resultAddress.message)
              }
            }, error: (e) => {
              // === handle error ===
            }, complete: () => {
              // === nex step ===
            }
          })

          // === ที่อยู่จากการสืบค้น NCB (31/08/2022) ===
          if (this.citizenid) {
            this.negotiationService.getaddressncblist(1, this.citizenid).subscribe({
              next: (resultncbAddress) => {
                if (resultncbAddress.status == 200) {
                  this.addressNcbdataList = resultncbAddress.data
                  this.address_ncb_dataSource = new MatTableDataSource(this.addressNcbdataList)
                  this.address_ncb_dataSource.paginator = this.address_ncb_paginator
                  this.address_ncb_pageLength = resultncbAddress.rowcount
                  this.address_ncb_pageSize = resultncbAddress.pagesize
                  this.address_ncb_dataSource.sort = this.address_ncb_sort
                } else {
                  console.log(resultncbAddress.message)
                }
              }, error: (e) => {
                // === handle error ===
              }, complete: () => {
                // === nex step ===
              }
            })
          }

          this.negotiationService.getfollowuppaymentlist(1, this.applicationid).subscribe({
            next: (resultnego) => {


              if (resultnego.status == 200) {
                this.negodataList = resultnego.data
                this.nego_dataSource = new MatTableDataSource(this.negodataList)
                this.nego_dataSource.paginator = this.nego_paginator
                this.nego_pageLength = resultnego.rowcount
                this.nego_pageSize = resultnego.pagesize
                this.nego_dataSource.sort = this.nego_sort
              } else {
                console.log(resultnego.message)
              }

            }, error: (e) => {
              // === handle error ===
            }, complete: () => {
              // === nex step ===
            }
          })

          // === get motocycle detail (17/07/2022) ==== 
          this.negotiationService.getmotocycle(this.applicationid).subscribe({
            next: (resultmoto) => {

              if (resultmoto.status == 200) {
                this.motocycleList = resultmoto.data
                this.nego_dataSource = new MatTableDataSource(this.motocycleList)
                // this.nego_dataSource.paginator = this.nego_paginator
                // this.nego_pageLength = resultmoto.rowcount
                // this.nego_pageSize = resultmoto.pagesize
                this.nego_dataSource.sort = this.nego_sort
              } else {
                console.log(resultmoto.message)
              }

            }, error: (e) => {
              // === handle error ===
            }, complete: () => {
              // === nex step ===
            }
          })

          // === get address information detail (17/08/2022) ==== 

          this.provinceP = await lastValueFrom(this.masterDataService.getProvice())
          this.provinceMasterData = this.provinceP.data
          this.provincePData.next(this.provinceP.data);

          this.negotiationService.getaddressinfo(this.applicationid).subscribe({
            next: (resultaddressinfo) => {
              // code here

              if (resultaddressinfo.status == 200) {

                this.triggerlivingaddressinfo = true;
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
                this.triggerlivingaddressinfo = false;
                console.log(resultaddressinfo.message)
              }
            }, error: (e) => {
              // === handle error ===
              this.triggerlivingaddressinfo = false;
            }, complete: () => {
              // === nex step ===
            }
          })


          // === gen qr payment with type '02' (19/10/2022) ===
          this.negotiationService.genqrcodenego(
            this.applicationdata.ref_pay_num,
            '02',
            this.applicationdata.hp_no
          ).subscribe({
            next: (resultqr) => {
              if (resultqr.status == 200) {
                this.chkrefpaynum = true
                this.image_qr$ = new Promise((resolve) => {
                  resolve(this.imageUtilService.getUrlImage(resultqr.data[0].image_file[1].data))
                })
              } else {
                this.chkrefpaynum = false
              }
            }
            , error: (e) => {
              // === handle error ===
            }, complete: () => {
              //=== next step ===
            }
          })

          // ====================================================
        }
      })
    } else {
      this.dialog.open(MainDialogComponent, {
        panelClass: `custom-dialog-container`,
        data: {
          header: ``,
          message: `ไม่พบเลขสัญญา`,
          button_name: `ตกลง`
        }
      }).afterClosed().subscribe((results) => {
        this.router.navigate(['collector'])
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
    let items: any = {}

    items.phone_no = '0'
    items.hp_no = this.applicationid
    items.cust_id = this.applicationdata.cust_no
    items.staff_id = this.usersession.USERID
    items.user_name = this.usersession.USERNAME
    // === nego record === 
    items.test =
      items.appoint_date = this.followupForm.get('negofollowup.appointmentdatefield')?.value
    items.message1 = this.followupForm.get('negofollowup.message1field')?.value
    items.message2 = this.followupForm.get('negofollowup.message2field')?.value
    //=== call_track_info ==== 
    // items.con_r_code = this.followupForm.get('contactresultfield')?.value
    items.neg_r_code = this.followupForm.get('negofollowup.contactresultfield')?.value


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

  sumbitnegolalon() {
    const la = this.followupForm.get('negolalon.laField')?.value
    const lon = this.followupForm.get('negolalon.lonField')?.value

    this.negotiationService.updatenegolalon({
      applicationid: this.applicationid,
      latitude: la,
      longitude: lon
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
      this.followupForm.get('negolalon.laField')?.setValue(spitStr[0])
      this.followupForm.get('negolalon.lonField')?.setValue(spitStr[1])
    }

  }


}
