import { BreakpointObserver } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NavigationEnd, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { IResQuotationDetail } from 'src/app/interface/i-res-quotation-detail';
import { BaseService } from 'src/app/service/base/base.service';
import { LoadingService } from 'src/app/service/loading.service';
import { EPaperConsentComponent } from './consent/e-paper-consent/e-paper-consent.component';
import { PersonalDisclosureConsentComponent } from './consent/personal-disclosure-consent/personal-disclosure-consent.component';
import { SignatureConsentComponent } from './consent/signature-consent/signature-consent.component';

@Component({
  selector: 'app-consent-tab',
  templateUrl: './consent-tab.component.html',
  styleUrls: ['./consent-tab.component.scss']
})
export class ConsentTabComponent extends BaseService implements OnInit {

  @Input() quotationReq = {} as Observable<IResQuotationDetail>;
  @Output() emitcreateconsentbtn = new EventEmitter();

  epaperTabDisable: boolean = true;
  signatureTabDisable: boolean = true;
  consentTabLabel = ['Consent First', 'Consent Second', 'Consent Third'];
  consentTabIndex: number = 0;

  @ViewChild(PersonalDisclosureConsentComponent) p_d_econsenttab: PersonalDisclosureConsentComponent = new PersonalDisclosureConsentComponent(
    this.fb,
    this.loadingService,
    this.dialog,
    this._snackBar,
    this.breakpointObserver
  )

  @ViewChild(EPaperConsentComponent) e_paper_econsenttab: EPaperConsentComponent = new EPaperConsentComponent(
    this.fb,
    this.loadingService,
    this.dialog,
    this._snackBar,
    this.breakpointObserver
  )

  @ViewChild(SignatureConsentComponent) signaturetab: SignatureConsentComponent = new SignatureConsentComponent(
    this.fb,
    this.cdRef,
    this.loadingService,
    this.dialog,
    this._snackBar,
    this.breakpointObserver
  )

  constructor(
    private router: Router,
    private cdRef: ChangeDetectorRef,
    private fb: FormBuilder,
    private loadingService: LoadingService,
    public override dialog: MatDialog,
    public override _snackBar: MatSnackBar,
    private breakpointObserver: BreakpointObserver
  ) {
    super(dialog, _snackBar)
  }

  ngOnInit(): void {
  }

  onNextStep() {
    const countConsent = this.consentTabLabel.length;
    // === unlock next consent ==== 
    switch (this.consentTabIndex) {
      case (0): {
        // อยู่หน้าแรก (PDPA)
      }
        break;
      case (1): {
        // อยู่แถบที่ 2 (ยินยอมรับเอกสารอิเล็กทรอนิกส์)
      }
        break;
      case (2): {
        // อยู่แถบที่ 3 (ลงลายมือชื่อใบสมัคร)
      }
        break;
    }

    this.consentTabIndex = (this.consentTabIndex + 1) % countConsent;
    this.setMatTabGroup();
  }

  setMatTabGroup() {
    this.router.events.subscribe((ev: any) => {
      if (ev instanceof NavigationEnd) {
        window.scrollTo(0, 0);
      }
    });
    this.scrollTo();
  }

  scrollTo(): void {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }

  recieve_personaldisclosurevalid($event: boolean) {
    this.epaperTabDisable = $event ? false : true;
  }

  recieve_epaperconsentvalid($event: boolean) {
    this.signatureTabDisable = $event ? false : true;
  }

  createConsentBtn() {
    this.emitcreateconsentbtn.emit(true)
  }

}
