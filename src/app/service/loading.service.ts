import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class  LoadingService {
  private loadingSubject = new Subject<boolean>();
  loadingAction$ = this.loadingSubject.asObservable();

  showLoader() {
    // console.log(`show loader ${window.location.pathname}`);
    this.loadingSubject.next(true);
  }

  hideLoader() {
    // console.log(`hide loader : ${window.location.pathname}`);
    this.loadingSubject.next(false);
  }
}