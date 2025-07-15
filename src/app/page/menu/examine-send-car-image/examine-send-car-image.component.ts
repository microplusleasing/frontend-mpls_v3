import { LiveAnnouncer } from '@angular/cdk/a11y';
import { BreakpointObserver } from '@angular/cdk/layout';
import { formatDate } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, ValidatorFn } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, map, startWith } from 'rxjs';
import { IReqChecksendcarimagelistexcel } from 'src/app/interface/i-req-checksendcarimagelistexcel';
import { IResChecksendcarimagelist, IResChecksendcarimagelistData } from 'src/app/interface/i-res-checksendcarimagelist';

import { IResGetAcStatusTypeData } from 'src/app/interface/i-res-get-ac-status-type';
import { IResMasterBranchData } from 'src/app/interface/i-res-master-branch';
import { BaseService } from 'src/app/service/base/base.service';
import { HeaderService } from 'src/app/service/header.service';
import { LoadingService } from 'src/app/service/loading.service';
import { MasterDataService } from 'src/app/service/master.service';
import { NegotiationService } from 'src/app/service/negotiation.service';
import { OraclemenuService } from 'src/app/service/oraclemenu.service';
import { MainDialogComponent } from 'src/app/widget/dialog/main-dialog/main-dialog.component';
import { environment } from 'src/environments/environment';
import * as XLSX from 'xlsx';


@Component({
    selector: 'app-examine-send-car-image',
    templateUrl: './examine-send-car-image.component.html',
    styleUrls: ['./examine-send-car-image.component.scss'],
    standalone: false
})
export class ExamineSendCarImageComponent extends BaseService implements OnInit {

  version: string = `${environment.version}`
  // *** filter (paramter) ****
  branchData: IResMasterBranchData[] = []
  AcStatusList: IResGetAcStatusTypeData[] = []

  // *** Data Table *** 
  PageEvent: PageEvent = new PageEvent;
  pageLength: number = 0;
  pageSize: number = 0;
  pageno: number = 1;
  dataList: IResChecksendcarimagelistData[] = []
  dataSource = new MatTableDataSource<IResChecksendcarimagelistData>();
  displayedColumns: string[] = [
    'idcardnum',
    'createdtime',
    'contractno',
    'applicationnum',
    'createcontractdate',
    'custname',
    'branchname',
    'checkername',
    'acstatustext',
    'click'
  ]

  sort_field: string = ''
  sort_type: 'asc' | 'desc' | '' = '';
  sort_text_desc: string = ''
  total_count: number = 0;
  containdata: boolean = true;

  @ViewChild('sort_table') sort_table!: MatSort;
  @ViewChild('paginator_table') paginator_table!: MatPaginator;

  // *** site visit Form ***
  ac_statusField = new FormControl('')
  branchField = new FormControl('')
  approvedateField = new FormControl<Date | ''>('')

  // *** queryparam variable ***

  ac_status: string | null = '';
  branch: string | null = '';
  approve_date: string | Date = '';

  agentassigntofcrForm = this.fb.group({
    ac_statusField: this.ac_statusField,
    branchField: this.branchField,
    approvedateField: this.approvedateField,
  })

  // *** temp field value when search ****

  recent_ac_status: string = ''
  recent_branch: string = ''
  recent_approve_date: string | Date = ''

  /*... add recent_page for assign-agent-fcr ...*/
  recent_page: number = 1

