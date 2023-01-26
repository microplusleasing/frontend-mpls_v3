import { TestBed } from '@angular/core/testing';

import { ViewsignService } from './viewsign.service';

describe('ViewsignService', () => {
  let service: ViewsignService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ViewsignService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
