import { TestBed } from '@angular/core/testing';

import { IappService } from './iapp.service';

describe('IappService', () => {
  let service: IappService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IappService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