  // *** responsive handle params ***
  cardLayout = this.breakpointObserver
    .observe(['(max-width: 800px)', '(min-width: 801px) and (max-width: 940px)', '(min-width: 941px) and (max-width: 1800px)', '(min-width: 1801px)'])
    .pipe(
      map(({ breakpoints, matches }) => {

        const listLayout = [
          // mobile 
          {
            columns: 12,
            list: { maxcols: 12, cols6: 12, cols4: 12, cols3: 12, cols2: 12, col: 12, twin: 6 },
            card_width: '90%',
            isweb: false
          },

          // tablet 
          {
            columns: 12,
            list: { maxcols: 12, cols6: 6, cols4: 4, cols3: 3, cols2: 12, col: 1, twin: 2 },
            card_width: '90%',
            isweb: false
          },

          // web 
          {
            columns: 12,
            list: { maxcols: 12, cols6: 6, cols4: 4, cols3: 3, cols2: 4, col: 1, twin: 2 },
            card_width: '80%',
            isweb: true
          },

          // web large
          {
            columns: 12,
            list: { maxcols: 12, cols6: 6, cols4: 4, cols3: 3, cols2: 2, col: 1, twin: 2 },
            card_width: '80%',
            isweb: true
          }
        ]

        if (matches) {

          let cb = Object.entries(breakpoints)
          for (let i = 0; i < cb.length; i++) {
            if (cb[i][1]) {
              return listLayout[i]
            }
          }

          return listLayout[0]
        } else {
          return listLayout[0]
        }
        
      })
    );



  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private _liveAnnouncer: LiveAnnouncer,
    private breakpointObserver: BreakpointObserver,
    private loadingService: LoadingService,
    private negoService: NegotiationService,
    private masterDataService: MasterDataService,
    private headerService: HeaderService,
    private oraclemenuService: OraclemenuService,
    public override dialog: MatDialog,
    public override _snackBar: MatSnackBar,
  ) {
    super(dialog, _snackBar)

    // *** stamp queryparam variable from field ***

    // สถานะบัญชี
    this.agentassigntofcrForm.controls.ac_statusField.valueChanges.subscribe((value) => {
      this.ac_status = value
    })
    // สาขา
    this.agentassigntofcrForm.controls.branchField.valueChanges.subscribe((value) => {
      this.branch = value
    })
    // วันที่อนุมัติ
    this.agentassigntofcrForm.controls.approvedateField.valueChanges.subscribe((value) => {
      if ((value instanceof Date && isNaN(value.getTime()) || value == null)) {
        this.approve_date = ''
        // Handle the case where the date is invalid
      } else {
        if (value) {
          // Format the date
          const formattedDate = formatDate(value, 'dd/MM/yyyy', 'en-US'); // Adjust locale if needed

          // Assign the formatted date to approve_date
          this.approve_date = formattedDate;
        }
        // Handle the case where the date is valid
      }
    })


    // === get query params ===
    this.route.queryParams.subscribe(params => {

      this.ac_status = params['ac_status'];
      this.branch = params['branch'];
      this.approve_date = params['approve_date'];
      this.pageno = params['pageno'];
      this.sort_field = params['sort_field'];
      this.sort_type = params['sort_type'];

    });

  }

  ngOnInit(): void {
    // *** hide/show header bar by token value ***
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort_table;
    this.headerService.setShowHeader(false);
    this.fetchData()
  }

  fetchData(): void {


    // *** check queryparam ***

    const ac_statusfilter = this.ac_status ?? '';
    const branchfilter = this.branch ?? '';
    const approvedatefilter = this.approve_date ?? '';
    const pagenofilter = this.pageno ?? 1;
    const sortfieldfilter = this.sort_field ?? '';
    const sortfieldapifilter = this.sort_field ? this.getSortFieldParam(this.sort_field) : '';
    const sorttypefilter = this.sort_type ?? '';

    // *** check sort query contain *** 
    if (this.sort_type) {
      const sortfieldmap = this.getSortFieldValueParam(this.sort_field);
      const sorttypemap = this.getSortTypeParam(this.sort_type);
      this.sort_text_desc = `จัดเรียงตาม '${sortfieldmap}' : ${sorttypemap}`
    } else {
      this.sort_text_desc = ``
    }

    // ---=== set filter to form ====----
    this.agentassigntofcrForm.controls.ac_statusField.setValue(this.ac_status)
    this.agentassigntofcrForm.controls.branchField.setValue(this.branch)
    if (this.approve_date && typeof this.approve_date == 'string') {
      const dateToSet: Date = new Date(this.formatDate(this.approve_date));
      this.agentassigntofcrForm.controls.approvedateField.setValue(dateToSet)
    }

    /*.... set recent filter value (09/10/2023) ...*/
    this.recent_ac_status = this.ac_status ? this.ac_status : ''
    this.recent_branch = this.branch ? this.branch : ''
    this.recent_approve_date = this.approve_date ? this.approve_date : ''

    this.loadingService.showLoader();
    forkJoin([
      this.masterDataService.getbranch(),
      this.masterDataService.getAcStatusType(),
      this.oraclemenuService.checksendcarimagelist(
        {
          pageno: pagenofilter,
          branch: branchfilter,
          approve_date: approvedatefilter ? approvedatefilter : '',
          ac_status: ac_statusfilter,
          sort_field: sortfieldapifilter,
          sort_type: sorttypefilter
        }
      )
    ]).subscribe({
      next: ([resBranch, resAcProve, resData]) => {
        this.loadingService.hideLoader()

        /* ... mapping result branch master ... */
        if (resBranch.data.length !== 0) {
          this.branchData = resBranch.data
        }

        /* ... mapping AC status master ... */
        if (resAcProve.data.length !== 0) {
          this.AcStatusList = resAcProve.data

        }

        /* ... ResData ...*/
        if (resData.status !== 200) {
          this.snackbarfail(`เกิดข้อผิดพลาด : ${resData.message ? resData.message : 'No Return Msg.'}`)
        } else {
          if (resData.data.length !== 0) {

            this.containdata = true

            this.dataSource.data = resData.data
            this.dataList = resData.data
            this.pageLength = resData.rowcount
            this.pageSize = resData.pagesize
            this.paginator_table.pageIndex = this.pageno - 1
            this.total_count = resData.rowcount
            setTimeout(() => {
              if (this.sort_table) {
                this.sort_table.active = sortfieldfilter;
                this.sort_table.direction = sorttypefilter;
                this.sort_table._stateChanges.next();
              }
            });
          } else {

            // === ไม่พบข้อมูล ===
            this.dataSource.data = resData.data
            this.dataList = resData.data // tablet responsive (card)
            this.pageLength = resData.rowcount
            this.pageSize = resData.pagesize
            if (this.paginator_table) {
              this.paginator_table.pageIndex = 0
            }

            this.total_count = 0
            this.sort_text_desc = ''
            this.containdata = false
          }
        }
      }, error: (e) => {
        this.loadingService.hideLoader()
      }, complete: () => {
        console.log(`finish !!!`)
      }
    })
  }

  announceSortChange(sortState: Sort) {

    if (sortState.direction) {
      // this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
      this.sort_field = sortState.active
      this.sort_type = sortState.direction
      const sort_field_map = this.getSortFieldValueParam(sortState.active);
      const sort_type_map = this.getSortTypeParam(sortState.direction);
      this.sort_text_desc = `จัดเรียงตาม '${sort_field_map}' : ${sort_type_map}`
      this.triggerdatabysort(sortState.direction, sortState.active)

    } else {
      // this._liveAnnouncer.announce('Sorting cleared');
      this.sort_field = ''
      this.sort_type = ''
      this.sort_text_desc = ''
      this.triggerdatabysort('', '')
    }
  }

  triggerdatabysort(sort_type: string, sort_field: string) {

    this.router.navigate([], {
      relativeTo: this.route, queryParams: {
        pageno: this.pageno,
        ac_status: this.ac_status,
        approve_date: this.approve_date,
        branch: this.branch,
        sort_field: this.sort_field,
        sort_type: this.sort_type
      }
    })


    const sort_field_param = this.getSortFieldParam(this.sort_field);

    this.loadingService.showLoader()
    this.oraclemenuService.checksendcarimagelist({
      pageno: this.paginator_table.pageIndex + 1, // waiting bind value
      ac_status: this.recent_ac_status,
      branch: this.recent_branch,
      approve_date: this.recent_approve_date,
      sort_field: sort_field_param,
      sort_type: this.sort_type
    }).subscribe({
      next: (res) => {
        this.loadingService.hideLoader()
        if (res.data.length !== 0) {

          this.containdata = true

          this.dataList = res.data
          this.dataSource.data = res.data
          // this.paginator.pageIndex = this.pageno - 1
          // this.paginator.pageIndex = 0
          this.pageLength = res.rowcount
          this.pageSize = res.pagesize
          this.total_count = res.rowcount
        } else {
          this.dataSource.data = res.data
          this.dataList = res.data // tablet responsive (card)
          this.pageLength = res.rowcount
          this.pageSize = res.pagesize
          this.paginator_table.pageIndex = 0

          this.total_count = 0
          this.sort_text_desc = ''
          this.containdata = false
        }
      }, error: (e) => {
        this.loadingService.hideLoader()
        console.log(`error : ${e.message}`)
      }, complete: () => {
        // *** triggger complete ****
      }
    })

  }

  // **** pagination click *****
  onPaginationChange(event: PageEvent) {
    this.loadingService.showLoader()
    const previousPageIndex = this.paginator_table.pageIndex; // Store the previous page index
    let page = event.pageIndex;
    this.recent_page = page + 1

    const sort_field_param = this.getSortFieldParam(this.sort_field);

    this.router.navigate([], {
      relativeTo: this.route, queryParams: {
        pageno: page + 1,
        ac_status: this.ac_status,
        branch: this.branch,
        approve_date: this.approve_date,
        sort_field: this.sort_field,
        sort_type: this.sort_type
      }
    })

    this.oraclemenuService.checksendcarimagelist({
      pageno: page + 1,
      ac_status: this.recent_ac_status,
      branch: this.recent_branch,
      approve_date: this.approve_date,
      sort_field: sort_field_param,
      sort_type: this.sort_type
    }).subscribe({
      next: (res) => {
        this.loadingService.hideLoader();
        if (res.status !== 200) {
          this.snackbarfail(`เกิดข้อผิดพลาด : ${res.message ? res.message : 'No Return Msg.'}`)
        } else {
          if (res.data.length !== 0) {

            this.containdata = true
            this.dataSource.data = res.data
            this.dataList = res.data
            this.pageLength = res.rowcount
            this.pageSize = res.pagesize
            this.paginator_table.pageIndex = page
            this.total_count = res.rowcount
          } else {
            this.dataSource.data = res.data
            this.dataList = res.data // tablet responsive (card)
            this.pageLength = res.rowcount
            this.pageSize = res.pagesize
            this.paginator_table.pageIndex = 0

            this.total_count = 0
            this.sort_text_desc = ''
            this.containdata = false
          }
          // this.dataSource
        }
      }, error: (e) => {
        console.log(`error : ${e.message}`)
      }, complete: () => {
        // *** triggger complete ****
      }
    })
  }

  onsearch() {
    this.loadingService.showLoader()
    this.sort_text_desc = ''
    this.dataSource.filter = ''
    this.sort_field = ''
    this.sort_type = ''

    const ac_status = this.agentassigntofcrForm.controls.ac_statusField.value ? this.agentassigntofcrForm.controls.ac_statusField.value : ''
    const branch = this.agentassigntofcrForm.controls.branchField.value ? this.agentassigntofcrForm.controls.branchField.value : ''
    // const approve_date = (this.agentassigntofcrForm.controls.approvedateField.value && this.agentassigntofcrForm.controls.approvedateField.status !== 'INVALID') ? this.agentassigntofcrForm.controls.approvedateField.value : ''
    const approve_date = this.approve_date ? this.approve_date : ''

    this.recent_ac_status = ac_status
    this.recent_branch = branch
    this.recent_approve_date = approve_date ? approve_date : ''

    this.router.navigate([], {
      relativeTo: this.route, queryParams: {
        ac_status: this.ac_status,
        branch: this.branch,
        approve_date: approve_date,
        pageno: 1,
        sort_field: this.sort_field,
        sort_type: this.sort_type
      }
    })

    this.oraclemenuService.checksendcarimagelist({
      pageno: 1,

      ac_status: ac_status,
      branch: branch,
      approve_date: approve_date,
      sort_field: '',
      sort_type: ''
    }).subscribe({
      next: (res) => {
        this.loadingService.hideLoader();
        if (res.status !== 200) {
          this.snackbarfail(`เกิดข้อผิดพลาด : ${res.message ? res.message : 'No Return Msg.'}`)
        } else {
          if (res.data.length !== 0) {

            this.containdata = true
            this.dataSource.data = res.data
            this.dataList = res.data
            this.pageLength = res.rowcount
            this.pageSize = res.pagesize
            if (this.paginator_table) {
              this.paginator_table.pageIndex = 0
            }
            this.total_count = res.rowcount
            setTimeout(() => {
              if (this.sort_table) {
                this.sort_table.active = '';
                this.sort_table.direction = '';
                this.sort_table._stateChanges.next();
              }
            });
          } else {
            this.dataSource.data = res.data
            this.dataList = res.data // tablet responsive (card)
            this.pageLength = res.rowcount
            this.pageSize = res.pagesize
            if (this.paginator_table) {
              this.paginator_table.pageIndex = 0
            }

            this.total_count = 0
            this.sort_text_desc = ''
            this.containdata = false
          }
          // this.dataSource
        }
      }, error: (e) => {
        console.log(`error : ${e.message}`)
      }, complete: () => {
        // *** triggger complete ****
      }
    })
  }

  onclear() {
    this.loadingService.showLoader()

    this.recent_ac_status = ''
    this.recent_branch = ''
    this.recent_approve_date = ''
    this.sort_text_desc = ''
    this.dataSource.filter = '';
    this.agentassigntofcrForm.reset();
    this.oraclemenuService.checksendcarimagelist({
      pageno: 1,
      ac_status: '',
      branch: '',
      approve_date: '',
      sort_field: '',
      sort_type: ''
    }).subscribe({
      next: (results: IResChecksendcarimagelist) => {
        this.loadingService.hideLoader()

        if (results.status !== 200) {
          this.snackbarfail(`เกิดข้อผิดพลาด : ${results.message ? results.message : 'No Return Msg.'}`)
        } else {
          if (results.data.length !== 0) {
            this.containdata = true
            this.dataSource.data = results.data
            this.dataList = results.data // tablet responsive (card)
            this.pageLength = results.rowcount
            this.pageSize = results.pagesize
            if (this.paginator_table) {
              this.paginator_table.pageIndex = 0
            }
            this.total_count = results.rowcount
            // this.dataSource.sort = this.sort
            setTimeout(() => {
              if (this.sort_table) {
                this.sort_table.active = '';
                this.sort_table.direction = '';
                this.sort_table._stateChanges.next();
              }
            });
          } else {
            this.dataSource.data = results.data
            this.dataList = results.data // tablet responsive (card)
            this.total_count = 0
            this.pageLength = 0
            this.pageSize = 10
            if (this.paginator_table) {
              this.paginator_table.pageIndex = 0
            }
            this.sort_text_desc = ''
            this.containdata = false
          }
        }

      }, error: (err) => {
        this.dataList = []
        this.loadingService.hideLoader()
      }, complete: () => {
        this.loadingService.hideLoader()

      }
    })
  }

  openquotationpage(quo_key_app_id: string) {

    if (quo_key_app_id) {
      this.router.navigate(['quotation-examine'], {
        queryParams: {
          id: quo_key_app_id,
          pageno: this.pageno,
          ac_satus: this.ac_status,
          approve_date: this.approve_date
        }
      })
    } else {
      this.dialog.open(MainDialogComponent, {
        panelClass: `custom-dialog-container`,
        data: {
          header: ``,
          message: `ไม่พบค่าเลขสัญญาของรายการ`,
          button_name: `ตกลง`
        }
      })
    }
  }

  generateExcelFile() {
    this.loadingService.showLoader()

    const parambuild: IReqChecksendcarimagelistexcel = {
      ac_status: this.recent_ac_status ? this.recent_ac_status : '',
      approve_date: this.recent_approve_date ? this.recent_approve_date : '',
      branch: this.recent_branch ? this.recent_branch : '',
      sort_field: this.sort_field ? this.getSortFieldParam(this.sort_field) : '',
      sort_type: this.sort_type
    }
    this.oraclemenuService.checksendcarimagelistexcel(parambuild).subscribe({
      next: (res) => {
        if (res.status == 200) {
          /* ... success get data ... */
          const datares = res.data

          try {

            /* create worksheet */
            var ws = XLSX.utils.json_to_sheet(datares);
            /* create workbook and export */
            var wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
            XLSX.writeFile(wb, "ตรวจสอบรูปภาพส่งมอบรถเคส Tablet.xlsx");

            this.loadingService.hideLoader()
          } catch (e) {
            this.loadingService.hideLoader()
          }
        } else {
          /* ... fail to return data ... */
          this.loadingService.hideLoader()
        }
      }, error: (e) => {
        this.loadingService.hideLoader()
      }, complete: () => {
        /* do something here */
      }
    })

    /* ..................... */
  }

  getSortFieldParam(sortField: string): string {
    const sortFieldMap: { [key: string]: string } = {
      'idcardnum': 'idcard_num',
      'createdtime': 'created_time',
      'contractno': 'contract_no',
      'applicationnum': 'application_num',
      'createcontractdate': 'create_contract_date',
      'custname': 'cust_name',
      'branchname': 'branch_name',
      'checkername': 'checker_name',
      'acstatustext': 'ac_status_text',
      // Add more mappings if needed
    };

    return sortFieldMap[sortField] || '';
  }

  getSortFieldValueParam(sortField: string): string {
    const sortFieldMap: { [key: string]: string } = {
      'idcardnum': 'เลขที่บัตรประชาชน',
      'createdtime': 'วันที่สร้างรายการ',
      'contractno': 'เลขที่สัญญา',
      'applicationnum': 'เลขที่ใบสมัคร',
      'createcontractdate': 'วันที่สร้างสัญญา',
      'custname': 'ชื่อลูกค้า',
      'branchname': 'สาขา',
      'checkername': 'ชื่อ CK',
      'acstatustext': 'สถานะปิดบัญชี',
      // Add more mappings if needed
    };
    return sortFieldMap[sortField] || '';
  }

  getSortTypeParam(sortField: string): string {
    const sortFieldMap: { [key: string]: string } = {
      'asc': 'น้อยไปมาก',
      'desc': 'มากไปน้อย',
      // Add more mappings if needed
    };

    return sortFieldMap[sortField] || '';
  }

  onKeyDown(event: KeyboardEvent) {
    // Check if the key pressed is not the space bar
    if (event.keyCode !== 32) {
      event.preventDefault(); // Disable default behavior
    }
  }

  formatDate(inputDate: string): string {
    // Split the input date string by '/'
    const parts = inputDate.split('/');

    // Re-arrange the parts to DD/MM/YYYY format
    const formattedDate = `${parts[1]}/${parts[0]}/${parts[2]}`;

    return formattedDate;
  }

  clearDate(): void {
    this.agentassigntofcrForm.controls.approvedateField.setValue(null)
  }

}
