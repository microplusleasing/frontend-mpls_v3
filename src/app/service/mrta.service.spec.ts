import { TestBed } from '@angular/core/testing';

import { MrtaService } from './mrta.service';

describe('MrtaService', () => {
  let service: MrtaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MrtaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
