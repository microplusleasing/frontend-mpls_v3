
import { BreakpointObserver } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fromEvent, Observable, of } from 'rxjs';
import SignaturePad from 'signature_pad';
import { IResQuotationDetail } from 'src/app/interface/i-res-quotation-detail';
import { IUserToken } from 'src/app/interface/i-user-token';
import { BaseService } from 'src/app/service/base/base.service';
import { LoadingService } from 'src/app/service/loading.service';

@Component({
  selector: 'app-signature-consent',
  templateUrl: './signature-consent.component.html',
  styleUrls: ['./signature-consent.component.scss']
})
export class SignatureConsentComponent extends BaseService implements OnInit {


  @Input() quotationReq = {} as Observable<IResQuotationDetail>;
  quotationdatatemp: IResQuotationDetail = {} as IResQuotationDetail
  imagesigsrc: Promise<string> | null = null;
  imagewitnesssrc: Promise<string> | null = null;
  show_pad: boolean = true
  show_pic: boolean = false

  title$: Observable<string> = of('')
  fname$: Observable<string> = of('')
  lname$: Observable<string> = of('')
  birthdate$: Observable<string> = of('')
  cizid$: Observable<string> = of('')
  phoneno$: Observable<string> = of('')
  email$: Observable<string> = of('')
  fullname$: Observable<string> = of('')

  checkerfullname$: Observable<string> = of('')

  private signaturePad?: SignaturePad;
  private signaturePad2?: SignaturePad;
  @ViewChild('signaturePad', { static: true }) canvas?: ElementRef;
  @ViewChild('signaturePad2', { static: true }) canvas2?: ElementRef;

  customerSignature = new FormControl<string | undefined>('', Validators.required)
  witnessSignature = new FormControl<string | undefined>('', Validators.required)
    // *** check signature verify ***
  verifySignature = new FormControl<boolean>(false, Validators.requiredTrue)

    signatureForm = this.fb.group({
      customerSignature: this.customerSignature,
      witnessSignature: this.witnessSignature,
      verifySignature: this.verifySignature
    })

  constructor(
    private fb: FormBuilder,
    private cdRef: ChangeDetectorRef,
    private loadingService: LoadingService,
    public override dialog: MatDialog,
    public override _snackBar: MatSnackBar,
    private breakpointObserver: BreakpointObserver
  ) {
    super(dialog, _snackBar)
    
    // === stamp verifySignature form true when all other form valid (06/02/2023) ===
    this.signatureForm.controls.customerSignature.valueChanges.subscribe((result) => {
      this.stampformsignaturevalid()
    })

    this.signatureForm.controls.witnessSignature.valueChanges.subscribe((result) => {
      this.stampformsignaturevalid()
    })
  }

  ngOnInit(): void {

    // this.loadingService.showLoader();

    this.quotationReq.subscribe({
      next: (resquo) => {
        this.quotationdatatemp = resquo

        // === get user session === 
        const userdata = localStorage.getItem('currentUser')

        if (userdata) {
          const userdataObj = (JSON.parse(userdata) as IUserToken).data;

          this.checkerfullname$ = of(userdataObj.FULLNAME ? userdataObj.FULLNAME : '')
        }

        // === handle page where resquo load === 
        if (this.quotationdatatemp.data) {

          this.title$ = of(resquo.data[0].title_name)
          this.fname$ = of(resquo.data[0].first_name)
          this.lname$ = of(resquo.data[0].last_name)
          this.birthdate$ = of(resquo.data[0].birth_date_text_th)
          this.cizid$ = of(resquo.data[0].idcard_num)
          this.phoneno$ = of(resquo.data[0].phone_number)
          this.email$ = of(resquo.data[0].email)
          this.fullname$ = of(resquo.data[0].first_name + ' ' + resquo.data[0].last_name)
          // === value Change ===

          // === set image signature and hide pad ===
          if (this.quotationdatatemp.data[0].cs_app_key_id !== '' && this.quotationdatatemp.data[0].cs_app_key_id !== null) {

            // === set signature pad hide and show pic === 
            this.show_pad = false
            this.show_pic = true
            this.cdRef.detectChanges()
            const sigimagequotation = this.quotationdatatemp.data[0].cs_signature_image
            this.imagesigsrc = this.getUrlImage(sigimagequotation).then((result) => {
              return result;
            }, (reject) => {
              return reject;
            })
            const witnessimagequotation = this.quotationdatatemp.data[0].cs_witness_image
            this.imagewitnesssrc = this.getUrlImage(witnessimagequotation).then((result) => {
              return result;
            }, (reject) => {
              return reject;
            })
          }
        }



      }, error: (err) => {
        // this.loadingService.hideLoader()
        this.snackbarfail(`${err.message}`)
      }, complete: () => {
        // this.loadingService.hideLoader();
      }
    })
  }

  ngAfterViewInit() {
    this.signaturePad = new SignaturePad(this.canvas?.nativeElement);
    this.signaturePad2 = new SignaturePad(this.canvas2?.nativeElement);


    this.signaturePad?.addEventListener("endStroke", () => {
      this.signatureForm.controls.customerSignature.setValue(this.signaturePad?.toDataURL())
      console.log(`log : ${this.signatureForm.valid}`)
    })


    this.signaturePad2?.addEventListener("endStroke", () => {
      this.signatureForm.controls.witnessSignature.setValue(this.signaturePad2?.toDataURL())
    })

    // *** EVENT LIST OF SIGNATURE PAD (4.1.4) ***
    // beginStroke
    // Triggered before stroke begins.
    // endStroke
    // Triggered after stroke ends.
    // beforeUpdateStroke
    // Triggered before stroke update.
    // afterUpdateStroke
    // Triggered after stroke update.
  }

  ngOnDestroy() {
    this.signaturePad?.off();
    this.signaturePad2?.off();
  }

  clearCanvas() {
    this.signaturePad?.clear();
    this.signatureForm.controls.customerSignature.setValue('')
  }
  clearCanvas2() {
    this.signaturePad2?.clear();
    this.signatureForm.controls.witnessSignature.setValue('')
  }

  stampformsignaturevalid() {
    if(this.signatureForm.controls.customerSignature.valid && this.signatureForm.controls.witnessSignature.valid) {
      this.signatureForm.controls.verifySignature.setValue(true)
    } else {
      this.signatureForm.controls.verifySignature.setValue(false)
    }
  }

}
