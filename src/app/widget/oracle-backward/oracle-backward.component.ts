import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-oracle-backward',
  templateUrl: './oracle-backward.component.html',
  styleUrls: ['./oracle-backward.component.scss']
})
export class OracleBackwardComponent implements OnInit {
  constructor(
    private location: Location
  ) { }

  ngOnInit(): void {
  }

  goBack(): void {
    this.location.back();
  }

}
