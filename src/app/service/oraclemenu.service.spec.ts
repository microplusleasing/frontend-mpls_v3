import { TestBed } from '@angular/core/testing';

import { OraclemenuService } from './oraclemenu.service';

describe('OraclemenuService', () => {
  let service: OraclemenuService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OraclemenuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
