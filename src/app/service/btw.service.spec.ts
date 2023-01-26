import { TestBed } from '@angular/core/testing';

import { BtwService } from './btw.service';

describe('BtwService', () => {
  let service: BtwService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BtwService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
