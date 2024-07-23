import { BaseService } from 'src/app/service/base/base.service';
import { IResCarcheckStatus, IResCarcheckStatusData } from './../../../interface/i-res-carcheck-status';
import { UserService } from 'src/app/service/auth/user.service';
import { IResMasterBranch, IResMasterBranchData } from 'src/app/interface/i-res-master-branch'; // replace for IResMasterBranch, IResMasterBranchData
import { MasterDataService } from 'src/app/service/master.service';
// import { Icontractlist, Icontractlistdata } from './../../../interface/icontractlist';
import { Router, ActivatedRoute } from '@angular/router';
import { map, forkJoin, Observable, startWith } from 'rxjs';
import { UntypedFormControl, UntypedFormGroup, Validators, UntypedFormBuilder, ValidatorFn, ValidationErrors, FormBuilder, FormControl, FormGroup, AbstractControl } from '@angular/forms';
import { NegotiationService } from 'src/app/service/negotiation.service';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { IResGetviewcontractlist, IResGetviewcontractlistData } from 'src/app/interface/i-res-getviewcontractlist'; // replace IResGetviewcontractlist
import { IUserToken } from 'src/app/interface/i-user-token'; // replace IUserToken
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BreakpointObserver } from '@angular/cdk/layout';
import { LoadingService } from 'src/app/service/loading.service';
import { IResHolderName, IResHolderNameData } from 'src/app/interface/i-res-holder-name';

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

  holderList = [] as IResHolderNameData[]
  holderSelect = [] as IResHolderNameData[]
  filterHolderList?= [] as IResHolderNameData[]
  cardholdernameData: IResHolderNameData[] = []
  holderSelectText: string = ''
  holderSelectTextNullCheck: boolean = false

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
  recentholder: any;
  recentapd: any;

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
  holder: string | null = '';
  apd: Date | null = null;

  // === set field FromControl (migration from untypedFormControl) (add-on 20/02/2023) ===
  nameField = new FormControl<string>('', [Validators.minLength(2)])
  surnameField = new FormControl('', [Validators.minLength(2)])
  applicationidField = new FormControl('', [Validators.pattern('^[0-9]{15}$')])
  branchField = new FormControl()
  billField = new FormControl()
  dueField = new FormControl()
  trackField = new FormControl()
  carcheckstatusField = new FormControl()
  cardholdernameField = new FormControl()
  appointmentdatefield = new FormControl()
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
    cardholdernameField: this.cardholdernameField,
    appointmentdatefield: this.appointmentdatefield,
    Validators: atLeastOne(Validators.required, ['nameField', 'surnameField', 'applicationidField', 'dueField', 'branchField', 'billField', 'trackField', 'carcheckstatusField', 'cardholdernameField'])
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
    this.negoForm.controls.cardholdernameField.valueChanges.subscribe((value) => {
      this.holder = value
    })
    this.negoForm.controls.appointmentdatefield.valueChanges.subscribe((value) => {
      this.apd = value
    })

    this.negoForm.controls.cardholdernameField.valueChanges.pipe(
      startWith(''),
      map(value => this._filterHolder(value))
    ).subscribe(async (value: IResHolderNameData[]) => {

      this.filterHolderList = value

      const selectValue = this.holderList.find((items: { emp_id: string }) => {
        return items.emp_id == value[0].emp_id
      })

      if (typeof selectValue !== 'undefined') {
        // === set text of dealer select === 
        if (!this.holderSelectTextNullCheck) {
          this.holderSelectText = selectValue.emp_fullname;
        } else {
          this.holderSelectText = ''
        }
      } else {
        this.holderSelectText = ''
      }
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
      this.holder = params['holder'];
      this.apd = params['apd'];
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
      const holderfilter = this.holder ? this.holder : ''
      const apdfilter = this.apd ? this.apd : ''

      this.negoForm.controls.nameField.setValue(fnamefilter);
      this.negoForm.controls.surnameField.setValue(lnamefilter);
      this.negoForm.controls.applicationidField.setValue(hpnofilter);
      this.negoForm.controls.branchField.setValue(branchfilter);
      this.negoForm.controls.billField.setValue(billfilter);
      this.negoForm.controls.dueField.setValue(duefilter);
      this.negoForm.controls.trackField.setValue(statusfilter);
      this.negoForm.controls.carcheckstatusField.setValue(carcheckfilter);
      this.negoForm.controls.cardholdernameField.setValue(holderfilter);
      this.negoForm.controls.appointmentdatefield.setValue(apdfilter);

      this.filteroninit(pagenofilter, fnamefilter, lnamefilter, hpnofilter, duefilter, branchfilter, billfilter, statusfilter, carcheckfilter, holderfilter, apdfilter)
    } else {
      this.afteroninit()
    }

  }

  afteroninit() {
    this.loadingService.showLoader()
    forkJoin<[IResMasterBranch, IResCarcheckStatus, IResGetviewcontractlist, IResHolderName]>(
      [
        this.masterDataService.getbranch(),
        this.masterDataService.getcarcheckstatus(),
        this.negotiationService.getviewcontractlist(1, '', '', '', '', '', '', '', '', '', ''),
        this.negotiationService.getholdermaster()
      ]
    ).subscribe({
      next: ([resultbranch, resultcarcheckp, resultcontract, resultholder]) => {
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

          // === map holder name parameter to variable ===
          this.cardholdernameData = resultholder.data
          this.filterHolderList = resultholder.data
          this.holderList = resultholder.data
          this.negoForm.controls.cardholdernameField.setValidators(this.validateHolderformat(this.holderList))

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

  filteroninit(pageno: number, fname: string, lname: string, hpno: string, due: string, branch: string, bill: string, track: string, carcheckstatus: string, holder: string, apd: Date | string) {
    try {
      this.loadingService.showLoader()
      forkJoin<[IResMasterBranch, IResCarcheckStatus, IResGetviewcontractlist, IResHolderName]>(
        [
          this.masterDataService.getbranch(),
          this.masterDataService.getcarcheckstatus(),
          this.negotiationService.getviewcontractlist(pageno, fname, lname, hpno, due, branch, bill, track, carcheckstatus, holder, apd),
          this.negotiationService.getholdermaster()
        ]
      ).pipe(map(([resultbranch, resultcarcheckp, resultcontract, resultholder]) => {
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

          // === map holder name parameter to variable ===
          this.cardholdernameData = resultholder.data
          this.filterHolderList = resultholder.data
          this.holderList = resultholder.data
          this.negoForm.controls.cardholdernameField.setValidators(this.validateHolderformat(this.holderList))

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
    this.loadingService.showLoader()
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
        carcheckstatus: this.carcheckstatus,
        holder: this.holder,
        apd: this.apd
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
    this.recentholder = this.negoForm.controls.cardholdernameField.value ? this.negoForm.controls.cardholdernameField.value : ''
    this.recentapd = this.negoForm.controls.appointmentdatefield.value ? this.negoForm.controls.appointmentdatefield.value : ''

    this.negotiationService.getviewcontractlist(
      1,
      this.recentname,
      this.recentsname,
      this.recentapplication,
      this.recentdue,
      this.recentbranch,
      this.recentbill,
      this.recenttrack,
      this.recentcarcheckstatus,
      this.recentholder,
      this.recentapd
    )
      .pipe(
        map((results: IResGetviewcontractlist, e) => {
          this.dataList = results.data
          this.dataSource.data = this.dataList
          this.paginator.pageIndex = 0
          this.pageLength = results.rowcount
          this.pageSize = results.pagesize
          // this.dataSource.sort = this.sort))
        })
      ).subscribe({
        next: (res) => {
          this.loadingService.hideLoader()
        }, error: (e) => {
          this.loadingService.hideLoader()
        }, complete: () => {
          this.loadingService.hideLoader()
        }
      })
  }

  onclear() {
    this.loadingService.showLoader()
    this.negoForm.reset();
    this.router.navigate([], {
      relativeTo: this.route, queryParams: {
        pageno: 1
      }
    });
    this.negotiationService.getviewcontractlist(1, '', '', '', '', '', '', '', '', '', '').subscribe({
      next: (results: IResGetviewcontractlist) => {
        this.loadingService.hideLoader()
        this.dataList = results.data
        this.dataSource.data = this.dataList
        // this.dataSource.paginator = this.paginator
        this.paginator.pageIndex = 0
        this.pageLength = results.rowcount
        this.pageSize = results.pagesize
        // this.dataSource.sort = this.sort

      }, error: (err) => {
        this.dataList = []
        this.loadingService.hideLoader()
      }, complete: () => {
        this.loadingService.hideLoader()

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
        carcheckstatus: this.carcheckstatus,
        holder: this.holder,
        apd: this.apd
      }
    })


    // this.router.navigate(['collector', 'information'], { queryParams: {id: d.hp_no} });

  }


  onPaginationChange(event: PageEvent) {
    this.loadingService.showLoader()
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
    this.recentholder = this.negoForm.controls.cardholdernameField.value ? this.negoForm.controls.cardholdernameField.value : ''
    this.recentapd = this.negoForm.controls.appointmentdatefield.value ? this.negoForm.controls.appointmentdatefield.value : ''


    this.router.navigate([], {
      relativeTo: this.route, queryParams: {
        fname: this.fname,
        lname: this.lname,
        hpno: this.hpno,
        due: this.due,
        branch: this.branch,
        bill: this.bill,
        status: this.status,
        pageno: page,
        carcheckstatus: this.carcheckstatus,
        holder: this.holder,
        apd: this.apd
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
      this.recentcarcheckstatus,
      this.recentholder,
      this.recentapd
    ).pipe(
      map((results: IResGetviewcontractlist) => {
        this.dataList = results.data
        this.dataSource.data = this.dataList
        this.paginator.pageIndex = this.pageno - 1
        this.pageLength = results.rowcount
        this.pageSize = results.pagesize
        // this.dataSource.sort = this.sort))
      })

    ).subscribe({
      next: (res) => {
        this.loadingService.hideLoader()
      }, error: (e) => {
        this.loadingService.hideLoader()
      }, complete: () => {
        this.loadingService.hideLoader()
      }
    });
  }

  private _filterHolder(value: string | null): IResHolderNameData[] {
    if (value) {
      this.holderSelectTextNullCheck = false
      const filterValue = value.toLowerCase();
      return this.holderList.filter(value => value.emp_id.includes(filterValue) || value.emp_name.toLowerCase().includes(filterValue) || value.emp_lname.toLowerCase().includes(filterValue))
    } else {
      this.holderSelectTextNullCheck = true
      return this.holderList.filter(value => value.emp_id.includes('') || value.emp_name.toLowerCase().includes(''))
    }
  }

  validateHolderformat(listitem: IResHolderNameData[]): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (control.value === null || control.value === '') {
        this.holderSelectText = ''
        return null;
      }
      const index = listitem.findIndex(items => {
        return (new RegExp('\^' + items.emp_id + '\$')).test(control.value);
      });
      return index < 0 ? { 'wrongFormatHolder': { value: control.value } } : null;
    };
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