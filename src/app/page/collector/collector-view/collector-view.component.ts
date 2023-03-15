import { BaseService } from 'src/app/service/base/base.service';
import { IResCarcheckStatus, IResCarcheckStatusData } from './../../../interface/i-res-carcheck-status';
import { UserService } from 'src/app/service/auth/user.service';
import { IResMasterBranch, IResMasterBranchData } from 'src/app/interface/i-res-master-branch'; // replace for IResMasterBranch, IResMasterBranchData
import { MasterDataService } from 'src/app/service/master.service';
// import { Icontractlist, Icontractlistdata } from './../../../interface/icontractlist';
import { Router, ActivatedRoute } from '@angular/router';
import { map, forkJoin } from 'rxjs';
import { UntypedFormControl, UntypedFormGroup, Validators, UntypedFormBuilder, ValidatorFn, ValidationErrors, FormBuilder, FormControl, FormGroup, AbstractControl } from '@angular/forms';
import { NegotiationService } from 'src/app/service/negotiation.service';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import * as moment from 'moment';
import { IResGetviewcontractlist, IResGetviewcontractlistData } from 'src/app/interface/i-res-getviewcontractlist'; // replace IResGetviewcontractlist
import { IUserToken } from 'src/app/interface/i-user-token'; // replace IUserToken
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BreakpointObserver } from '@angular/cdk/layout';
import { LoadingService } from 'src/app/service/loading.service';

// export const atLeastOne_v2 = (validator: ValidatorFn, controlNames: string[] = []) => (
//   control: AbstractControl,
// ): ValidationErrors | null => {
//   if (controlNames.length !== 0) {
//     const group = control as FormGroup;
//     const hasAtLeastOne = controlNames.some(k => !validator(group.controls[k]));
//     return hasAtLeastOne ? null : {
//       atLeastOne: true,
//     };
//   } else {
//     return null;
//   }
// }

export const atLeastOne = (validator: ValidatorFn, controls: string[] = []) => (
  group: FormGroup,
): ValidationErrors | null => {
  if (!controls) {
    controls = Object.keys(group.controls)
  }

  const hasAtLeastOne = group && group.controls && controls
    .some(k => !validator(group.controls[k]));

  return hasAtLeastOne ? null : {
    atLeastOne: true,
  };
}

// === status value ==== 

type MyType = IResGetviewcontractlistData[];

interface Status {
  value: string;
  status: string;
}

@Component({
  selector: 'app-collector-view',
  templateUrl: './collector-view.component.html',
  styleUrls: ['./collector-view.component.scss']
})
export class CollectorViewComponent extends BaseService implements OnInit {

  // negoForm: UntypedFormGroup;
  dataList: IResGetviewcontractlistData[] = []
  norecord: boolean = true
  dataSource = new MatTableDataSource;
  pageEvent: PageEvent = new PageEvent;
  pageLength!: number;
  pageSize!: number;
  quotationStatusSelect: string = '';

  branchData: IResMasterBranchData[] = []
  carcheckstatusData: IResCarcheckStatusData[] = []

  // branchData: IResMasterBranchData[] = {} as IResMasterBranchData[]
  // branchData: BehaviorSubject<IResMasterBranchData[]> = new BehaviorSubject<IResMasterBranchData[]>({} as IResMasterBranchData[]);
  // carcheckstatusData: BehaviorSubject<IResCarcheckStatusData[]> = new BehaviorSubject<IResCarcheckStatusData[]>({} as IResCarcheckStatusData[]);
  //carcheckstatusData = {} as IResCarcheckStatusData[]


  recentname: any;
  recentsname: any;
  recentapplication: any;
  recentdue: any;
  recentbranch: any;
  recentbill: any;
  recenttrack: any;
  recentcarcheckstatus: any;

  trackStatus: Status[] = [
    { value: '0', status: 'ทั้งหมด' },
    { value: '1', status: 'ติดตามแล้ว' },
    { value: '2', status: 'ยังไม่ติดตาม' },
  ];

  @ViewChild(MatSortModule) sort: MatSortModule = {} as MatSortModule;
  @ViewChild(MatPaginator) paginator: MatPaginator = {} as MatPaginator;

  fname: string | null = '';
  lname: string | null = '';
  hpno: string | null = '';
  due: string | null = '';
  branch: string | null = '';
  bill: string | null = '';
  status: string | null = '';
  carcheckstatus: string | null = '';
  pageno: number = 1;

