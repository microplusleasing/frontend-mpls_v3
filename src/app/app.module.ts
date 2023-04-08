import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule, DatePipe } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormGroupDirective, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './module/material/material.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgxSpinnerModule } from "ngx-spinner";
import { QuotationViewComponent } from './page/quotation-view/quotation-view.component';
import { QuotationDetailComponent } from './page/quotation-detail/quotation-detail.component';
import { HeaderComponent } from './widget/header/header.component';
import { MainDialogComponent } from './widget/dialog/main-dialog/main-dialog.component';
import { LoginComponent } from './page/login/login.component';
import { InformationDialogComponent } from './widget/dialog/information-dialog/information-dialog.component';
import { JwtInterceptor } from './interceptor/jwt.interceptor';
import { DashboardComponent } from './page/dashboard/dashboard.component';
import { NotFoundComponent } from './page/not-found/not-found.component';
import { CizCardTabComponent } from './page/quotation-tab/ciz-card-tab/ciz-card-tab.component';
import { ProductDetailTabComponent } from './page/quotation-tab/product-detail-tab/product-detail-tab.component';
import { BasicSnackbarComponent } from './widget/snackbar/basic-snackbar/basic-snackbar.component';
import { OtpVerifyDialogComponent } from './widget/dialog/otp-verify-dialog/otp-verify-dialog.component';
import { NgOtpInputModule } from  'ng-otp-input';
import { ImageAttachComponent } from './page/quotation-tab/image-attach/image-attach.component';
import { OtpEconsentComponent } from './widget/dialog/otp-econsent/otp-econsent.component';
import { CareerAndPurposeComponent } from './page/quotation-tab/career-and-purpose/career-and-purpose.component';
import { ThaidateformatDirective } from './directive/thaidateformat.directive';
import { FaceValidDialogComponent } from './widget/dialog/face-valid-dialog/face-valid-dialog.component';
import { ConfirmDialogComponent } from './widget/dialog/confirm-dialog/confirm-dialog.component';
import { ImageDialogComponent } from './widget/dialog/image-dialog/image-dialog.component';
import { ConsentTabComponent } from './page/quotation-tab/signature-tab/consent-tab.component';
import { PersonalDisclosureConsentComponent } from './page/quotation-tab/signature-tab/consent/personal-disclosure-consent/personal-disclosure-consent.component';
import { EPaperConsentComponent } from './page/quotation-tab/signature-tab/consent/e-paper-consent/e-paper-consent.component';
import { SignatureConsentComponent } from './page/quotation-tab/signature-tab/consent/signature-consent/signature-consent.component';
import { SendCarTabComponent } from './page/quotation-tab/send-car-tab/send-car-tab.component';
import { LoyaltyConsentComponent } from './page/quotation-tab/signature-tab/consent/loyalty-consent/loyalty-consent.component';
import { MrtaProductComponent } from './page/view/mrta-product/mrta-product.component';
import { QrBarcodeMrtaComponent } from './page/view/qr-barcode-mrta/qr-barcode-mrta.component';
import { AdvancePaymentQrCodeComponent } from './page/view/advance-payment-qr-code/advance-payment-qr-code.component';
import { TotalLossQrCodeComponent } from './page/view/total-loss-qr-code/total-loss-qr-code.component';
import { ViewsignComponent } from './page/view/viewsign/viewsign.component';
import { BypassSignatureComponent } from './page/bypass-signature/bypass-signature.component';
import { MrtaListComponent } from './page/view/mrta/mrta-list/mrta-list.component';
import { CreditDisclosureConsentComponent } from './page/quotation-tab/signature-tab/consent/credit-disclosure-consent/credit-disclosure-consent.component';
import { FinishQuotationDialogComponent } from './widget/dialog/finish-quotation-dialog/finish-quotation-dialog.component';
import { MrtaInfoComponent } from './page/view/mrta/mrta-info/mrta-info.component';
import { CollectorViewComponent } from './page/collector/collector-view/collector-view.component';
import { CollectorDetailComponent } from './page/collector/collector-detail/collector-detail.component';
import { BackwardBarComponent } from './widget/backward-bar/backward-bar.component';
import { CreateLivingNegoDialogComponent } from './widget/dialog/create-living-nego-dialog/create-living-nego-dialog.component';
import { WaringEconsentDialogComponent } from './widget/dialog/waring-econsent-dialog/waring-econsent-dialog.component';
import { SecondhandCarViewDialogComponent } from './widget/dialog/secondhand-car-view-dialog/secondhand-car-view-dialog.component';
import { SecondhandCarAttachImageDialogComponent } from './widget/dialog/secondhand-car-attach-image-dialog/secondhand-car-attach-image-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    QuotationViewComponent,
    QuotationDetailComponent,
    HeaderComponent,
    MainDialogComponent,
    LoginComponent,
    InformationDialogComponent,
    DashboardComponent,
    NotFoundComponent,
    CizCardTabComponent,
    ProductDetailTabComponent,
    BasicSnackbarComponent,
    OtpVerifyDialogComponent,
    ImageAttachComponent,
    OtpEconsentComponent,
    CareerAndPurposeComponent,
    ThaidateformatDirective,
    FaceValidDialogComponent,
    ConfirmDialogComponent,
    ImageDialogComponent,
    ConsentTabComponent,
    PersonalDisclosureConsentComponent,
    EPaperConsentComponent,
    SignatureConsentComponent,
    SendCarTabComponent,
    LoyaltyConsentComponent,
    MrtaProductComponent,
    QrBarcodeMrtaComponent,
    AdvancePaymentQrCodeComponent,
    TotalLossQrCodeComponent,
    ViewsignComponent,
    BypassSignatureComponent,
    MrtaListComponent,
    CreditDisclosureConsentComponent,
    FinishQuotationDialogComponent,
    MrtaInfoComponent,
    CollectorViewComponent,
    CollectorDetailComponent,
    BackwardBarComponent,
    CreateLivingNegoDialogComponent,
    WaringEconsentDialogComponent,
    SecondhandCarViewDialogComponent,
    SecondhandCarAttachImageDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    HttpClientModule,
    NgxSpinnerModule,
    NgOtpInputModule
  ],
  providers: [
    DatePipe,
    FormGroupDirective, 
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
