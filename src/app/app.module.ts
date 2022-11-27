import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormGroupDirective, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './module/material/material.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgxSpinnerModule } from "ngx-spinner";
import { MainComponent } from './page/main/main.component';
import { QuotationViewComponent } from './page/quotation-view/quotation-view.component';
import { QuotationDetailComponent } from './page/quotation-detail/quotation-detail.component';
import { HeaderComponent } from './widget/header/header.component';
import { MainDialogComponent } from './widget/dialog/main-dialog/main-dialog.component';
import { LoginComponent } from './page/login/login.component';
import { InformationDialogComponent } from './widget/dialog/information-dialog/information-dialog.component';
import { JwtInterceptor } from './interceptor/jwt.interceptor';
import { LoadingInterceptor } from './interceptor/loading.interceptor';
import { DashboardComponent } from './page/dashboard/dashboard.component';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    QuotationViewComponent,
    QuotationDetailComponent,
    HeaderComponent,
    MainDialogComponent,
    LoginComponent,
    InformationDialogComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    HttpClientModule,
    NgxSpinnerModule
  ],
  providers: [
    FormGroupDirective, 
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
