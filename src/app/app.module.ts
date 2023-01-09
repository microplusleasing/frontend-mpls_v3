import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

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
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    HttpClientModule,
    NgxSpinnerModule,
    NgOtpInputModule
  ],
  providers: [
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
