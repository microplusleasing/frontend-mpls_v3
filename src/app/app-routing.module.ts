import { QuotationDetailComponent } from './page/quotation-detail/quotation-detail.component';
import { QuotationViewComponent } from './page/quotation-view/quotation-view.component';
import { MainComponent } from './page/main/main.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './page/login/login.component';
import { AuthGuardService } from './_helper/auth.guard';
import { DashboardComponent } from './page/dashboard/dashboard.component';

const routes: Routes = [
  { path:'', component: DashboardComponent, canActivate: [AuthGuardService]},
  { path:'login', component: LoginComponent },
  { path:'quotation-view', component: QuotationViewComponent, canActivate: [AuthGuardService]},
  { path:'quotation-detail', component: QuotationDetailComponent, canActivate: [AuthGuardService]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
