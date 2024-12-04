import { TestBed } from '@angular/core/testing';

import { TestNestService } from './test-nest.service';

describe('TestNestService', () => {
  let service: TestNestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TestNestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
