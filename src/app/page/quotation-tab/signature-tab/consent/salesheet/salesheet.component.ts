import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { IResQuotationDetail } from 'src/app/interface/i-res-quotation-detail';
import { BaseService } from 'src/app/service/base/base.service';
import { ImageService } from 'src/app/service/image.service';
import { LoadingService } from 'src/app/service/loading.service';

@Component({
  selector: 'app-salesheet',
  standalone: false,
  
  templateUrl: './salesheet.component.html',
  styleUrl: './salesheet.component.scss'
})
export class SalesheetComponent extends BaseService implements OnInit {

  @Input() quotationReq = {} as Observable<IResQuotationDetail>
  quotationdatatemp: IResQuotationDetail = {} as IResQuotationDetail
  disableNextBtn: boolean = true
  @Output() salesheetValid = new EventEmitter<boolean>();

  @Output() someEvent = new EventEmitter<string>();

  salesheetacceptvalue = new FormControl<boolean>(false, Validators.requiredTrue)
  salesheetForm = this.fb.group({
    salesheetacceptvalue: this.salesheetacceptvalue
  })

  salesheetImagesUrl: string[] = [];
  loadimagesucces: boolean = false

  constructor(
    private fb: FormBuilder,
    private loadingService: LoadingService,
    private imageService: ImageService,
    public override dialog: MatDialog,
    public override _snackBar: MatSnackBar,
  ) {
    super(dialog, _snackBar)
  }

  ngOnInit(): void {

    this.quotationReq.subscribe({
      next: (result) => {
        this.quotationdatatemp = result

        this.imageService.MPLS_get_salesheet_image().subscribe({next: (res) => {
          
          if (res.data.length !== 0) {
            this.salesheetImagesUrl = res.data.map(image => this._arrayBufferToJpeg(image.file_data.data))
          }
        }, error: (e) => {

        }, complete: () => {
          
        }}).add(() => {
          /* ... แสดงรายการภาพหลังจากโหลดข้อมูลเสร็จ... */
          this.loadimagesucces = true
        })

        /* ... trigger value chage on field ... */

        if (this.quotationdatatemp.data) {
          const salesheetacceptvalue = this.quotationdatatemp.data[0].is_salesheet_accept_value

          if (salesheetacceptvalue !== null) {
            this.salesheetForm.controls.salesheetacceptvalue.setValue(true)
            this.salesheetForm.disable();
            this.disableNextBtn = false
            this.salesheetValid.emit(true)
          }
        }

        this.salesheetForm.valueChanges.subscribe((value) => {
          if (this.salesheetForm.valid) {
            this.disableNextBtn = false
            this.salesheetValid.emit(true)
          } else {
            this.disableNextBtn = true
            this.salesheetValid.emit(false)
          }
        })
      }
    })

  }

  callParent(): void {
    this.someEvent.next('onNextStep');
  }
}
