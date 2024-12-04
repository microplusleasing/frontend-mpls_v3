import { Component } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { LoadingService } from './service/loading.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: false
})
export class AppComponent  {
  showLoader$ = this.loadingService.loadingAction$;

  constructor(
    private loadingService: LoadingService,
    private ngxspinner: NgxSpinnerService
  ) {
    this.showLoader$.subscribe(value => {
      value ? this.ngxspinner.show() : this.ngxspinner.hide()
    })
  }


  title = 'frontend-mpls'
}
