import { IResQuotationView, IResQuotationViewData } from './../../interface/i-res-quotation-view';
import { IUserToken } from './../../interface/i-user-token';
import { ISearchQuotation } from './../../interface/i-search-quotation';
import { FormBuilder, FormGroup, FormControl, ValidationErrors, ValidatorFn, Validators, AbstractControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/service/auth/auth.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { map, lastValueFrom, BehaviorSubject } from 'rxjs';
import { QuotationService } from 'src/app/service/quotation.service';
import { LoadingService } from 'src/app/service/loading.service';
import { MasterDataService } from 'src/app/service/master.service';
import { UserService } from 'src/app/service/auth/user.service';
import { IResMasterQuoatationStatusData } from 'src/app/interface/i-res-master-quoatation-status';
import { MainDialogComponent } from 'src/app/widget/dialog/main-dialog/main-dialog.component';
import { BreakpointObserver } from '@angular/cdk/layout';
import { BaseService } from 'src/app/service/base/base.service';
import { MatSnackBar } from '@angular/material/snack-bar';

export const atLeastOne = (validator: ValidatorFn, controls: string[] = []) => (
  group: FormGroup,
): ValidationErrors | null => {
  if (!controls.length) {
    controls = Object.keys(group.controls);
  }

  const hasAtLeastOne = controls.some(k => !validator(group.controls[k]));

  return hasAtLeastOne ? null : {
    atLeastOne: true,
  };
};

// export const atLeastOne = (validator: ValidatorFn, controls: string[] = []) => (
//   group: AbstractControl | null,
// ): ValidationErrors | null => {
//   if (!group) {
//     return null;
//   }
//   const hasAtLeastOne = controls.some(k => !validator(group));
//   return hasAtLeastOne ? null : {
//     atLeastOne: true,
//   };
// };



interface Status {
  value: string;
  status: string;
}

@Component({
    selector: 'app-quotation-view',
    templateUrl: './quotation-view.component.html',
    styleUrls: ['./quotation-view.component.scss'],
    standalone: false
})
export class QuotationViewComponent extends BaseService implements OnInit {
  dataListTemp: IResQuotationView = {} as IResQuotationView;
  pageEvent: PageEvent = new PageEvent;
  pageLength: number = 0;
  pageSize: number = 0;
  dataList: any;
  dataSource = new MatTableDataSource;
  displayedColumns: string[] = [
    'sequence',
    'dateCreate',
    'quotationNo',
    'customerName',
    'dealerName',
    'branchName',
    'buttonName',
    'canclebtn',
    'statusName',
    'consentStatus'
  ]

  quotationInterface: IResQuotationView = {} as IResQuotationView;
  quotationStatus: IResMasterQuoatationStatusData[] = [] as IResMasterQuoatationStatusData[]
  quotationStatusSelect: string = '';
  isAdmin$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  showbypass$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  @ViewChild(MatSortModule) sort: MatSortModule = {} as MatSortModule;
  @ViewChild(MatPaginator) paginator: MatPaginator = {} as MatPaginator;
  FormBuilder: any;

  showrefpaynumbtn: boolean = false;

  payStatus: Status[] = [
    { value: 'ALL', status: 'ทั้งหมด' },
    { value: '1', status: 'ยืนยันรับชำระเงินแล้ว' },
    { value: '2', status: 'ยังไม่ได้ยืนยันรับชำระเงิน' },
  ];

  customername: string = '';
  idcardnum: string = '';
  quostatus: string = '';
  refpayno: string = '';
  paystatus: string = '';
  pageno: number = 1;

  status_field = new FormControl()
  customername_field = new FormControl('', [Validators.minLength(2)])
  customeridcard_field = new FormControl('', Validators.pattern(`^(?:[0-9]{13}|)$`))
  refpaynum_field = new FormControl('')
  paystatus_field = new FormControl('')

  searchform = this.fb.group({
    status: this.status_field,
    customername: this.customername_field,
    customeridcard: this.customeridcard_field,
    refpaynum: this.refpaynum_field,
    paystatus: this.paystatus_field
  }, { validator: atLeastOne(Validators.required, ['customername', 'customeridcard', 'status', 'refpaynum', 'paystatus']) })

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
    private quotationService: QuotationService,
    private router: Router,
    public override dialog: MatDialog,
    public override _snackBar: MatSnackBar,
    private masterDataService: MasterDataService,
    private fb: FormBuilder,
    private userService: UserService,
    private route: ActivatedRoute,
    private loadingService: LoadingService,
    private breakpointObserver: BreakpointObserver
  ) {
    super(dialog, _snackBar)
    this.searchform.get('status')?.valueChanges.subscribe((value) => {
      this.quostatus = value
      this.maprouteparam()
    })
    this.searchform.get('customername')?.valueChanges.subscribe((value) => {
      this.customername = value ?? ''
      this.maprouteparam()
    })
    this.searchform.get('customeridcard')?.valueChanges.subscribe((value) => {
      this.idcardnum = value ?? ''
      this.maprouteparam()
    })
    this.searchform.get('refpaynum')?.valueChanges.subscribe((value) => {
      this.refpayno = value ?? ''
      this.maprouteparam()
    })
    this.searchform.get('status')?.valueChanges.subscribe((value) => {
      this.quostatus = value
      this.maprouteparam()
    })
    this.searchform.get('paystatus')?.valueChanges.subscribe((value) => {
      this.paystatus = value ?? ''
      this.maprouteparam()
    })

    // === get query params ===
    this.route.queryParams.subscribe(params => {
      this.customername = params['customername'];
      this.idcardnum = params['idcardnum'];
      this.quostatus = params['quostatus'];
      this.refpayno = params['refpayno'];
      this.paystatus = params['paystatus'];
      this.pageno = params['pageno'];
    });
  }

  async ngOnInit() {
    // === check query params (10/10/2022) === 
    if (this.customername || this.idcardnum || this.quostatus || this.refpayno || this.paystatus || this.pageno) {

      const customernamefilter = this.customername ? this.customername : ''
      const idcardnumfilter = this.idcardnum ? this.idcardnum : ''
      const quostatusfilter = this.quostatus ? this.quostatus : ''
      const refpaynofilter = this.refpayno ? this.refpayno : ''
      const paystatusfilter = this.paystatus ? this.paystatus : ''
      const pagenofilter = this.pageno ? this.pageno : 1

      this.searchform.get('status')?.setValue(quostatusfilter);
      this.searchform.get('customername')?.setValue(customernamefilter);
      this.searchform.get('customeridcard')?.setValue(idcardnumfilter);
      this.searchform.get('refpaynum')?.setValue(refpaynofilter);
      this.searchform.get('paystatus')?.setValue(paystatusfilter);
      this.filteroninit(pagenofilter, quostatusfilter, customernamefilter, idcardnumfilter, refpaynofilter, paystatusfilter)
    } else {
      this.afteroninit()
    }


  }

  async afteroninit() {

    this.loadingService.showLoader();

    this.quotationService.getquotationlist(1, '', { searchidcard: '', searchname: '', searchrefpaynum: '', searchpaystatus: '' }).subscribe({
      next: (resultListQuotation) => {


        // === addd new text form quo_status (14/09/2022) ===
        resultListQuotation.data.map((items,i) => {
          switch (items.quo_status) {
            case 0:
              items._client_quo_status = 'ส่งงาน';
              break;
            case 1:
              items._client_quo_status = 'Lock';
              break;
            case 4:
              items._client_quo_status = 'Draft';
              break;
          }

          switch (items.otp_consent_verify) {
            case 'Y':
              items._client_otp_consent_verify = 'E';
              break;
            case 'N':
              items._client_otp_consent_verify = 'O';
              break;
            case null:
              items._client_otp_consent_verify = '-';
              break;
          }
          
          return items;

        })

        this.dataListTemp = resultListQuotation

        // === add index to client page === 
        this.dataList = this.dataListTemp
        this.dataSource.data = (resultListQuotation.data) as any
        this.paginator.pageIndex = 0
        this.pageLength = this.dataListTemp.rowcount
        this.pageSize = this.dataListTemp.pagesize
        // this.dataSource.sort = this.sort
      }, error: (err) => {
        console.log(`errr : ${err.error.message}`)
      }, complete: async () => {
        this.loadingService.hideLoader();
      }
    })

    const resultMasterStatus = await lastValueFrom(this.masterDataService.getMasterStatus());
    if (resultMasterStatus) {
      this.quotationStatus = resultMasterStatus.data
      // this.quotationStatus.push({ status: 'NEW', statustext: 'คำร้องใหม่' })
      this.quotationStatus.push({ status: 'ALL', statustext: 'ทุกสถานะ' })
    }


    // === check session === 
    const sessionUser = localStorage.getItem('currentUser')
    if (sessionUser) {
      const sessionUserObject = (JSON.parse(sessionUser)) as IUserToken

      // === service for check role login permission (04/07/2022) ====
      this.userService.checkrolelogin();

      if (sessionUserObject.data.RADMIN === 'Y') {
        // ==== set IsAdmin for Admin role (26/05/2022) ====
        this.isAdmin$.next(true)
        this.showbypass$.next(true)
      } else if (sessionUserObject.data.RADMIN === 'FI') {
        this.isAdmin$.next(true)
        this.showrefpaynumbtn = true
      } else {
        this.isAdmin$.next(false)
        this.showbypass$.next(false)
      }
    }
  }

  testnav() {
    this.router.navigate(['/quotation-detail'])
  }

  async filteroninit(pageno: number, quostatus: string, customername: string, idcardnum: string, refpaynum: string, paystatus: string) {
    const mappaystatusvalue = paystatus ? this.buildstrforpaystatus(paystatus) : ''
    let searchstatus = ''
    switch (quostatus) {
      case 'NEW': {
        searchstatus = ''
      }
        break;
      case 'ALL': {
        searchstatus = ''
      }
        break;

      default:
        break;
    }

    this.loadingService.showLoader();

    this.quotationService.getquotationlist(
      pageno,
      searchstatus,
      {
        searchidcard: idcardnum,
        searchname: customername,
        searchrefpaynum: refpaynum,
        searchpaystatus: mappaystatusvalue
      }
    ).subscribe({
      next: (resultListQuotation) => {


        // === addd new text form quo_status (14/09/2022) ===
        resultListQuotation.data.map((items) => {
          switch (items.quo_status) {
            case 0:
              items._client_quo_status = 'ส่งงาน';
              break;
            case 1:
              items._client_quo_status = 'Lock';
              break;
            case 4:
              items._client_quo_status = 'Draft';
              break;
          }

          switch (items.otp_consent_verify) {
            case 'Y':
              items._client_otp_consent_verify = 'E';
              break;
            case 'N':
              items._client_otp_consent_verify = 'O';
              break;
            case null:
              items._client_otp_consent_verify = '-';
              break;
          }

          return items;
        })


        this.dataListTemp = resultListQuotation

        // === add index to client page === 
        this.dataList = this.dataListTemp
        this.dataSource.data = (resultListQuotation.data) as any
        this.paginator.pageIndex = pageno - 1
        this.pageLength = this.dataListTemp.rowcount
        this.pageSize = this.dataListTemp.pagesize
        // this.dataSource.sort = this.sort
      }, error: (err) => {
        console.log(`errr : ${err.error.message}`)
      }, complete: async () => {
        this.loadingService.hideLoader()
      }
    })

    const resultMasterStatus = await lastValueFrom(this.masterDataService.getMasterStatus());
    if (resultMasterStatus) {
      this.quotationStatus = resultMasterStatus.data
      // this.quotationStatus.push({ status: 'NEW', statustext: 'คำร้องใหม่' })
      this.quotationStatus.push({ status: 'ALL', statustext: 'ทุกสถานะ' })
    }


    // === check session === 
    const sessionUser = localStorage.getItem('currentUser')
    if (sessionUser) {
      const sessionUserObject = (JSON.parse(sessionUser)) as IUserToken

      // === service for check role login permission (04/07/2022) ====
      this.userService.checkrolelogin();

      if (sessionUserObject.data.RADMIN == 'Y') {
        // ==== set IsAdmin for Admin role (26/05/2022) ====
        this.isAdmin$.next(true)
        this.showbypass$.next(true)
      } else if (sessionUserObject.data.RADMIN === 'FI') {
        this.isAdmin$.next(true)
        this.showrefpaynumbtn = true
      } else {
        this.isAdmin$.next(false)
        this.showbypass$.next(false)
      }
    }
  }

  maprouteparam() {
    this.router.navigate([], {
      relativeTo: this.route, queryParams: {
        customername: this.customername,
        idcardnum: this.idcardnum,
        quostatus: this.quostatus,
        refpayno: this.refpayno,
        paystatus: this.paystatus,
        pageno: this.pageno
      }
    });
  }

  // ngAfterViewInit(): void {
  //   // this.dataSource.paginator = this.paginator;
  //   this.pageLength = this.dataListTemp.rowcount
  //   this.pageSize = this.dataListTemp.pagesize
  // }



  async onfindsearch() {
    const searchname = this.searchform.get('customername')?.value ? this.searchform.get('customername')?.value : ''
    const searchidcard = this.searchform.get('customeridcard')?.value ? this.searchform.get('customeridcard')?.value : ''
    const searchrefpaynum = this.searchform.get('refpaynum')?.value ? this.searchform.get('refpaynum')?.value : ''
    const searchpaystatus = this.searchform.get('paystatus')?.value ? this.buildstrforpaystatus(this.searchform.get('paystatus')?.value ?? '') : ''
    let searchStatus = this.searchform.get('status')?.value ? this.searchform.get('status')?.value : ''

    // === create status of new and all status ==== 
    switch (searchStatus) {
      case 'NEW': {
        searchStatus = ''
      }
        break;
      case 'ALL': {
        searchStatus = ''
      }
        break;

      default:
        break;
    }

    const params = { searchname, searchidcard, searchrefpaynum, searchpaystatus } as ISearchQuotation

    this.loadingService.showLoader()

    this.quotationService.getquotationlist(1, searchStatus, params).pipe(
      map((resultListQuotation: IResQuotationView) => {
        resultListQuotation.data.map((items) => {
          switch (items.quo_status) {
            case 0:
              items._client_quo_status = 'ส่งงาน';
              break;
            case 1:
              items._client_quo_status = 'Lock';
              break;
            case 4:
              items._client_quo_status = 'Draft';
              break;
          }

          switch (items.otp_consent_verify) {
            case 'Y':
              items._client_otp_consent_verify = 'E';
              break;
            case 'N':
              items._client_otp_consent_verify = 'O';
              break;
            case null:
              items._client_otp_consent_verify = '-';
              break;
          }

          return items;

        })
        this.dataListTemp = resultListQuotation
        // === add index to client page === 
        this.dataList = this.dataListTemp
        this.dataSource.data = (resultListQuotation.data) as any
        this.paginator.pageIndex = 0
        this.pageLength = this.dataListTemp.rowcount
        this.pageSize = this.dataListTemp.pagesize
      })
    ).subscribe({
      next: (results) => {

      }, error: (e) => {

      }, complete: () => {
        this.loadingService.hideLoader()
      }
    })
  }

  onsearchnamechange($event: any) {

  }

  onsearchidcardchange($event: any) {
    // this.userfilter = false
  }

  onsearchidrefpaynumchange($event: any) {
    // this.userfilter = false
  }

  onsearchpaystatuschange($event: any) {
    console.log($event)
  }

  buildstrforpaystatus(status: string): string {
    let returnstr = ''
    switch (status) {
      case 'ALL':
        returnstr = ''
        break;
      case '2':
        returnstr = 'N'
        break;
      case '1':
        returnstr = 'Y'
        break;

      default:
        returnstr = status
        break;
    }

    return returnstr
  }


  onPaginationChange(event: PageEvent) {

    this.loadingService.showLoader()

    let page = event.pageIndex;
    let size = event.pageSize;

    page = page + 1;
    let searchStatus = this.searchform.get('status')?.value ? this.searchform.get('status')?.value : ''

    this.router.navigate([], {
      relativeTo: this.route, queryParams: {
        customername: this.customername,
        idcardnum: this.idcardnum,
        quostatus: this.quostatus,
        refpayno: this.refpayno,
        paystatus: this.paystatus,
        pageno: page
      }
    });

    // === create status of new and all status ==== 
    switch (searchStatus) {
      case 'NEW': {
        searchStatus = ''
      }
        break;
      case 'ALL': {
        searchStatus = ''
      }
        break;

      default:
        break;
    }

    this.quotationService.getquotationlist(page, searchStatus,
      {
        searchidcard: this.searchform.get(`customeridcard`)?.value ?? '',
        searchname: this.searchform.get('customername')?.value ?? '',
        searchrefpaynum: this.searchform.get('refpaynum')?.value ?? '',
        searchpaystatus: this.searchform.get('paystatus')?.value ? this.buildstrforpaystatus(this.searchform.get('paystatus')?.value ?? '') : ''
      }).pipe(
        map((result: IResQuotationView) => {
          // this.dataSource = new MatTableDataSource(result.data);
          result.data.map((items) => {

            this.loadingService.hideLoader()

            switch (items.quo_status) {
              case 0:
                items._client_quo_status = 'ส่งงาน';
                break;
              case 1:
                items._client_quo_status = 'Lock';
                break;
              case 4:
                items._client_quo_status = 'Draft';
                break;
            }
  
            switch (items.otp_consent_verify) {
              case 'Y':
                items._client_otp_consent_verify = 'E';
                break;
              case 'N':
                items._client_otp_consent_verify = 'O';
                break;
              case null:
                items._client_otp_consent_verify = '-';
                break;
            }
  
            return items;

          })
          // this.dataList = result
          // this.dataSource.data = (result.data) as any

          this.dataListTemp = result
          // === add index to client page === 
          this.dataList = this.dataListTemp
          this.dataSource.data = (result.data) as any
          this.paginator.pageIndex = this.pageno - 1
          this.pageLength = this.dataListTemp.rowcount
          this.pageSize = this.dataListTemp.pagesize
        })
      ).subscribe();
  }



  addNewQuotation() {
    this.router.navigate(['/quotation-detail']);
  }

  getRecord(row: IResQuotationViewData) {
    const id = row.quo_key_app_id ? row.quo_key_app_id : '';
    if (id) {
      // === open quotation page by id === 
      console.log(`this is quotation key id : ${id}`)
      this.router.navigate(['/quotation-detail'], { queryParams: { id: id } })
    }
  }

  onbtnclick(event: any, type: string) {
    const id = event;
    if (id) {
      // === open quotation page by id === 
      if (type == 'info') {
        console.log(`this is quotation key id : ${id}`)
        this.router.navigate(['/quotation-detail'], {
          queryParams: {
            id: id,
            // customername: '',
            // idcardnum: '',
            // quostatus: '',
            // refpayno: '',
            // paystatus: ''
          }
        })
      } else if (type === 'bypass') {
        this.router.navigate(['/bypass'], { queryParams: { id: id } })
      } else {

      }
    }
  }

  clearandrefresh() {
    // this.searchform.get('customername')?.setValue('')
    // this.searchform.get('customeridcard')?.setValue('')
    // this.searchform.get('status')?.setValue(null)
    this.pageno = 1
    this.searchform.reset();
    this.quotationStatusSelect = ''
    this.router.navigate([], {
      relativeTo: this.route, queryParams: {
        pageno: 1
      }
    });
    this.ngOnInit();
  }

  cancleCase(quotationid: string) {
    this.dialog.open(MainDialogComponent, {
      panelClass: 'custom-dialog-container',
      data: {
        header: `ยืนยันการยกเลิก`,
        message: `หากยกเลิกรายการแล้ว รายการนี้จะไม่แสดงในหน้าจออีก กดปุ่มตกลงเพื่อยืนยันรายการ`,
        button_name: 'ตกลง'
      }
    }).afterClosed().subscribe(result => {
      // === not stage here ==== 
      if (result) {
        this.quotationService.MPLS_canclequotation(quotationid).subscribe({
          next: (result) => {
            if (result.status === 200) {
              // === success cancle status ===
              // this.dialog.open(MainDialogComponent, {
              //   panelClass: 'custom-dialog-container',
              //   data: {
              //     header: `สำเร็จ`,
              //     message: `${result.message}`,
              //     button_name: 'ตกลง'
              //   }
              // }).afterClosed().subscribe(result => {
              //   // === not stage here ==== 
              //   this.ngOnInit()
              // });
              this.ngOnInit()
              this.snackbarsuccess(`ทำรายการสำเร็จ : ${result.message ? result.message : ''}`)
            } else {
              // this.ngOnInit()
              this.snackbarfail(`ยกเลิกใบคำขอไม่สำเร็จ : ${result.message ? result.message : 'No return message'}`)
            }
          }, error: (e) => {
            // if (e.error.status === 400) {
            //   this.dialog.open(MainDialogComponent, {
            //     panelClass: 'custom-dialog-container',
            //     data: {
            //       header: `ผิดพลาด : (status ${e.error.status})`,
            //       message: `${e.error.message ? e.error.message : 'ยกเลิกใบคำขอไม่สำเร็จ'}`,
            //       button_name: 'ตกลง'
            //     }
            //   }).afterClosed().subscribe(result => {
            //     // === not stage here ==== 
            //   });
            // }

            this.snackbarfail(`ยกเลิกใบคำขอไม่สำเร็จ : ${e.error.message ? e.error.message : 'No return message'}`)
          }
        })
      }
    });
  }

}
