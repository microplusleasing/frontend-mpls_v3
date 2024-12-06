import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {
  private showHeaderSubject = new BehaviorSubject<boolean>(true);
  showHeader$: Observable<boolean> = this.showHeaderSubject.asObservable();

  setShowHeader(value: boolean): void {
    this.showHeaderSubject.next(value);
  }
}
