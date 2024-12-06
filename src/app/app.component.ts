import { Component } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { LoadingService } from './service/loading.service';
import { HeaderService } from './service/header.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: false
})
export class AppComponent  {
  showLoader$ = this.loadingService.loadingAction$;
  showHeader = true;
  constructor(
    private loadingService: LoadingService,
    private ngxspinner: NgxSpinnerService,
    private headerService: HeaderService
  ) {
    this.showLoader$.subscribe(value => {
      value ? this.ngxspinner.show() : this.ngxspinner.hide()
    })
    this.headerService.showHeader$.subscribe(value => {
      this.showHeader = value;
    });
  }


  title = 'frontend-mpls'
}
