import { UserService } from 'src/app/service/auth/user.service';
import { IResBtwMrtaList } from 'src/app/interface/i-res-btw-mrta-list';
import { UntypedFormBuilder, UntypedFormGroup, UntypedFormControl, ValidatorFn, ValidationErrors, Validators } from '@angular/forms';
import { BtwService } from 'src/app/service/btw.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MainDialogComponent } from 'src/app/widget/dialog/main-dialog/main-dialog.component';
import { Router } from '@angular/router';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { BreakpointObserver } from '@angular/cdk/layout';
import { map } from 'rxjs';

export const atLeastOne = (validator: ValidatorFn, controls: string[] = []) => (
  group: UntypedFormGroup,
): ValidationErrors | null => {
  if (!controls) {
    controls = Object.keys(group.controls)
  }

  const hasAtLeastOne = group && group.controls && controls
    .some(k => !validator(group.controls[k]));

  return hasAtLeastOne ? null : {
    atLeastOne: true,
  };
};

@Component({
  selector: 'app-mrta-list',
  templateUrl: './mrta-list.component.html',
  styleUrls: ['./mrta-list.component.scss']
})
export class MrtaListComponent implements OnInit {

  rolecheck: boolean
  mrtaform: UntypedFormGroup
  headercolor: string
  textshow: string
  textrows: string
  showwarning: boolean



  displayedColumns: string[] = ['customerName', 'applicationNo', 'contractNo', 'btnClick'];
  dataListTemp: IResBtwMrtaList = {} as IResBtwMrtaList
  pageEvent: PageEvent = new PageEvent;
  pageLength: number = 0;
  pageSize: number = 0;
  pageno: number = 1;
  dataList: any;
  dataSource = new MatTableDataSource;
  paginator: MatPaginator = {} as MatPaginator;

  menu_id: string

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
    public dialogRef: MatDialogRef<MrtaListComponent>,
    public matdialog: MatDialog,
    private fb: UntypedFormBuilder,
    private btwService: BtwService,
    private router: Router,
    private breakpointObserver: BreakpointObserver
  ) {

    this.rolecheck = false
    this.menu_id = 'M108'
    this.headercolor = '#d9edf6'
    this.textshow = 'กรอกข้อมูลเบื้องต้นแล้วกดค้นหา'
    this.textrows = ''
    this.showwarning = false
    // this.mrtaform = this.fb.group
    //   ({
    //     customernameField: new FormControl(''),
    //     customersnameField: new FormControl(''),
    //     idcardnumField: new FormControl(''),
    //     application_noField: new FormControl(''),
    //     contractnoField: new FormControl('')
    //   }
    //   )
    this.mrtaform = this.fb.group
      ({
        customernameField: new UntypedFormControl('', [Validators.minLength(2)]),
        customersnameField: new UntypedFormControl('', [Validators.minLength(2)]),
        idcardnumField: new UntypedFormControl('', Validators.pattern(`^(?:[0-9]{13}|)$`)),
        application_noField: new UntypedFormControl(''),
        contractnoField: new UntypedFormControl('')
      },
        {
          validator: atLeastOne(Validators.required,
            ['customernameField', 'idcardnumField', 'application_noField', 'contractnoField', 'customersnameField']
          )
        }
      )
  }

  async ngOnInit() {
    const rolepermis = await this.btwService.checkmenuidpermission(this.menu_id)
    if (!rolepermis) {
      this.showwarning = true
      this.textrows = 'คุณไม่มีสิทธิ์ในการเข้าถึงหน้าขายประกัน MRTA'
    } else {
      this.rolecheck = true
    }
  }

  onsearch() {

    const customernamevalue = this.mrtaform.get('customernameField')?.value
    const customersnamevalue = this.mrtaform.get('customersnameField')?.value
    const idcardnumvalue = this.mrtaform.get('idcardnumField')?.value
    const application_novalue = this.mrtaform.get('application_noField')?.value
    const contractnoFieldvalue = this.mrtaform.get('contractnoField')?.value

    this.btwService.getsearchmrta({
      customername: customernamevalue,
      customersname: customersnamevalue,
      idcardnum: idcardnumvalue,
      application_no: application_novalue,
      contractno: contractnoFieldvalue,
      pageno: 1
    }).subscribe({
      next: (result) => {
        if (result.data.length !== 0) {
          this.dataListTemp = result

          this.dataList = this.dataListTemp
          this.dataSource.data = (result.data) as any
          this.paginator.pageIndex = 0
          this.pageLength = this.dataListTemp.rowcount
          this.pageSize = this.dataListTemp.pagesize
        } else {
          // === no data avalible === 
          this.dataSource.data = []
          this.textshow = 'ไม่พบเจอรายการตามเงื่อนไขที่กำหนด'
        }
      }, error: (e) => {
        // === handle error ===
        this.dataSource.data = []
        this.textshow = 'ไม่พบเจอรายการตามเงื่อนไขที่กำหนด'
      }
    })
  }

  onclickcustomer(application_num: string) {
    this.router.navigate(['/mrta-info'], {
      queryParams: {
        id: application_num,
      }
    })
    this.dialogRef.close();
  }

  onPaginationChange(event: PageEvent) {

    let page = event.pageIndex;
    let size = event.pageSize;

    page = page + 1;
    const customernamevalue = this.mrtaform.get('customernameField')?.value
    const customersnamevalue = this.mrtaform.get('customersnameField')?.value
    const idcardnumvalue = this.mrtaform.get('idcardnumField')?.value
    const application_novalue = this.mrtaform.get('application_noField')?.value
    const contractnoFieldvalue = this.mrtaform.get('contractnoField')?.value

    this.btwService.getsearchmrta({
      customername: customernamevalue,
      customersname: customersnamevalue,
      idcardnum: idcardnumvalue,
      application_no: application_novalue,
      contractno: contractnoFieldvalue,
      pageno: page
    }).subscribe({
      next: (result) => {
        if (result.data.length !== 0) {

          this.dataListTemp = result
          // === add index to client page === 
          this.dataList = this.dataListTemp
          this.dataSource.data = (result.data) as any
          this.paginator.pageIndex = this.pageno - 1
          this.pageLength = this.dataListTemp.rowcount
          this.pageSize = this.dataListTemp.pagesize
        } else {
          // === no data avalible === 
          this.dataSource.data = []
          this.textshow = 'ไม่พบเจอรายการตามเงื่อนไขที่กำหนด'
        }
      }, error: (e) => {
        // === handle error ===
        this.dataSource.data = []
        this.textshow = 'ไม่พบเจอรายการตามเงื่อนไขที่กำหนด'
      }
    })
  }

  closedialogclick() {
    this.dialogRef.close()
  }

}
