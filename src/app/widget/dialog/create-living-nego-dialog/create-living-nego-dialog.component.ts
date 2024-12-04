import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { map } from 'rxjs';
import { IReqCreateaddressinfo } from 'src/app/interface/i-req-createaddressinfo';
import { IResMasterProvince } from 'src/app/interface/i-res-master-province';
import { BaseService } from 'src/app/service/base/base.service';
import { LoadingService } from 'src/app/service/loading.service';
import { MasterDataService } from 'src/app/service/master.service';
import { NegotiationService } from 'src/app/service/negotiation.service';

@Component({
    selector: 'app-create-living-nego-dialog',
    templateUrl: './create-living-nego-dialog.component.html',
    styleUrls: ['./create-living-nego-dialog.component.scss'],
    standalone: false
})
export class CreateLivingNegoDialogComponent extends BaseService implements OnInit {
  // === variable master variable ===
  masterProvince: IResMasterProvince = {} as IResMasterProvince

  address = new FormControl('', Validators.required)
  subDistrict = new FormControl('', Validators.required)
  district = new FormControl('', Validators.required)
  province_name = new FormControl<string | undefined>('', Validators.required)
  province_code = new FormControl<string | undefined>('', Validators.required) // not show
  postal_code = new FormControl('', [Validators.pattern('^[0-9]{5}$'), Validators.required])
  lalon = new FormControl('', Validators.required)
  latitude = new FormControl('', Validators.required)
  longitude = new FormControl('', Validators.required)

  living_address = this.fb.group({
    address: this.address,
    subDistrict: this.subDistrict,
    district: this.district,
    province_name: this.province_name,
    province_code: this.province_code,
    postal_code: this.postal_code,
    lalon: this.lalon,
    latitude: this.latitude,
    longitude: this.longitude
  })

  cardLayout = this.breakpointObserver
    .observe('(min-width: 800px)')
    .pipe(
      map(({ matches }) => {
        if (matches) {
          return {
            columns: 12,
            list: { maxcols: 12, cols6: 6, cols4: 4, cols3: 3, cols2: 2, col: 1 },
            card_width: '80%',
            rowHeight: 80
          };
        }

        return {
          columns: 1,
          list: { maxcols: 1, cols6: 1, cols4: 1, cols3: 1, cols2: 1, col: 1 },
          card_width: '90%',
          rowHeight: 80
        };
      })
    );

  constructor(
    private fb: FormBuilder,
    private loadingService: LoadingService,
    private masterDataService: MasterDataService,
    private negotiationService: NegotiationService,
    public override dialog: MatDialog,
    public override _snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<CreateLivingNegoDialogComponent>,
    private breakpointObserver: BreakpointObserver,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    super(dialog, _snackBar)

    dialogRef.backdropClick().subscribe(() => {
      // Close the dialog
      dialogRef.close({ create_status: false });
    })
  }

  ngOnInit(): void {

    console.log(`this is application no : ${this.data.application_no}`)
    this.masterDataService.getMasterProvince().subscribe({
      next: (res_province) => {
        this.masterProvince = res_province
      }, error: (e) => {
        console.log(`Error : ${e.message ? e.message : 'No return message'}`)
      }, complete: () => {
        console.log(`trigger complete get master Province`)
      }
    })

    this.living_address.controls.province_code.valueChanges.subscribe((value) => {
      // === set province name with province code ====
      const provSelect = this.masterProvince.data.find((res) => { return value === res.prov_code })
      this.living_address.controls.province_name.setValue(provSelect?.prov_name ? provSelect?.prov_name : '')
    })

    this.living_address.controls.lalon.valueChanges.subscribe((value) => {
      const lalonStr = value;
      if (lalonStr) {
        let rpString = lalonStr.replace(/[\(\)|\s]/g, "");
        let spitStr = rpString.split(",");
        if (spitStr.length > 1) {
          this.living_address.controls.latitude.setValue(spitStr[0])
          this.living_address.controls.longitude.setValue(spitStr[1])
        }
      }
    })

  }

  onClickCreateLivingPlaceBtn() {

    const datasend: IReqCreateaddressinfo = {
      applicationid: this.data.applicationid,
      address: this.living_address.controls.address.value ?? '',
      sub_district: this.living_address.controls.subDistrict.value ?? '',
      district: this.living_address.controls.district.value ?? '',
      province_code: this.living_address.controls.province_code.value ?? '',
      province_name: this.living_address.controls.province_name.value ?? '',
      postal_code: this.living_address.controls.postal_code.value ?? '',
      la: this.living_address.controls.latitude.value ?? '',
      lon: this.living_address.controls.longitude.value ?? '',
      lalon: this.living_address.controls.lalon.value ?? ''
    }

    this.negotiationService.createaddressInfo(datasend).subscribe({
      next: (res_createaddresss) => {
        console.log(`test : ${res_createaddresss}`)

        if (res_createaddresss.status === 200) {
          // route or do something (succeess) 
          this.dialogRef.close({
            create_status: true
          })
        } else {
          // === create living place fail ===
          this.snackbarfail(`${res_createaddresss.message}`)
        }
      }, error: (e) => {
        console.log(`Error : ${e.mesage ? e.message : 'No return message'}`)
      }, complete: () => {
        console.log(`trigger complete createaddressinfo !`)
      }
    })
  }

  opengooglemap() {
    const subdistrictValue = this.living_address.controls.subDistrict.value;
    const districtValue = this.living_address.controls.district.value;
    const postalCodeValue = this.living_address.controls.postal_code.value;

    let provinceValue = ''
    const provicneSelect = this.masterProvince.data.filter((items: ({ prov_code: string })) => {
      return items.prov_code = this.living_address.controls.province_code.value ? this.living_address.controls.province_code.value : ''
    })
    if (provicneSelect) {
      provinceValue = provicneSelect[0].prov_name
    }


    const url = `https://www.google.co.th/maps/search/${subdistrictValue}+${districtValue}+${provinceValue}+${postalCodeValue}`

    window.open(url, "_blank");
  }

}
