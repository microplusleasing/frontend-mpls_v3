import { QuotationDetailComponent } from './page/quotation-detail/quotation-detail.component';
import { QuotationViewComponent } from './page/quotation-view/quotation-view.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './page/login/login.component';
import { AuthGuardService } from './_helper/auth.guard';
import { DashboardComponent } from './page/dashboard/dashboard.component';
import { NotFoundComponent } from './page/not-found/not-found.component';
import { ViewsignComponent } from './page/view/viewsign/viewsign.component';
import { BypassSignatureComponent } from './page/bypass-signature/bypass-signature.component';
import { MrtaInfoComponent } from './page/view/mrta/mrta-info/mrta-info.component';
import { CollectorViewComponent } from './page/collector/collector-view/collector-view.component';
import { CollectorDetailComponent } from './page/collector/collector-detail/collector-detail.component';
import { ViewCarAttachComponent } from './page/view/view-car-attach/view-car-attach.component';

const routes: Routes = [
  { path: '', component: DashboardComponent, canActivate: [AuthGuardService] },
  { path: 'login', component: LoginComponent },
  { path: 'quotation-view', component: QuotationViewComponent, canActivate: [AuthGuardService] },
  { path: 'quotation-detail', component: QuotationDetailComponent, canActivate: [AuthGuardService] },
  { path: 'quotation-detail/:id', component: QuotationDetailComponent, canActivate: [AuthGuardService] },
  { path: 'bypass', component: BypassSignatureComponent, canActivate: [AuthGuardService] },
  { path: 'bypass/:id', component: BypassSignatureComponent, canActivate: [AuthGuardService] },
  { path: 'mrta-info', component: MrtaInfoComponent, canActivate: [AuthGuardService]},
  { path: 'mrta-info/:id', component: MrtaInfoComponent, canActivate: [AuthGuardService] },
  { path: 'collector-view', component: CollectorViewComponent, canActivate: [AuthGuardService] },
  { path: 'collector-detail', component: CollectorDetailComponent, canActivate: [AuthGuardService] },
  { path: 'collector-detail/:id', component: CollectorDetailComponent, canActivate: [AuthGuardService] },
  { path: 'viewsign', component: ViewsignComponent }, 
  { path: 'viewimg_used_moto', component: ViewCarAttachComponent }, 
  { path: 'viewimg_used_moto/:application_num', component: ViewCarAttachComponent }, 
  { path: 'notfound', component: NotFoundComponent }, 
  { path: '**', redirectTo: 'notfound', pathMatch: 'full' } 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)], 
  exports: [RouterModule] 
})
export class AppRoutingModule { }
