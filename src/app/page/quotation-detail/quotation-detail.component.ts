import { ChangeDetectorRef, Component, ErrorHandler, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BehaviorSubject, lastValueFrom, map, Observable, of } from 'rxjs';
import { BreakpointObserver } from '@angular/cdk/layout';
import { StepperOrientation, StepperSelectionEvent } from '@angular/cdk/stepper';
import { CizCardTabComponent } from '../quotation-tab/ciz-card-tab/ciz-card-tab.component';
import { LoadingService } from 'src/app/service/loading.service';
import { MasterDataService } from 'src/app/service/master.service';
import { DipchipService } from 'src/app/service/dipchip.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, ParamMap, Params, Router } from '@angular/router';
import { QuotationService } from 'src/app/service/quotation.service';
import { IResQuotationDetail } from 'src/app/interface/i-res-quotation-detail';
import { IReqFlagDipchip } from 'src/app/interface/i-req-flag-dipchip';
import { BaseService } from 'src/app/service/base/base.service';
import { MatDialog } from '@angular/material/dialog';
import { MainDialogComponent } from 'src/app/widget/dialog/main-dialog/main-dialog.component';
import { ProductDetailTabComponent } from '../quotation-tab/product-detail-tab/product-detail-tab.component';
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'app-quotation-detail',
  templateUrl: './quotation-detail.component.html',
  styleUrls: ['./quotation-detail.component.scss']
})
export class QuotationDetailComponent extends BaseService implements OnInit {

  // === lay out ===
  // ** stepper **
  stepperOrientation: Observable<StepperOrientation>;
  isLinear: boolean = true;

  quoForm: FormGroup;
  quotationkeyid: string;
  queryParams: ParamMap;
  quotationResult$: BehaviorSubject<IResQuotationDetail> = new BehaviorSubject<IResQuotationDetail>({} as IResQuotationDetail)


  @ViewChild(CizCardTabComponent) cizcardtab: CizCardTabComponent = new CizCardTabComponent(
    this.fb,
    this.cd,
    this.quotationService,
    this.loadingService,
    this.masterDataService,
    this.dipchipService,
    this.dialog,
    this._snackBar
  )

  @ViewChild(ProductDetailTabComponent) productdetailtab: ProductDetailTabComponent = new ProductDetailTabComponent(
    this.fb,
    this.cd,
    this.masterDataService,
    this.loadingService,
    this.dialog,
    this._snackBar
  )


