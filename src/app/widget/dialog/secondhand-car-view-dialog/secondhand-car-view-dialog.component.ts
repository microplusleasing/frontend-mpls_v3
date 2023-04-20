import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { map } from 'rxjs';
import { IDialogSecondHandCarView } from 'src/app/interface/i-dialog-second-hand-car-view';
import { IResSecondHandCarView, IResSecondHandCarViewData } from 'src/app/interface/i-res-second-hand-car-view';
import { LoadingService } from 'src/app/service/loading.service';
import { MasterDataService } from 'src/app/service/master.service';

@Component({
  selector: 'app-secondhand-car-view-dialog',
  templateUrl: './secondhand-car-view-dialog.component.html',
  styleUrls: ['./secondhand-car-view-dialog.component.scss']
})
export class SecondhandCarViewDialogComponent implements OnInit {


  dealer_code_filter: string = '';
  headercolor: string = '#d9edf6'
  dealer_code = new FormControl<string>('', Validators.required)
  car_reg_no = new FormControl<string>('', Validators.required)

  textshow: string = 'กรอกข้อมูลเบื้องต้นแล้วกดค้นหา'
  dataSource = new MatTableDataSource;
  paginator: MatPaginator = {} as MatPaginator;
  displayedColumns: string[] = ['regno', 'provname', 'brandname', 'modelname', 'color', 'cc'];
  dataListTemp: IResSecondHandCarView = {} as IResSecondHandCarView
  pageLength: number = 0;
  pageSize: number = 0;
  pageno: number = 1;
  dataList: any;
  selectedRowIndex: number = -1; // initialize to -1 to indicate no row is selected
  selectedCarDetail: IResSecondHandCarViewData = {} as IResSecondHandCarViewData
  confirmbtn: boolean = false;

  secondhandcarForm = this.fb.group({
    dealer_code: this.dealer_code,
    car_reg_no: this.car_reg_no
  })

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
    public fb: FormBuilder,
    public loadingService: LoadingService,
    public masterService: MasterDataService,
    private breakpointObserver: BreakpointObserver,
    public dialogRef: MatDialogRef<SecondhandCarViewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IDialogSecondHandCarView,
  ) { }

  ngOnInit(): void {
    this.dealer_code_filter = this.data.dealer_code
    this.secondhandcarForm.controls.dealer_code.setValue(this.data.dealer_code)
  }

  onSearchSecondHandCar() {
    this.loadingService.showLoader()
    this.dataSource.data = []
    this.selectedRowIndex = -1
    this.confirmbtn = false

    this.masterService.MPLS_getsecondhandcarbyreg(
      this.secondhandcarForm.controls.car_reg_no.value ? this.secondhandcarForm.controls.car_reg_no.value : '',
      this.secondhandcarForm.controls.dealer_code.value ? this.secondhandcarForm.controls.dealer_code.value : '',
      1,
      this.data.quo_key_app_id ? this.data.quo_key_app_id : ''
    ).subscribe({
      next: (res_second_hand_car) => {
        this.loadingService.hideLoader()
        if (res_second_hand_car.data.length !== 0) {

          this.dataListTemp = res_second_hand_car
          this.dataList = this.dataListTemp
          this.dataSource.data = (res_second_hand_car.data) as IResSecondHandCarViewData[]
          this.paginator.pageIndex = 0
          this.pageLength = this.dataListTemp.rowcount
          this.pageSize = this.dataListTemp.pagesize
        } else {
          // === no data avalible === 
          this.dataSource.data = []
          this.textshow = 'ไม่พบเจอรายการตามเงื่อนไขที่กำหนด'
        }
      }, error: (e) => {
        this.loadingService.hideLoader()
        this.dataSource.data = []

      }, complete: () => {
        this.loadingService.hideLoader()

      }
    })
  }

  onPaginationChange(event: PageEvent) {

    let page = event.pageIndex;
    let size = event.pageSize;

    page = page + 1;
    const car_reg_value = this.secondhandcarForm.controls.car_reg_no.value ? this.secondhandcarForm.controls.car_reg_no.value : ''
    const dealer_code_value = this.secondhandcarForm.controls.dealer_code.value ? this.secondhandcarForm.controls.dealer_code.value : ''

    this.masterService.MPLS_getsecondhandcarbyreg(
      car_reg_value,
      dealer_code_value,
      page,
      this.data.quo_key_app_id ? this.data.quo_key_app_id : ''
    ).pipe(
      map((result) => {
        if (result.data.length !== 0) {

          this.dataListTemp = result
          // === add index to client page === 
          this.dataList = this.dataListTemp
          this.dataSource.data = (result.data) as IResSecondHandCarViewData[]
          this.paginator.pageIndex = page - 1
          this.pageLength = this.dataListTemp.rowcount
          this.pageSize = this.dataListTemp.pagesize
        } else {
          // === no data avalible === 
          this.dataSource.data = []
          this.textshow = 'ไม่พบเจอรายการตามเงื่อนไขที่กำหนด'
        }
      })).subscribe({
        next: (result) => {
          this.loadingService.hideLoader()
        }, error: (e) => {
          // === handle error ===
          this.loadingService.hideLoader()
          this.dataSource.data = []
          this.textshow = 'ไม่พบเจอรายการตามเงื่อนไขที่กำหนด'
        }, complete: () => {
          this.loadingService.hideLoader()
        }
      })
  }

  selectRows(row: IResSecondHandCarViewData) {
    this.selectedRowIndex = row.line_number;
    this.selectedCarDetail = row
    this.confirmbtn = true
    // enable/disable button based on selected rows length
  }

  confirmCarSeclect() {

    // *** add check secondhand car select on this step *** (12/04/2023)

    if (this.selectedCarDetail.contract_no) {
      // *** parse data back to product page in quotation mpls ****
      this.dialogRef.close(this.selectedCarDetail)
    } else {
      // handle error
    }
  }

}