  // === set field FromControl (migration from untypedFormControl) (add-on 20/02/2023) ===
  nameField = new FormControl<string>('', [Validators.minLength(2)])
  surnameField = new FormControl('', [Validators.minLength(2)])
  applicationidField = new FormControl('', [Validators.pattern('^[0-9]{15}$')])
  branchField = new FormControl()
  billField = new FormControl()
  dueField = new FormControl()
  trackField = new FormControl()
  carcheckstatusField = new FormControl()
  // === set FormBuilder (migration from untypedFormControl, untypedFormBuilder) (add-on 20/02/2023) ===
  negoForm = this.fb.group({
    nameField: this.nameField,
    surnameField: this.surnameField,
    applicationidField: this.applicationidField,
    branchField: this.branchField,
    billField: this.billField,
    dueField: this.dueField,
    trackField: this.trackField,
    carcheckstatusField: this.carcheckstatusField,
    Validators: atLeastOne(Validators.required, ['nameField', 'surnameField', 'applicationidField', 'dueField', 'branchField', 'billField', 'trackField', 'carcheckstatusField'])
  }
  )

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
    private fb: FormBuilder,
    private http: HttpClient,
    private negotiationService: NegotiationService,
    private masterDataService: MasterDataService,
    private router: Router,
    private userService: UserService,
    private route: ActivatedRoute,
    private breakpointObserver: BreakpointObserver,
    private loadingService: LoadingService,
    public override dialog: MatDialog,
    public override _snackBar: MatSnackBar,
  ) {
    super(dialog, _snackBar)

    // this.dataList = {
    //   data: [],
    //   status: 0,
    //   message: '',
    //   currentpage: 1,
    //   pagesize: 10,
    //   rowcount: 0,
    //   pagecount: 0
    // }

    this.negoForm.controls.nameField.valueChanges.subscribe((value) => {
      this.fname = value
    })

    this.negoForm.controls.nameField.valueChanges.subscribe((value) => {
      this.fname = value
    })
    this.negoForm.controls.surnameField.valueChanges.subscribe((value) => {
      this.lname = value
    })
    this.negoForm.controls.applicationidField.valueChanges.subscribe((value) => {
      this.hpno = value
    })
    this.negoForm.controls.branchField.valueChanges.subscribe((value) => {
      this.branch = value
    })
    this.negoForm.controls.billField.valueChanges.subscribe((value) => {
      this.bill = value
    })
    this.negoForm.controls.dueField.valueChanges.subscribe((value) => {
      this.due = value
    })
    this.negoForm.controls.trackField.valueChanges.subscribe((value) => {
      this.status = value
    })
    this.negoForm.controls.carcheckstatusField.valueChanges.subscribe((value) => {
      this.carcheckstatus = value
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
      this.carcheckstatus = params['carcheckstatus']
    });

  }

  ngOnInit(): void {

    console.log(this.router)

    const userdata = localStorage.getItem('currentUser')


    if (userdata) {
      const userdataObj = (JSON.parse(userdata) as IUserToken).data;
      const sessionUserObject = (JSON.parse(userdata)) as IUserToken

      // === service for check role login permission (04/07/2022) ====
      this.userService.checkrolelogin()
    }

    // === check query params (23/09/2022) === 
    if (this.fname || this.lname || this.hpno ||
      this.due || this.branch || this.bill || this.status ||
      this.carcheckstatus || this.pageno) {
      // === run sql with parameter ====

      const fnamefilter = this.fname ? this.fname : ''
      const lnamefilter = this.lname ? this.lname : ''
      const hpnofilter = this.hpno ? this.hpno : ''
      const duefilter = this.due ? this.due : ''
      const billfilter = this.bill ? this.bill : ''
      const branchfilter = this.branch ? this.branch : ''
      const statusfilter = this.status ? this.status : ''
      const carcheckfilter = this.carcheckstatus ? this.carcheckstatus : ''
      const pagenofilter = this.pageno ? this.pageno : 1

      this.negoForm.controls.nameField.setValue(fnamefilter);
      this.negoForm.controls.surnameField.setValue(lnamefilter);
      this.negoForm.controls.applicationidField.setValue(hpnofilter);
      this.negoForm.controls.branchField.setValue(branchfilter);
      this.negoForm.controls.billField.setValue(billfilter);
      this.negoForm.controls.dueField.setValue(duefilter);
      this.negoForm.controls.trackField.setValue(statusfilter);
      this.negoForm.controls.carcheckstatusField.setValue(carcheckfilter);

      this.filteroninit(pagenofilter, fnamefilter, lnamefilter, hpnofilter, duefilter, branchfilter, billfilter, statusfilter, carcheckfilter)
    } else {
      this.afteroninit()
    }

  }

  afteroninit() {
    this.loadingService.showLoader()
    forkJoin<[IResMasterBranch, IResCarcheckStatus, IResGetviewcontractlist]>(
      [
        this.masterDataService.getbranch(),
        this.masterDataService.getcarcheckstatus(),
        this.negotiationService.getviewcontractlist(1, '', '', '', '', '', '', '', '')
      ]
    ).subscribe({
      next: ([resultbranch, resultcarcheckp, resultcontract]) => {
        this.loadingService.hideLoader()
        if (
          resultbranch.data.length !== 0 &&
          resultcarcheckp.data.length !== 0 &&
          resultcontract
        ) {

          // == set branch master parameter (17/10/2022) === 
          this.branchData = resultbranch.data

          // === set carcheck status parameter (17/10/2022) ===
          // this.carcheckstatusData = resultcarcheckp.data
          this.carcheckstatusData = resultcarcheckp.data

          // === check result contract list (17/10/2022)  ===
          if (resultcontract.data.length !== 0) {
            this.dataList = resultcontract.data
            this.dataSource.data = this.dataList
            this.paginator.pageIndex = 0
            // this.dataSource.paginator = this.paginator
            this.pageLength = resultcontract.rowcount
            this.pageSize = resultcontract.pagesize
            // this.dataSource.sort = this.sort
          } else {
            this.dataList = []

          }

        } else {
          this.dataList = []
        }
      }, error: (e) => {
        this.loadingService.hideLoader()
        console.log(`Error during forkjoin (getbranch, getcarcheckstatus, getviewcontractlist)`)
        this.snackbarfail(`${e.message ? e.message : 'Error during forkjoin (getbranch, getcarcheckstatus, getviewcontractlist)'}`)
      }, complete: () => {
        this.loadingService.hideLoader()
        console.log(`complete forkjoin !`)
      }
    })

  }

  filteroninit(pageno: number, fname: string, lname: string, hpno: string, due: string, branch: string, bill: string, track: string, carcheckstatus: string) {
    try {
      this.loadingService.showLoader()
      forkJoin<[IResMasterBranch, IResCarcheckStatus, IResGetviewcontractlist]>(
        [
          this.masterDataService.getbranch(),
          this.masterDataService.getcarcheckstatus(),
          this.negotiationService.getviewcontractlist(pageno, fname, lname, hpno, due, branch, bill, track, carcheckstatus)
        ]
      ).pipe(map(([resultbranch, resultcarcheckp, resultcontract]) => {
        if (
          resultbranch.data.length !== 0 &&
          resultcarcheckp.data.length !== 0 &&
          resultcontract
        ) {

          this.loadingService.hideLoader()
          // == set branch master parameter (17/10/2022) === 
          this.branchData = resultbranch.data

          // === set carcheck status parameter (17/10/2022) ===
          // this.carcheckstatusData = resultcarcheckp.data
          this.carcheckstatusData = resultcarcheckp.data

          // === check result contract list (17/10/2022)  ===
          if (resultcontract.data.length !== 0) {
            this.dataList = resultcontract.data
            this.dataSource.data = this.dataList
            this.paginator.pageIndex = pageno - 1
            // this.dataSource.paginator = this.paginator
            this.pageLength = resultcontract.rowcount
            this.pageSize = resultcontract.pagesize
            // this.dataSource.sort = this.sort
          } else {
            this.dataList = []
          }

        } else {
          this.dataList = []
        }
      })).subscribe()
    } catch (e: any) {
      this.loadingService.hideLoader()
      this.snackbarfail(`Error : ${e.message ? e.message : 'Error during call data!'}`)
    }

  }

  onsearch() {
    const nameValue = this.negoForm.controls.nameField.value ? this.negoForm.controls.nameField.value : ''
    const surnameValue = this.negoForm.controls.surnameField.value ? this.negoForm.controls.surnameField.value : ''
    const applicationidValue = this.negoForm.controls.applicationidField.value ? this.negoForm.controls.applicationidField.value : ''
    const dueValue = this.negoForm.controls.dueField.value ? this.negoForm.controls.dueField.value : ''
    const carcheckstatusValue = this.negoForm.controls.carcheckstatusField.value ? this.negoForm.controls.carcheckstatusField.value : ''
    let branchValue = this.negoForm.controls.branchField.value ? this.negoForm.controls.branchField.value : ''

    this.router.navigate([], {
      relativeTo: this.route, queryParams: {
        fname: this.fname,
        lname: this.lname,
        hpno: this.hpno,
        due: this.due,
        branch: this.branch,
        bill: this.bill,
        status: this.status,
        pageno: 1,
        carcheckstatus: this.carcheckstatus
      }
    });

    // === check branch data ===
    if (branchValue == '0') {
      branchValue = ''
    }

    this.recentname = this.negoForm.controls.nameField.value ? this.negoForm.controls.nameField.value : ''
    this.recentsname = this.negoForm.controls.surnameField.value ? this.negoForm.controls.surnameField.value : ''
    this.recentapplication = this.negoForm.controls.applicationidField.value ? this.negoForm.controls.applicationidField.value : ''
    this.recentdue = this.negoForm.controls.dueField.value ? this.negoForm.controls.dueField.value : ''
    this.recentbranch = branchValue
    this.recentbill = this.negoForm.controls.billField.value ? this.negoForm.controls.billField.value : ''
    this.recenttrack = this.negoForm.controls.trackField.value ? this.negoForm.controls.trackField.value : ''
    this.recentcarcheckstatus = this.negoForm.controls.carcheckstatusField.value ? this.negoForm.controls.carcheckstatusField.value : ''

    this.negotiationService.getviewcontractlist(
      1,
      this.recentname,
      this.recentsname,
      this.recentapplication,
      this.recentdue,
      this.recentbranch,
      this.recentbill,
      this.recenttrack,
      this.recentcarcheckstatus)
      .pipe(
        map((results: IResGetviewcontractlist, e) => {
          this.dataList = results.data
          this.dataSource.data = this.dataList
          this.paginator.pageIndex = 0
          this.pageLength = results.rowcount
          this.pageSize = results.pagesize
          // this.dataSource.sort = this.sort))
        })
      ).subscribe()
  }

  onclear() {
    this.negoForm.reset();
    this.router.navigate([], {
      relativeTo: this.route, queryParams: {
        pageno: 1
      }
    });
    this.negotiationService.getviewcontractlist(1, '', '', '', '', '', '', '', '').subscribe({
      next: (results: IResGetviewcontractlist) => {
        this.dataList = results.data
        this.dataSource.data = this.dataList
        // this.dataSource.paginator = this.paginator
        this.paginator.pageIndex = 0
        this.pageLength = results.rowcount
        this.pageSize = results.pagesize
        // this.dataSource.sort = this.sort

      }, error: (err) => {
        this.dataList = []
      }, complete: () => {

      }
    })
  }

  viewinfo(d: IResGetviewcontractlistData) {
    console.log(`this is d when click : ${d.hp_no}`)
    this.router.navigate(['collector-detail'], {
      queryParams: {
        id: d.hp_no,
        fname: this.fname,
        lname: this.lname,
        hpno: this.hpno,
        due: this.due,
        branch: this.branch,
        bill: this.bill,
        status: this.status,
        pageno: this.pageno,
        carcheckstatus: this.carcheckstatus
      }
    })


    // this.router.navigate(['collector', 'information'], { queryParams: {id: d.hp_no} });

  }


  onPaginationChange(event: PageEvent) {
    let page = event.pageIndex;
    let size = event.pageSize;

    page = page + 1;

    this.recentname = this.negoForm.controls.nameField.value ? this.negoForm.controls.nameField.value : ''
    this.recentsname = this.negoForm.controls.surnameField.value ? this.negoForm.controls.surnameField.value : ''
    this.recentapplication = this.negoForm.controls.applicationidField.value ? this.negoForm.controls.applicationidField.value : ''
    this.recentdue = this.negoForm.controls.dueField.value ? this.negoForm.controls.dueField.value : ''
    let branchValue = this.negoForm.controls.branchField.value ? this.negoForm.controls.branchField.value : ''
    this.recentbill = this.negoForm.controls.billField.value ? this.negoForm.controls.billField.value : ''
    this.recenttrack = this.negoForm.controls.trackField.value ? this.negoForm.controls.trackField.value : ''
    this.recentcarcheckstatus = this.negoForm.controls.carcheckstatusField.value ? this.negoForm.controls.carcheckstatusField.value : ''


    this.router.navigate([], {
      relativeTo: this.route, queryParams: {
        fname: this.fname,
        lname: this.lname,
        hpno: this.hpno,
        due: this.due,
        branch: this.branch,
        bill: this.bill,
        status: this.status,
        pageno: page
      }
    });

    // === check branch data ===
    if (branchValue == '0') {
      branchValue = ''
    }

    this.recentbranch = branchValue

    // === check branch data ===
    if (branchValue == '0') {
      branchValue = ''
    }

    this.negotiationService.getviewcontractlist(
      page,
      this.recentname,
      this.recentsname,
      this.recentapplication,
      this.recentdue,
      this.recentbranch,
      this.recentbill,
      this.recenttrack,
      this.recentcarcheckstatus
    ).pipe(
      map((results: IResGetviewcontractlist) => {
        this.dataList = results.data
        this.dataSource.data = this.dataList
        this.paginator.pageIndex = this.pageno - 1
        this.pageLength = results.rowcount
        this.pageSize = results.pagesize
        // this.dataSource.sort = this.sort))
      })

    ).subscribe();
  }

}


// var currentDate =moment($scope.o.DateOfBirth, 'DD/MM/YYYY').format('YYYY-MM-DD');
// var futureMonth = moment(currentDate ).add(24, 'month').format("YYYY-MM-DD");

// console.log(currentDate.format('DD-MM-YYYY'));
// console.log(futureMonth.format('DD-MM-YYYY'));