  constructor(
    private fb: FormBuilder,
    private cd: ChangeDetectorRef,
    private router: Router,
    private breakpointObserver: BreakpointObserver,
    private loadingService: LoadingService,
    private masterDataService: MasterDataService,
    private dipchipService: DipchipService,
    private _snackBar: MatSnackBar,
    private actRoute: ActivatedRoute,
    private quotationService: QuotationService,
    private dialog: MatDialog
  ) {
    super()
    this.quoForm = this.fb.group({
      cizform: this.cizcardtab.cizForm,
      productForm: this.productdetailtab.productForm
    })

    this.stepperOrientation = this.breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));

    this.queryParams = this.actRoute.snapshot.queryParamMap;
    this.quotationkeyid = this.queryParams.get('id') ?? '';

    // this.quotationkeyid = `4e5bc31f-b243-4916-ac81-97d6e88953b1`
  }


  ngOnInit(): void {

    this.afteroninit()

  }

  async afteroninit() {
    // == clear dopa status ==
    this.quotationService.cleardopastatus()
    if (this.quotationkeyid) {
      // === set Observable quotation (quotationResult$) ===
      this.quotationResult$.next(await lastValueFrom(this.quotationService.getquotationbyid(this.quotationkeyid)))
      if (this.quotationResult$.value.data.length !== 0) {
        console.log(`this is quo id : ${this.quotationResult$.value.data[0].quo_key_app_id}`)

        this.quotationService.setstatusdopa(this.quotationResult$.value.data[0].quo_key_app_id)
        this.manageStatgequotation(this.quotationResult$.value)
      } else {

        this.dialog.open(MainDialogComponent, {
          panelClass: 'custom-dialog-container',
          data: {
            header: 'ไม่พบข้อมูลใบคำขอ',
            message: `ไม่พบใบคำขอนี้`,
            button_name: 'ปิด'
          }
        }).afterClosed().subscribe(result => {
          // === redirect to home page === 
          this.router.navigate(['/quotation-view']);
        });

      }
    } else {

    }

  }


  manageStatgequotation(quotationresult: IResQuotationDetail) {

  }



  changeStage($event: StepperSelectionEvent) {
    const stage = $event.selectedIndex

    switch (stage) {
      case 0:

        break;
      case 1: {

      }
        break;

      default:
        break;
    }

  }

  recieve_dipchipData($event: IReqFlagDipchip) {
    if ($event.status) {

      this.createquotationdopa('1', $event.uuid).then((dchk) => {
        if (dchk.status) {
          this.dipchipService.updatedipchipflag({
            token: '',
            username: this.usernamefordipchip,
            fromBody: $event.uuid
          }).subscribe(async (value) => {
            console.log(`flag success : ${JSON.stringify(value)}`)

            // === set router id ===
            if (value.number == 200) {
              this._snackBar.open('บันทึกฉบับร่างสำเร็จ', '', {
                horizontalPosition: 'end',
                verticalPosition: 'bottom',
                duration: 3000,
                panelClass: 'custom-snackbar-container'
              });

              const queryParams: Params = { id: dchk.refId };

              await this.router.navigate(
                [],
                {
                  relativeTo: this.actRoute,
                  queryParams: queryParams,
                  queryParamsHandling: 'merge', // remove to replace all query params by provided
                });
              // === add dopa status (11/11/2022) === 

              this.quotationService.setstatusdopa(dchk.refId)

              this.afteroninit();
            }
          })
        }
      })
    }
  }


  async createquotationdopa(type: string, dipchipuuid: string) {
    // == set default type ==
    // * 1: e-consent flow (verify dopa sucess)
    // * 2: offline (verify dopa fail)

    const ciz_form = this.cizcardtab.cizForm

    let quotationdata = {

      titleCode: ciz_form.get('titleCode')?.value ? ciz_form.get('titleCode')?.value : '',
      titleName: ciz_form.get('titleName')?.value ? ciz_form.get('titleName')?.value : '',
      firstName: ciz_form.get('firstName')?.value ? ciz_form.get('firstName')?.value : '',
      lastName: ciz_form.get('lastName')?.value ? ciz_form.get('lastName')?.value : '',
      gender: ciz_form.get('gender')?.value ? ciz_form.get('gender')?.value : '',
      citizenId: ciz_form.get('citizenId')?.value ? ciz_form.get('citizenId')?.value : '',
      birthDate: ciz_form.get('birthDate')?.value ? ciz_form.get('birthDate')?.value : '',
      issueDate: ciz_form.get('issueDate')?.value ? ciz_form.get('issueDate')?.value : '',
      expireDate: ciz_form.get('expireDate')?.value ? ciz_form.get('expireDate')?.value : '',
      issuePlace: ciz_form.get('issuePlace')?.value ? ciz_form.get('issuePlace')?.value : '',

      address: ciz_form.get('address')?.value ? ciz_form.get('address')?.value : '',
      subDistrict: ciz_form.get('subDistrict')?.value ? ciz_form.get('subDistrict')?.value : '',
      district: ciz_form.get('district')?.value ? ciz_form.get('district')?.value : '',
      provinceName: ciz_form.get('provinceName')?.value ? ciz_form.get('provinceName')?.value : '',
      provinceCode: ciz_form.get('provinceCode')?.value ? ciz_form.get('provinceCode')?.value : '', // information form (stamp via code , sync master data)
      postalCode: ciz_form.get('postalCode')?.value ? ciz_form.get('postalCode')?.value : '',
      cizcardImage: this.cizcardtab.cizCardImage_string ? this.cizcardtab.cizCardImage_string : '',
      dipchipuuid: dipchipuuid ? dipchipuuid : ''
    }

    const itemString = JSON.stringify(quotationdata)

    let fd = new FormData();
    fd.append('item', itemString)


    try {
      const resultCreateQEconsent = await lastValueFrom(this.quotationService.MPLS_dipchip(fd))

      return (resultCreateQEconsent.status == 200) ? { status: true, refId: resultCreateQEconsent.data[0].quo_key_app_id } : { status: false, refId: '' }

    } catch (e: any) {
      console.log(`error create e-consent quotation : ${e.message}`)
      return { status: false, refid: '' }
    }
  }
}
