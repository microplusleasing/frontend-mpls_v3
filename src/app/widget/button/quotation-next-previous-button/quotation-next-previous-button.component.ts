import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-quotation-next-previous-button',
  templateUrl: './quotation-next-previous-button.component.html',
  styleUrls: ['./quotation-next-previous-button.component.scss']
})
export class QuotationNextPreviousButtonComponent {
  isVisible = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;
    const scrolledToBottom = scrollHeight - clientHeight - scrollTop < 100;

    this.isVisible = scrolledToBottom;
  }

  backButtonClickHandler() {
    // Your click handler logic for the first button
    console.log('First Button clicked!');
  }

  nextButtonClickHandler() {
    // Your click handler logic for the second button
    console.log('Second Button clicked!');
  }
}